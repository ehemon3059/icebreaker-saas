'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/lib/billing/plans'
import CheckoutButton from '@/components/billing/CheckoutButton'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanSlug = 'FREE' | 'PRO' | 'SCALE'

interface AuthState {
  loading: boolean
  userId: string | null
  userEmail: string | null
  currentPlan: PlanSlug
}

// Infer plan slug from credit limit so we don't need a separate endpoint
function inferPlan(limit: number): PlanSlug {
  if (limit >= PLANS.SCALE.credits) return 'SCALE'
  if (limit >= PLANS.PRO.credits) return 'PRO'
  return 'FREE'
}

// ─── Plan card config ─────────────────────────────────────────────────────────

const PLAN_ORDER: PlanSlug[] = ['FREE', 'PRO', 'SCALE']

const HIGHLIGHTED_PLAN: PlanSlug = 'PRO'

// ─── PricingSection ───────────────────────────────────────────────────────────

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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setAuth({ loading: false, userId: null, userEmail: null, currentPlan: 'FREE' })
        return
      }

      // Fetch credit limit to infer plan slug
      try {
        const res = await fetch('/api/user/credits')
        if (res.ok) {
          const json = await res.json()
          const plan = inferPlan(json.data?.limit ?? 0)
          setAuth({
            loading: false,
            userId: user.id,
            userEmail: user.email ?? '',
            currentPlan: plan,
          })
          return
        }
      } catch {
        // Fall through — treat as FREE
      }

      setAuth({
        loading: false,
        userId: user.id,
        userEmail: user.email ?? '',
        currentPlan: 'FREE',
      })
    }

    load()
  }, [])

  return (
    <section id="pricing" className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600">Start free. Upgrade when you need more.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PLAN_ORDER.map((slug) => {
            const plan = PLANS[slug]
            const isHighlighted = slug === HIGHLIGHTED_PLAN

            return (
              <div
                key={slug}
                className={[
                  'relative flex flex-col rounded-xl border p-6',
                  isHighlighted
                    ? 'border-blue-500 shadow-lg md:scale-105'
                    : 'border-gray-200 shadow-sm',
                ].join(' ')}
              >
                {/* "Most Popular" badge */}
                {isHighlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                {/* Plan name */}
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mb-4 flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="mb-1 text-gray-500">/mo</span>
                </div>

                {/* Credits callout */}
                <p className="mb-5 text-sm font-medium text-gray-700">
                  {plan.credits.toLocaleString()} icebreakers / month
                </p>

                {/* Feature list */}
                <ul className="mb-8 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check size={16} className="mt-0.5 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <PlanButton auth={auth} slug={slug} router={router} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── PlanButton ───────────────────────────────────────────────────────────────
// Isolated so the card layout isn't cluttered with branching logic.

interface PlanButtonProps {
  auth: AuthState
  slug: PlanSlug
  router: ReturnType<typeof useRouter>
}

const BASE =
  'w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors'
const PRIMARY = `${BASE} bg-blue-600 text-white hover:bg-blue-700`
const SECONDARY = `${BASE} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`
const DISABLED = `${BASE} cursor-not-allowed bg-gray-100 text-gray-400`

function PlanButton({ auth, slug, router }: PlanButtonProps) {
  const plan = PLANS[slug]

  // While loading — show a neutral skeleton button
  if (auth.loading) {
    return <button disabled className={DISABLED}>Loading…</button>
  }

  // ── Not logged in → always "Get Started" → /login ─────────────────────────
  if (!auth.userId) {
    return (
      <button onClick={() => router.push('/login')} className={PRIMARY}>
        Get Started
      </button>
    )
  }

  // ── Logged in ──────────────────────────────────────────────────────────────
  const isCurrent = slug === auth.currentPlan

  // Current plan — disabled
  if (isCurrent) {
    return <button disabled className={DISABLED}>Current Plan</button>
  }

  // FREE card — user is on a paid plan, show subtle downgrade note
  if (slug === 'FREE') {
    return (
      <button disabled className={DISABLED}>
        Downgrade
      </button>
    )
  }

  // Paid upgrade — hand off to CheckoutButton (opens Lemon Squeezy overlay)
  const isUpgrade =
    (auth.currentPlan === 'FREE') ||
    (auth.currentPlan === 'PRO' && slug === 'SCALE')

  if (isUpgrade && plan.variantId) {
    return (
      <CheckoutButton
        variantId={plan.variantId}
        userId={auth.userId}
        userEmail={auth.userEmail ?? ''}
        label={`Upgrade to ${plan.name}`}
        className={PRIMARY}
      />
    )
  }

  // Fallback (e.g. Scale user seeing Pro card) — subtle downgrade
  return (
    <button disabled className={SECONDARY}>
      Downgrade
    </button>
  )
}
