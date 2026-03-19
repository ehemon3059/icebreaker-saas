import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id: jobId } = await params

  // Ownership check
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

  // Fetch all leads for this job with their latest generated message
  const leads = await prisma.lead.findMany({
    where: { jobId },
    orderBy: { createdAt: 'asc' },
    include: {
      generatedMessages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  const results = leads.map((lead) => {
    const msg = lead.generatedMessages[0] ?? null
    return {
      leadId: lead.id,
      name: lead.name,
      company: lead.company,
      title: lead.title ?? '',
      website: lead.website ?? null,
      messageId: msg?.id ?? null,
      message: msg?.content ?? null,
      isClean: msg?.isClean ?? true,
      flaggedWords: msg?.flaggedWords ?? [],
    }
  })

  return NextResponse.json({ success: true, data: results })
}
