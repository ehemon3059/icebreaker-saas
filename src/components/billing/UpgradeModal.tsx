'use client'

import { useEffect } from 'react'
import { PLANS } from '@/lib/billing/plans'

export interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  creditsUsed: number
  creditLimit: number
  userId: string
  userEmail: string
}

const UPGRADE_PLANS = [PLANS.PRO, PLANS.SCALE] as const

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  creditsUsed,
  creditLimit,
}: UpgradeModalProps) {
  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const normalizedPlan = currentPlan.toUpperCase()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <XIcon />
        </button>

        <div className="mb-6 text-center">
          <div className="mb-3 text-3xl">🚀</div>
          <h2 className="text-xl font-bold text-gray-900">You&apos;ve reached your limit</h2>
          <p className="mt-2 text-sm text-gray-500">
            You&apos;ve used all {creditLimit} icebreakers on your{' '}
            <span className="font-medium capitalize">{currentPlan.toLowerCase()}</span> plan
            ({creditsUsed}/{creditLimit})
          </p>
        </div>

        <div className="space-y-3">
          {UPGRADE_PLANS.filter((plan) => plan.slug !== normalizedPlan).map((plan) => (
            <div
              key={plan.slug}
              className={`flex items-center justify-between rounded-xl border p-4 ${
                plan.slug === 'PRO'
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div>
                <p className="font-semibold text-gray-900">{plan.name}</p>
                <p className="text-sm text-gray-500">
                  ${plan.price}/mo &mdash; {plan.credits.toLocaleString()} icebreakers
                </p>
              </div>
              <button
                disabled
                className={`ml-4 shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed ${
                  plan.slug === 'PRO' ? 'bg-indigo-600' : 'bg-gray-900'
                }`}
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

function XIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
