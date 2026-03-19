import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // ── 2. Fetch job ──────────────────────────────────────────────────────────
  const { id } = await params

  const job = await prisma.processingJob.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      totalLeads: true,
      processedLeads: true,
      failedLeads: true,
      userId: true,
      createdAt: true,
    },
  })

  if (!job) {
    return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
  }

  // ── 3. Ownership check ────────────────────────────────────────────────────
  if (job.userId !== user.id) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  // ── 4. Return status ──────────────────────────────────────────────────────
  const progress =
    job.totalLeads > 0
      ? Math.round((job.processedLeads / job.totalLeads) * 100)
      : 0

  return NextResponse.json({
    success: true,
    data: {
      id: job.id,
      status: job.status,
      totalLeads: job.totalLeads,
      processedLeads: job.processedLeads,
      failedLeads: job.failedLeads,
      progress,
      createdAt: job.createdAt.toISOString(),
    },
  })
}
