import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/lib/billing/plans'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanSlug = 'FREE' | 'PRO' | 'SCALE'

const PLAN_ORDER: PlanSlug[] = ['FREE', 'PRO', 'SCALE']

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function PricingPage() {
  // Try to get the logged-in user — pricing page is public, so no redirect
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="pt-16 pb-12 text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
          Generate personalized icebreakers at scale. Start free, upgrade when you&apos;re ready.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
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
                className={`relative rounded-2xl bg-white p-8 flex flex-col gap-6 ${
                  isPro
                    ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-100'
                    : 'border border-gray-200 shadow-sm'
                }`}
              >
                {/* Most Popular badge */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan name & price */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="mb-1 text-sm text-gray-400">/mo</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {plan.credits.toLocaleString()} icebreakers / month
                  </p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <PlanCta
                  slug={slug}
                  planName={plan.name}
                  isCurrent={isCurrent}
                  isUpgrade={isUpgrade}
                  isDowngrade={isDowngrade}
                  isLoggedIn={!!user}
                  isPro={isPro}
                  variantId={plan.variantId}
                />
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-gray-400">
          All plans include a 7-day free trial. Cancel anytime. Billed monthly.
          Credits reset on your billing anniversary.
        </p>
      </div>
    </div>
  )
}

// ─── PlanCta ──────────────────────────────────────────────────────────────────

function PlanCta({
  slug,
  planName,
  isCurrent,
  isUpgrade,
  isDowngrade,
  isLoggedIn,
  isPro,
  variantId,
}: {
  slug: PlanSlug
  planName: string
  isCurrent: boolean
  isUpgrade: boolean
  isDowngrade: boolean
  isLoggedIn: boolean
  isPro: boolean
  variantId: string | null
}) {
  // Not logged in → Get Started
  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
          isPro
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Get Started
      </Link>
    )
  }

  // Current plan
  if (isCurrent) {
    return (
      <button
        disabled
        className="block w-full rounded-xl bg-gray-100 py-2.5 text-center text-sm font-semibold text-gray-400 cursor-not-allowed"
      >
        Current Plan
      </button>
    )
  }

  // FREE plan has no checkout — downgrading goes to billing portal
  if (slug === 'FREE' && isDowngrade) {
    return (
      <Link
        href="/dashboard/billing"
        className="block w-full rounded-xl border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Downgrade to Free
      </Link>
    )
  }

  // Downgrade to a paid plan (SCALE → PRO)
  if (isDowngrade) {
    return (
      <Link
        href="/dashboard/billing"
        className="block w-full rounded-xl border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Downgrade
      </Link>
    )
  }

  // Upgrade — link to Lemon Squeezy checkout
  if (isUpgrade && variantId) {
    return (
      <Link
        href={`/api/billing/checkout?variantId=${variantId}`}
        className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
          isPro
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-900 text-white hover:bg-gray-700'
        }`}
      >
        Upgrade to {planName}
      </Link>
    )
  }

  return null
}

// ─── CheckIcon ────────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}
