import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/lib/billing/plans'
import CreditsIndicator from '@/components/billing/CreditsIndicator'

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [dbUser, subscription, recentUsage] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        email: true,
        name: true,
        subscriptionTier: true,
        creditLimit: true,
        creditsUsed: true,
        creditsResetAt: true,
      },
    }),
    prisma.subscription.findUnique({
      where: { userId: user.id },
      select: {
        status: true,
        plan: true,
        currentPeriodEnd: true,
        cancelledAt: true,
      },
    }),
    prisma.usageLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, action: true, createdAt: true, metadata: true },
    }),
  ])

  const plan = dbUser.subscriptionTier.toUpperCase()
  const isPaid = plan === 'PRO' || plan === 'SCALE'

  // Next reset: prefer subscription period end, fall back to manual reset date
  const resetDate = subscription?.currentPeriodEnd ?? dbUser.creditsResetAt

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account & Billing</h1>
          <p className="mt-1 text-sm text-gray-500">{dbUser.email}</p>
        </div>

        {/* ── Section 1: Current Plan ─────────────────────────────────────── */}
        <Section title="Current Plan">
          <div className="space-y-5">
            {/* Plan badge */}
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${planBadgeStyle(plan)}`}>
                {PLANS[plan as keyof typeof PLANS]?.name ?? plan}
              </span>
              {subscription?.status === 'cancelled' && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  Cancels {formatDate(subscription.cancelledAt)}
                </span>
              )}
              {subscription?.status === 'past_due' && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Payment past due
                </span>
              )}
            </div>

            {/* Credits bar */}
            <CreditsIndicator
              used={dbUser.creditsUsed}
              limit={dbUser.creditLimit}
              plan={plan}
            />

            {/* Reset date */}
            {resetDate && (
              <p className="text-xs text-gray-400">
                Credits reset on{' '}
                <span className="font-medium text-gray-600">{formatDate(resetDate)}</span>
              </p>
            )}
          </div>
        </Section>

        {/* ── Section 2: Subscription Management ─────────────────────────── */}
        <Section title="Subscription">
          {isPaid ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                You&apos;re on the <span className="font-medium">{plan}</span> plan.
                Billing management will be available soon.
              </p>
              {subscription?.currentPeriodEnd && (
                <p className="text-xs text-gray-400">
                  Current period ends {formatDate(subscription.currentPeriodEnd)}.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                Upgrade to unlock more icebreakers and bulk CSV processing.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[PLANS.PRO, PLANS.SCALE].map((p) => (
                  <div key={p.slug} className={`rounded-xl border p-4 ${p.slug === 'PRO' ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'}`}>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      ${p.price}/mo &mdash; {p.credits.toLocaleString()} credits
                    </p>
                    <button
                      disabled
                      className={`w-full rounded-lg py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed ${
                        p.slug === 'PRO' ? 'bg-indigo-600' : 'bg-gray-900'
                      }`}
                    >
                      Coming Soon
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ── Section 3: Usage History ────────────────────────────────────── */}
        <Section title="Recent Usage">
          {recentUsage.length === 0 ? (
            <p className="text-sm text-gray-400">No usage yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentUsage.map((log) => {
                const meta = log.metadata as Record<string, string> | null
                return (
                  <div key={log.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 capitalize">
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      {meta?.leadName && (
                        <p className="text-xs text-gray-400">
                          {meta.leadName}{meta.company ? ` · ${meta.company}` : ''}
                        </p>
                      )}
                    </div>
                    <time className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {formatDate(log.createdAt)}
                    </time>
                  </div>
                )
              })}
            </div>
          )}
          <div className="mt-3">
            <Link href="/dashboard/jobs" className="text-xs text-indigo-600 hover:underline">
              View all jobs →
            </Link>
          </div>
        </Section>

      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">{title}</h2>
      {children}
    </div>
  )
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function planBadgeStyle(plan: string): string {
  if (plan === 'PRO') return 'bg-indigo-100 text-indigo-700'
  if (plan === 'SCALE') return 'bg-purple-100 text-purple-700'
  return 'bg-gray-100 text-gray-600'
}

function ExternalLinkIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}
