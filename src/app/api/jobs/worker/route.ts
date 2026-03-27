import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redis, QUEUE_KEY } from '@/lib/queue/redis'
import { scrapeWithCache } from '@/features/scraper/cache.service'
import { generateIcebreaker } from '@/features/ai/gemini.service'
import { checkForSpam } from '@/features/ai/spam-checker'

const BATCH_SIZE = 50
const LEAD_DELAY_MS = 500

// ─── Auth guard ───────────────────────────────────────────────────────────────

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  return authHeader === `Bearer ${cronSecret}`
}

// ─── POST /api/jobs/worker ────────────────────────────────────────────────────

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 1. Pop next jobId from Redis ──────────────────────────────────────────
  const jobId = await redis.rpop<string>(QUEUE_KEY)

  if (!jobId) {
    return NextResponse.json({ message: 'Queue empty' })
  }

  // ── 2. Fetch job + validate ───────────────────────────────────────────────
  const job = await prisma.processingJob.findUnique({ where: { id: jobId } })

  if (!job) {
    console.error(`[worker] Job ${jobId} not found in database`)
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  if (job.status === 'completed' || job.status === 'failed') {
    return NextResponse.json({ message: `Job ${jobId} already ${job.status}` })
  }

  // ── 3. Mark as processing ─────────────────────────────────────────────────
  await prisma.processingJob.update({
    where: { id: jobId },
    data: { status: 'processing' },
  })

  // ── 4. Fetch this batch of leads ──────────────────────────────────────────
  // Use processedLeads as the skip offset so we can resume across invocations.
  const batch = await prisma.lead.findMany({
    where: { jobId },
    orderBy: { createdAt: 'asc' },
    skip: job.processedLeads,
    take: BATCH_SIZE,
  })

  const remainingAfterBatch = job.totalLeads - job.processedLeads - batch.length
  let batchProcessed = 0
  let batchFailed = 0

  // ── 5. Process each lead ──────────────────────────────────────────────────
  for (const lead of batch) {
    try {
      // a. Scrape website (skip if none)
      let companyContext: string | null = null
      const urlToScrape = lead.website ?? lead.linkedinUrl ?? null
      if (urlToScrape) {
        const scrapeResult = await scrapeWithCache(urlToScrape)
        companyContext = scrapeResult.context
      }

      // b. Generate icebreaker
      const generated = await generateIcebreaker({
        name: lead.name,
        title: lead.title ?? '',
        company: lead.company,
        companyContext,
      })

      // c. Spam check
      const spamCheck = checkForSpam(generated.message)

      // d. Save GeneratedMessage
      await prisma.generatedMessage.create({
        data: {
          content: generated.message,
          tokensUsed: generated.tokensUsed,
          estimatedCost: generated.estimatedCost,
          isClean: spamCheck.isClean,
          flaggedWords: spamCheck.flaggedWords,
          leadId: lead.id,
          userId: job.userId,
        },
      })

      batchProcessed++
    } catch (err) {
      // g. One failed lead must not stop the whole job
      console.error(`[worker] Failed lead ${lead.id} in job ${jobId}:`, err)
      batchFailed++
    }

    // Rate limit between leads — avoid hammering scraped sites
    if (lead !== batch[batch.length - 1]) {
      await new Promise((resolve) => setTimeout(resolve, LEAD_DELAY_MS))
    }
  }

  const totalProcessed = job.processedLeads + batchProcessed
  const totalFailed = job.failedLeads + batchFailed
  const isJobComplete = remainingAfterBatch <= 0

  // ── 6. Update job progress ────────────────────────────────────────────────
  if (isJobComplete) {
    const finalStatus = totalProcessed === 0 ? 'failed' : 'completed'
    await prisma.processingJob.update({
      where: { id: jobId },
      data: {
        status: finalStatus,
        processedLeads: totalProcessed,
        failedLeads: totalFailed,
      },
    })
    console.info(
      `[worker] Job ${jobId} ${finalStatus} — ${totalProcessed}/${job.totalLeads} leads processed` +
      (totalFailed > 0 ? `, ${totalFailed} failed` : '')
    )

    // ── 7. Credit deduction — only for successful generations ───────────────
    const creditsToCharge = batchProcessed
    if (creditsToCharge > 0) {
      await prisma.user.update({
        where: { id: job.userId },
        data: { creditsUsed: { increment: creditsToCharge } },
      })
    }
  } else {
    // More leads remain — update progress and re-queue for next cron tick
    await prisma.processingJob.update({
      where: { id: jobId },
      data: {
        status: 'pending',
        processedLeads: totalProcessed,
        failedLeads: totalFailed,
      },
    })

    await redis.lpush(QUEUE_KEY, jobId)
    console.info(`[worker] Job ${jobId} partially processed (${totalProcessed}/${job.totalLeads}), re-queued`)
  }

  return NextResponse.json({
    jobId,
    batchProcessed,
    batchFailed,
    totalProcessed,
    isJobComplete,
  })
}

// Vercel Cron also calls GET for scheduled runs
export const GET = POST
