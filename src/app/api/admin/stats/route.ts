import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  })

  if (!dbUser?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [users, leads, messages, subscriptions, campaigns, processingJobs, usageLogs] =
    await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.generatedMessage.count(),
      prisma.subscription.count(),
      prisma.campaign.count(),
      prisma.processingJob.count(),
      prisma.usageLog.count(),
    ])

  return NextResponse.json({ users, leads, messages, subscriptions, campaigns, processingJobs, usageLogs })
}
