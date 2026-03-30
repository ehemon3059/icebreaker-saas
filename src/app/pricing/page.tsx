import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/lib/billing/plans'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — Simple, Honest Pricing',
  description: 'All plans include the same core features. Pay only for the credits you use. Cancel anytime.',
}

type PlanSlug = 'FREE' | 'PRO' | 'SCALE'
const PLAN_ORDER: PlanSlug[] = ['FREE', 'PRO', 'SCALE']

const PLAN_DESCRIPTIONS: Record<PlanSlug, string> = {
  FREE: 'For individuals exploring the product',
  PRO: 'For sales professionals and small teams',
  SCALE: 'For agencies and high-volume teams',
}

const PLAN_PRICE_LABEL: Record<PlanSlug, string> = {
  FREE: '$0',
  PRO: 'Starting at $9',
  SCALE: '$79',
}

const PRICING_FAQS = [
  {
    q: 'What counts as a credit?',
    a: 'One successfully generated icebreaker uses 1 credit. If a scrape fails and no icebreaker is produced, you are not charged.',
  },
  {
    q: 'Do unused credits roll over?',
    a: 'No. Credits reset on your billing date each month. Unused credits do not carry forward.',
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes — cancel from your dashboard in one click. You'll keep your plan until the end of the billing period.",
  },
  {
    q: 'Why does my price look different at checkout?',
    a: 'IcebreakerAI offers regional pricing to make the product accessible globally. The price shown at checkout is your local price and will not change after you subscribe. All plans include identical features.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'We offer a 7-day refund on your first subscription payment. After 7 days or after the second billing cycle, payments are non-refundable.',
  },
]

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentPlan: PlanSlug = 'FREE'

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { subscriptionTier: true },
    })
    if (dbUser?.subscriptionTier) {
      currentPlan = dbUser.subscriptionTier as PlanSlug
    }
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* Beta bar */}
      <div
        style={{
          background: 'var(--purple-s1)',
          borderBottom: '1px solid var(--purple-s2)',
          padding: '10px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.82rem', color: 'var(--purple-main)', fontWeight: 500 }}>
          🟢 IcebreakerAI is currently in Beta. Early users get priority support and locked-in pricing.
        </p>
      </div>

      {/* Header */}
      <div style={{ padding: '64px 24px 48px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: 'var(--font-sora), Sora, sans-serif',
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800, color: 'var(--text-primary)',
            marginBottom: '16px', letterSpacing: '-0.02em',
          }}
        >
          Simple Pricing. No Surprises.
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          All plans include the same core features. Pay only for the credits you use.
          Cancel anytime, no questions asked.
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', alignItems: 'start' }}>
          {PLAN_ORDER.map((slug) => {
            const plan = PLANS[slug]
            const isPro = slug === 'PRO'
            const isCurrent = currentPlan === slug
            const currentIdx = PLAN_ORDER.indexOf(currentPlan)
            const planIdx = PLAN_ORDER.indexOf(slug)
            const isUpgrade = planIdx > currentIdx
            const isDowngrade = planIdx < currentIdx

            return (
              <div
                key={slug}
                style={{
                  background: 'var(--bg-card)',
                  border: isPro ? '2px solid var(--purple-main)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '32px',
                  position: 'relative',
                  transform: isPro ? 'scale(1.03)' : 'none',
                  boxShadow: isPro ? '0 8px 40px rgba(107,78,255,0.15)' : 'none',
                }}
              >
                {isPro && (
                  <div
                    style={{
                      position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--purple-main)', color: '#ffffff',
                      fontSize: '0.72rem', fontWeight: 700,
                      padding: '4px 14px', borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ⭐ Most Popular
                  </div>
                )}

                <p
                  style={{
                    fontSize: '0.75rem', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontWeight: 600, marginBottom: '6px',
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                  }}
                >
                  {plan.name}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {PLAN_DESCRIPTIONS[slug]}
                </p>

                <div style={{ marginBottom: '4px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-sora), Sora, sans-serif',
                      fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)',
                    }}
                  >
                    {PLAN_PRICE_LABEL[slug]}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '4px' }}>/month</span>
                </div>

                {slug === 'PRO' && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Your exact price is shown at checkout based on your country.
                    Pricing may vary by region. All plans include the same features regardless of region.
                  </p>
                )}

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {plan.credits.toLocaleString()} credits / month
                </p>

                <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <Check size={15} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <PlanCta
                  slug={slug}
                  planName={plan.name}
                  isCurrent={isCurrent}
                  isUpgrade={isUpgrade}
                  isDowngrade={isDowngrade}
                  isLoggedIn={!!user}
                  isPro={isPro}
                />
              </div>
            )
          })}
        </div>

        {/* Regional note */}
        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Pricing shown may vary by region. Regional pricing is applied automatically at checkout based on your location.
        </p>

        {/* Trust row */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '24px', flexWrap: 'wrap', marginTop: '32px',
          }}
        >
          {['✅ Cancel anytime', '✅ No hidden fees', '✅ No contracts', '✅ Instant access after payment', '✅ Data encrypted', '✅ Currently in Beta'].map((t) => (
            <span key={t} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* How Credits Work */}
      <div style={{ background: 'var(--bg-card-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700, color: 'var(--text-primary)',
              marginBottom: '24px', textAlign: 'center',
            }}
          >
            How Credits Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '20px' }}>
            {[
              { num: '1', title: 'One credit = one icebreaker', body: 'Each successfully generated opening line uses exactly 1 credit from your monthly balance.' },
              { num: '2', title: 'Failed scrapes are free', body: 'If we cannot access a prospect\'s website, you are not charged. The AI still tries to generate with available info.' },
              { num: '3', title: 'Credits reset monthly', body: 'Your credits refresh on your billing date each month. Unused credits do not roll over.' },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'var(--purple-s1)',
                    border: '1px solid var(--purple-s2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                    fontSize: '0.9rem', fontWeight: 700,
                    color: 'var(--purple-main)',
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                  }}
                >
                  {item.num}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '0.95rem', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing & Payment */}
      <div style={{ padding: '64px 24px', maxWidth: '700px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-sora), Sora, sans-serif',
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            fontWeight: 700, color: 'var(--text-primary)',
            marginBottom: '20px', textAlign: 'center',
          }}
        >
          Billing & Payment
        </h2>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            We use a secure third-party payment processor to handle all billing, taxes, and compliance.
            Your payment information is never stored on our servers.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Accepted payment methods:</strong>{' '}
            Visa, Mastercard, PayPal, Apple Pay, Google Pay.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            All transactions are encrypted and processed securely. Applicable sales tax and VAT is
            calculated and collected automatically based on your location.
          </p>
        </div>
      </div>

      {/* Pricing FAQ */}
      <div style={{ background: 'var(--bg-card-2)', borderTop: '1px solid var(--border)', padding: '64px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 700, color: 'var(--text-primary)',
              marginBottom: '32px', textAlign: 'center',
            }}
          >
            Pricing FAQ
          </h2>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {PRICING_FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ borderBottom: i < PRICING_FAQS.length - 1 ? '1px solid var(--border)' : 'none', padding: '20px 24px' }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '0.95rem', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}
                >
                  {faq.q}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── PlanCta ──────────────────────────────────────────────────────────────────

