'use client'

import { useEffect, useState } from 'react'
import { useJobProgress } from '@/hooks/useJobProgress'

export interface JobProgressProps {
  jobId: string
  onComplete: () => void
}

export default function JobProgress({ jobId, onComplete }: JobProgressProps) {
  const { status, totalLeads, processedLeads, failedLeads, progress } = useJobProgress({
    jobId,
    pollingInterval: 3000,
    onComplete,
  })

  const [startTime] = useState(() => Date.now())
  const [elapsed, setElapsed] = useState(0)

  // Tick elapsed time every 10 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 10_000)
    return () => clearInterval(id)
  }, [startTime])

  function formatElapsed(seconds: number): string {
    if (seconds < 60) return 'just now'
    const mins = Math.floor(seconds / 60)
    return `${mins} minute${mins !== 1 ? 's' : ''} ago`
  }

  const isComplete = status === 'completed'
  const isFailed = status === 'failed'
  const successCount = processedLeads - failedLeads

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-gray-900">
            {isComplete
              ? `Completed ${successCount} / ${totalLeads} leads`
              : isFailed
                ? 'Processing failed'
                : `Processing ${processedLeads} / ${totalLeads} leads…`}
          </p>
          <p className="text-xs text-gray-400">Started {formatElapsed(elapsed)}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete
              ? 'bg-green-500'
              : isFailed
                ? 'bg-red-400'
                : 'bg-indigo-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress percentage */}
      <p className="text-right text-xs text-gray-400">{progress}%</p>

      {/* Failed leads warning */}
      {failedLeads > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
          <span className="mt-0.5">⚠</span>
          <span>
            <strong>{failedLeads} lead{failedLeads !== 1 ? 's' : ''} failed</strong> — icebreakers
            were generated for the remaining {successCount}.
          </span>
        </div>
      )}

      {/* Completion CTA */}
      {isComplete && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-800">
            All done! {successCount} icebreaker{successCount !== 1 ? 's' : ''} ready.
          </p>
          <button
            onClick={onComplete}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            View Results →
          </button>
        </div>
      )}

      {/* All-failed state */}
      {isFailed && failedLeads === totalLeads && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          All leads failed to process. Check your CSV data and try again.
        </div>
      )}
    </div>
  )
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

type BadgeStatus = 'pending' | 'processing' | 'completed' | 'failed' | null

const BADGE_STYLES: Record<NonNullable<BadgeStatus>, string> = {
  pending:    'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700',
  completed:  'bg-green-100 text-green-700',
  failed:     'bg-red-100 text-red-700',
}

const BADGE_LABELS: Record<NonNullable<BadgeStatus>, string> = {
  pending:    'Pending',
  processing: 'Processing',
  completed:  'Completed',
  failed:     'Failed',
}

function StatusBadge({ status }: { status: BadgeStatus }) {
  if (!status) return null
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${BADGE_STYLES[status]}`}>
      {status === 'processing' && (
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      {BADGE_LABELS[status]}
    </span>
  )
}
