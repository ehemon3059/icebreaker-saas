'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/lib/billing/plans'
import Link from 'next/link'

type PlanSlug = 'FREE' | 'PRO' | 'SCALE'

interface AuthState {
  loading: boolean
  userId: string | null
  userEmail: string | null
  currentPlan: PlanSlug
}

function inferPlan(limit: number): PlanSlug {
  if (limit >= PLANS.SCALE.credits) return 'SCALE'
  if (limit >= PLANS.PRO.credits) return 'PRO'
  return 'FREE'
}

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

export default function PricingSection() {
  const router = useRouter()
  const [auth, setAuth] = useState<AuthState>({
    loading: true,
    userId: null,
    userEmail: null,
    currentPlan: 'FREE',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setAuth({ loading: false, userId: null, userEmail: null, currentPlan: 'FREE' })
        return
      }

      try {
        const res = await fetch('/api/user/credits')
        if (res.ok) {
          const json = await res.json()
          const plan = inferPlan(json.data?.limit ?? 0)
          setAuth({ loading: false, userId: user.id, userEmail: user.email ?? '', currentPlan: plan })
          return
        }
      } catch {
        // fall through
      }

      setAuth({ loading: false, userId: user.id, userEmail: user.email ?? '', currentPlan: 'FREE' })
    }
    load()
  }, [])

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-card-2)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            style={{
              fontSize: '0.72rem', color: 'var(--purple-main)',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              marginBottom: '16px', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              justifyContent: 'center',
            }}
          >
            <span style={{ width: '20px', height: '1px', background: 'var(--purple-main)', display: 'inline-block' }} />
            Pricing
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px',
            }}
          >
            Simple, Honest Pricing
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', alignItems: 'start' }}>
          {PLAN_ORDER.map((slug) => {
            const plan = PLANS[slug]
            const isPro = slug === 'PRO'

            return (
              <div
                key={slug}
                style={{
                  background: 'var(--bg-card)',
                  border: isPro ? '2px solid var(--purple-main)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                  position: 'relative',
                  transform: isPro ? 'scale(1.03)' : 'none',
                  boxShadow: isPro ? '0 8px 32px rgba(107,78,255,0.15)' : 'none',
                }}
              >
                {/* Most Popular badge */}
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

                {/* Plan name */}
                <p
                  style={{
                    fontSize: '0.75rem', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontWeight: 600, marginBottom: '8px',
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                  }}
                >
                  {plan.name}
                </p>

                {/* Description */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {PLAN_DESCRIPTIONS[slug]}
                </p>

                {/* Price */}
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
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Pricing may vary based on your region
                  </p>
                )}

                <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <Check size={15} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <PlanButton auth={auth} slug={slug} router={router} />
              </div>
            )
          })}
        </div>

        {/* Regional pricing note */}
        <p
          style={{
            textAlign: 'center', marginTop: '32px',
            fontSize: '0.82rem', color: 'var(--text-muted)',
          }}
        >
          Pricing shown may vary by region. Regional pricing is applied automatically at checkout based on your location.
        </p>

        {/* See full pricing link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link
            href="/pricing"
            style={{
              fontSize: '0.88rem', color: 'var(--purple-main)',
              textDecoration: 'none', fontWeight: 600,
              transition: 'color 0.25s cubic-bezier(.4,0,.2,1)',
            }}
          >
            See Full Pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── PlanButton ───────────────────────────────────────────────────────────────

interface PlanButtonProps {
  auth: AuthState
  slug: PlanSlug
  router: ReturnType<typeof useRouter>
}

function PlanButton({ auth, slug, router }: PlanButtonProps) {
  const isPro = slug === 'PRO'

  const primaryStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '12px',
    borderRadius: '999px', textAlign: 'center',
    background: 'var(--purple-main)', color: '#ffffff',
    fontSize: '0.9rem', fontWeight: 600,
    border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(107,78,255,0.3)',
    transition: 'background 0.25s cubic-bezier(.4,0,.2,1)',
    textDecoration: 'none',
  }

  const secondaryStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '12px',
    borderRadius: '999px', textAlign: 'center',
    background: 'transparent', color: 'var(--text-secondary)',
    fontSize: '0.9rem', fontWeight: 600,
    border: '1px solid var(--border)', cursor: 'pointer',
    transition: 'border-color 0.25s cubic-bezier(.4,0,.2,1)',
    textDecoration: 'none',
  }

  const disabledStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '12px',
    borderRadius: '999px', textAlign: 'center',
    background: 'var(--purple-s1)', color: 'var(--text-muted)',
    fontSize: '0.9rem', fontWeight: 600,
    border: '1px solid var(--border)', cursor: 'not-allowed',
  }

  if (auth.loading) {
    return <div style={{ ...disabledStyle, opacity: 0.5 }}>Loading…</div>
  }

  if (!auth.userId) {
    return (
      <button
        onClick={() => router.push('/login')}
        style={isPro ? primaryStyle : secondaryStyle}
      >
        Get Started
      </button>
    )
  }

  if (slug === auth.currentPlan) {
    return <div style={disabledStyle}>Current Plan</div>
  }

  if (slug === 'FREE') {
    return <div style={{ ...disabledStyle, cursor: 'default' }}>Downgrade</div>
  }

  const planOrder: PlanSlug[] = ['FREE', 'PRO', 'SCALE']
  const isUpgrade = planOrder.indexOf(slug) > planOrder.indexOf(auth.currentPlan)

  if (isUpgrade) {
    return <div style={{ ...disabledStyle, opacity: 0.6 }}>Coming Soon</div>
  }

  return (
    <button
      onClick={() => router.push('/dashboard/billing')}
      style={secondaryStyle}
    >
      Downgrade
    </button>
  )
}