function PlanCta({
  slug,
  isCurrent,
  isUpgrade,
  isDowngrade,
  isLoggedIn,
  isPro,
}: {
  slug: PlanSlug
  planName: string
  isCurrent: boolean
  isUpgrade: boolean
  isDowngrade: boolean
  isLoggedIn: boolean
  isPro: boolean
}) {
  const primaryStyle = {
    display: 'block', width: '100%', padding: '12px',
    borderRadius: '999px', textAlign: 'center' as const,
    background: 'var(--purple-main)', color: '#ffffff',
    fontSize: '0.9rem', fontWeight: 600,
    boxShadow: '0 4px 20px rgba(107,78,255,0.3)',
    textDecoration: 'none',
  }
  const secondaryStyle = {
    display: 'block', width: '100%', padding: '12px',
    borderRadius: '999px', textAlign: 'center' as const,
    background: 'transparent', color: 'var(--text-secondary)',
    fontSize: '0.9rem', fontWeight: 600,
    border: '1px solid var(--border)',
    textDecoration: 'none',
  }
  const disabledStyle = {
    display: 'block', width: '100%', padding: '12px',
    borderRadius: '999px', textAlign: 'center' as const,
    background: 'var(--purple-s1)', color: 'var(--text-muted)',
    fontSize: '0.9rem', fontWeight: 600,
    border: '1px solid var(--border)', cursor: 'not-allowed',
  }

  if (!isLoggedIn) {
    return <Link href="/login" style={isPro ? primaryStyle : secondaryStyle}>Get Started</Link>
  }

  if (isCurrent) {
    return <div style={disabledStyle}>Current Plan</div>
  }

  if (slug === 'FREE' && isDowngrade) {
    return <Link href="/dashboard/billing" style={secondaryStyle}>Downgrade to Free</Link>
  }

  if (isDowngrade) {
    return <Link href="/dashboard/billing" style={secondaryStyle}>Downgrade</Link>
  }

  if (isUpgrade) {
    return <div style={{ ...disabledStyle, opacity: 0.6 }}>Coming Soon</div>
  }

  return null
}
