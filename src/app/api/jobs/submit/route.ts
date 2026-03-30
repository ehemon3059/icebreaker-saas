import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redis, QUEUE_KEY } from '@/lib/queue/redis'
import type { ParsedLead } from '@/components/csv/CsvColumnMapper'
import { checkCredits } from '@/lib/billing/usage'
import { triggerWorker } from '@/lib/queue/qstash'

// ─── Response helpers ─────────────────────────────────────────────────────────

function errorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status })
}

// ─── POST /api/jobs/submit ────────────────────────────────────────────────────

export async function POST(request: Request) {
  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return errorResponse('Authentication required', 401)
  }

  // ── 2. Validate body ──────────────────────────────────────────────────────
  let leads: ParsedLead[]
  try {
    const body = await request.json()
    leads = body.leads
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }

  if (!Array.isArray(leads) || leads.length === 0) {
    return errorResponse('leads must be a non-empty array', 400)
  }

  // ── 3. Credit check ───────────────────────────────────────────────────────
  const creditStatus = await checkCredits(user.id)

  if ((creditStatus.limit - creditStatus.used) < leads.length) {
    return NextResponse.json({
      success: false,
      error: `You need ${leads.length} credits but only have ${(creditStatus.limit - creditStatus.used)}. Remove some leads or upgrade.`,
      code: 'INSUFFICIENT_CREDITS',
      credits: creditStatus,
    }, { status: 403 })
  }

  // ── 4. Create ProcessingJob ───────────────────────────────────────────────
  const job = await prisma.processingJob.create({
    data: {
      userId: user.id,
      status: 'pending',
      totalLeads: leads.length,
      processedLeads: 0,
      failedLeads: 0,
    },
  })

  // ── 5. Bulk-insert Leads linked to this job ───────────────────────────────
  await prisma.lead.createMany({
    data: leads.map((lead) => ({
      name: lead.name,
      title: lead.title ?? '',
      company: lead.company,
      email: lead.email ?? null,
      website: lead.website ?? null,
      linkedinUrl: lead.linkedinUrl ?? null,
      source: 'csv',
      userId: user.id,
      jobId: job.id,
    })),
  })

  // ── 6. Push only the jobId into Redis ────────────────────────────────────
  // Never push lead data — avoids payload size limits on large CSVs.
  await redis.lpush(QUEUE_KEY, job.id)

  // ── 7. Trigger worker via QStash (works on Vercel Hobby) ─────────────────
  await triggerWorker().catch(() => null)

  // ── 8. Return immediately — worker handles the rest ──────────────────────
  return NextResponse.json({
    success: true,
    data: { jobId: job.id },
  })
}
