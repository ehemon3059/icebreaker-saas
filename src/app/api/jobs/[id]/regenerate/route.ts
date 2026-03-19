import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { scrapeWithCache } from '@/features/scraper/cache.service'
import { generateIcebreaker } from '@/features/ai/gemini.service'
import { checkForSpam } from '@/features/ai/spam-checker'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id: jobId } = await params

  // Ownership check on the job
  const job = await prisma.processingJob.findUnique({
    where: { id: jobId },
    select: { userId: true },
  })

  if (!job) {
    return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
  }
  if (job.userId !== user.id) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  // Validate body
  let leadId: string
  try {
    const body = await request.json()
    leadId = body.leadId
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!leadId) {
    return NextResponse.json({ success: false, error: 'leadId is required' }, { status: 400 })
  }

  // Verify lead belongs to this job
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, jobId },
  })

  if (!lead) {
    return NextResponse.json({ success: false, error: 'Lead not found in this job' }, { status: 404 })
  }

  // Re-scrape + re-generate
  let companyContext: string | null = null
  const urlToScrape = lead.website ?? lead.linkedinUrl ?? null
  if (urlToScrape) {
    const scrapeResult = await scrapeWithCache(urlToScrape)
    companyContext = scrapeResult.context
  }

  let generated: { message: string; tokensUsed: number; estimatedCost: number }
  try {
    generated = await generateIcebreaker({
      name: lead.name,
      title: lead.title ?? '',
      company: lead.company,
      companyContext,
    })
  } catch (err) {
    console.error('[api/regenerate] Gemini error:', err)
    return NextResponse.json({ success: false, error: 'AI generation failed' }, { status: 502 })
  }

  const spamCheck = checkForSpam(generated.message)

  // Upsert: update existing message or create a new one
  const existingMsg = await prisma.generatedMessage.findFirst({
    where: { leadId },
    orderBy: { createdAt: 'desc' },
  })

  let messageId: string
  if (existingMsg) {
    const updated = await prisma.generatedMessage.update({
      where: { id: existingMsg.id },
      data: {
        content: generated.message,
        tokensUsed: generated.tokensUsed,
        estimatedCost: generated.estimatedCost,
        isClean: spamCheck.isClean,
        flaggedWords: spamCheck.flaggedWords,
      },
    })
    messageId = updated.id
  } else {
    const created = await prisma.generatedMessage.create({
      data: {
        content: generated.message,
        tokensUsed: generated.tokensUsed,
        estimatedCost: generated.estimatedCost,
        isClean: spamCheck.isClean,
        flaggedWords: spamCheck.flaggedWords,
        leadId,
        userId: user.id,
      },
    })
    messageId = created.id
  }

  // No credit deduction — user already paid for this lead

  return NextResponse.json({
    success: true,
    data: {
      messageId,
      message: generated.message,
      isClean: spamCheck.isClean,
      flaggedWords: spamCheck.flaggedWords,
    },
  })
}
