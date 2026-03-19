import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const FREE_CREDIT_LIMIT = 10

// ─── Auth guard ───────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return !!cronSecret && authHeader === `Bearer ${cronSecret}`
}

// ─── POST /api/crons/check-subscriptions ──────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 1. Find cancelled subscriptions past their period end ─────────────────
  const expired = await prisma.subscription.findMany({
    where: {
      status: 'cancelled',
      currentPeriodEnd: { lt: new Date() },
    },
    select: {
      id: true,
      userId: true,
      user: { select: { creditsUsed: true } },
    },
  })

  if (expired.length === 0) {
    console.info('[check-subscriptions] No expired subscriptions found')
    return NextResponse.json({ success: true, expired: 0 })
  }

  // ── 2. Downgrade each expired subscription ────────────────────────────────
  await Promise.all(
    expired.map(async ({ id, userId, user }) => {
      // Cap creditsUsed at the new free limit so they're not locked out
      const newCreditsUsed = Math.min(user.creditsUsed, FREE_CREDIT_LIMIT)

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: 'FREE',
          creditLimit: FREE_CREDIT_LIMIT,
          creditsUsed: newCreditsUsed,
        },
      })

      await prisma.subscription.update({
        where: { id },
        data: { status: 'expired' },
      })
    })
  )

  console.info(`[check-subscriptions] Expired ${expired.length} subscription(s)`)

  return NextResponse.json({ success: true, expired: expired.length })
}

// Vercel Cron sends GET — alias it
export const GET = POST
