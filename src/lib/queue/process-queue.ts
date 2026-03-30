import { prisma } from '@/lib/prisma'
import { redis, QUEUE_KEY } from '@/lib/queue/redis'
import { scrapeWithCache } from '@/features/scraper/cache.service'
import { generateIcebreaker } from '@/features/ai/gemini.service'
import { checkForSpam } from '@/features/ai/spam-checker'
import { triggerWorker } from '@/lib/queue/qstash'

// Process 1 lead per invocation — fits in Vercel Hobby's 10s limit.
// If more leads remain, re-triggers itself via QStash.
const BATCH_SIZE = 1

export async function processQueue() {
  const jobId = await redis.rpop<string>(QUEUE_KEY)
  if (!jobId) return { message: 'Queue empty' }

  const job = await prisma.processingJob.findUnique({ where: { id: jobId } })
  if (!job) return { error: 'Job not found' }
  if (job.status === 'completed' || job.status === 'failed') {
    return { message: `Job ${jobId} already ${job.status}` }
  }

  await prisma.processingJob.update({
    where: { id: jobId },
    data: { status: 'processing' },
  })

  const batch = await prisma.lead.findMany({
    where: { jobId },
    orderBy: { createdAt: 'asc' },
    skip: job.processedLeads,
    take: BATCH_SIZE,
  })

  const remainingAfterBatch = job.totalLeads - job.processedLeads - batch.length
  let batchProcessed = 0
  let batchFailed = 0

  for (const lead of batch) {
    try {
      let companyContext: string | null = null
      const urlToScrape = lead.website ?? lead.linkedinUrl ?? null
      if (urlToScrape) {
        const scrapeResult = await scrapeWithCache(urlToScrape)
        companyContext = scrapeResult.context
      }

      const generated = await generateIcebreaker({
        name: lead.name,
        title: lead.title ?? '',
        company: lead.company,
        companyContext,
      })

      const spamCheck = checkForSpam(generated.message)

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
      console.error(`[worker] Failed lead ${lead.id} in job ${jobId}:`, err)
      batchFailed++
    }
  }

  const totalProcessed = job.processedLeads + batchProcessed
  const totalFailed = job.failedLeads + batchFailed
  const isJobComplete = remainingAfterBatch <= 0

  if (isJobComplete) {
    const finalStatus = totalProcessed === 0 ? 'failed' : 'completed'
    await prisma.processingJob.update({
      where: { id: jobId },
      data: { status: finalStatus, processedLeads: totalProcessed, failedLeads: totalFailed },
    })
    if (batchProcessed > 0) {
      await prisma.user.update({
        where: { id: job.userId },
        data: { creditsUsed: { increment: batchProcessed } },
      })
    }
  } else {
    // More leads remain — update progress, re-queue, trigger next invocation
    await prisma.processingJob.update({
      where: { id: jobId },
      data: { status: 'pending', processedLeads: totalProcessed, failedLeads: totalFailed },
    })
    await redis.lpush(QUEUE_KEY, jobId)
    await triggerWorker() // QStash will call worker again for next lead
  }

  return { jobId, batchProcessed, batchFailed, totalProcessed, isJobComplete }
}
