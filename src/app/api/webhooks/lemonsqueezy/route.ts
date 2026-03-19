import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPlanByVariantId } from '@/lib/billing/plans'

export async function POST(req: NextRequest) {
  // ── Step 1: Verify signature ───────────────────────────────────────────────
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''

  const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
  hmac.update(rawBody)
  const digest = hmac.digest('hex')

  if (digest !== signature) {
    console.warn('[LS Webhook] Invalid signature — rejected')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  // ── Step 2: Parse event ────────────────────────────────────────────────────
  const body = JSON.parse(rawBody)

  const eventName: string = body?.meta?.event_name ?? ''
  const userId: string | undefined = body?.meta?.custom_data?.user_id
  const variantId: string = String(body?.data?.attributes?.variant_id ?? '')
  const subscriptionId: string = String(body?.data?.id ?? '')
  const customerId: string = String(body?.data?.attributes?.customer_id ?? '')
  const status: string = body?.data?.attributes?.status ?? ''
  const currentPeriodEnd: string | undefined = body?.data?.attributes?.renews_at

  console.info(`[LS Webhook] ${eventName} | user=${userId} | variant=${variantId}`)

  // ── Step 3: Handle events ──────────────────────────────────────────────────
  switch (eventName) {

    case 'subscription_created': {
      const plan = getPlanByVariantId(variantId)
      if (!plan || !userId) break

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: plan.slug,
          creditLimit: plan.credits,
          creditsUsed: 0,
        },
      })

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          lemonSqueezyId: subscriptionId,
          lemonSqueezyCustomerId: customerId,
          variantId,
          status: 'active',
          plan: plan.slug,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
        },
        update: {
          lemonSqueezyId: subscriptionId,
          lemonSqueezyCustomerId: customerId,
          variantId,
          status: 'active',
          plan: plan.slug,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined,
        },
      })
      break
    }

    case 'subscription_updated': {
      const plan = getPlanByVariantId(variantId)
      if (!plan || !userId) break

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: plan.slug,
          creditLimit: plan.credits,
          // Do NOT reset creditsUsed on upgrade — only on new billing cycle
        },
      })

      await prisma.subscription.update({
        where: { userId },
        data: {
          variantId,
          plan: plan.slug,
          status,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined,
        },
      })
      break
    }

    case 'subscription_cancelled': {
      // Mark cancelled — don't downgrade yet, user keeps access until period end
      if (!userId) break

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      })
      break
    }

    case 'subscription_payment_success': {
      // Recurring payment — reset credits for new billing cycle
      if (!userId) break

      await prisma.user.update({
        where: { id: userId },
        data: {
          creditsUsed: 0,
          creditsResetAt: new Date(),
        },
      })

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: 'active',
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined,
        },
      })
      break
    }

    case 'subscription_payment_failed': {
      // Payment failed — mark past_due; LS will retry and eventually cancel
      if (!userId) break

      await prisma.subscription.update({
        where: { userId },
        data: { status: 'past_due' },
      })
      break
    }

    default:
      // Unknown event — log and ignore; always return 200
      console.info(`[LS Webhook] Unhandled event: ${eventName}`)
  }

  // Always 200 — non-200 causes LS to retry the webhook
  return NextResponse.json({ received: true })
}
