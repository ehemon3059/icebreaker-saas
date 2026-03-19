'use client'

import Link from 'next/link'

export interface CreditsIndicatorProps {
  used: number
  limit: number
  plan: string
}

export default function CreditsIndicator({ used, limit, plan }: CreditsIndicatorProps) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 100
  const isExhausted = pct >= 100

  const barColor =
    pct >= 90 ? 'bg-red-500' :
    pct >= 70 ? 'bg-yellow-400' :
                'bg-green-500'

  const textColor =
    pct >= 90 ? 'text-red-600' :
    pct >= 70 ? 'text-yellow-600' :
                'text-gray-500'

  return (
    <div className="space-y-1.5">
      {/* Plan badge + upgrade link */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 capitalize">
          {plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()}
        </span>
        {isExhausted && (
          <Link
            href="/pricing"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Upgrade →
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Usage text */}
      <p className={`text-xs ${textColor}`}>
        {used.toLocaleString()} / {limit.toLocaleString()} credits used
      </p>
    </div>
  )
}
