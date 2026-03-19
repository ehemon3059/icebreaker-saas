'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

interface JobProgressState {
  status: JobStatus | null
  totalLeads: number
  processedLeads: number
  failedLeads: number
  progress: number  // 0–100
  isPolling: boolean
}

interface UseJobProgressOptions {
  jobId: string | null
  pollingInterval?: number
  onComplete?: (jobId: string) => void
}

const INITIAL_STATE: JobProgressState = {
  status: null,
  totalLeads: 0,
  processedLeads: 0,
  failedLeads: 0,
  progress: 0,
  isPolling: false,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useJobProgress({
  jobId,
  pollingInterval = 3000,
  onComplete,
}: UseJobProgressOptions): JobProgressState {
  const [state, setState] = useState<JobProgressState>(INITIAL_STATE)

  // Stable reference so the interval callback doesn't capture stale onComplete
  const onCompleteRef = useCallback(
    (id: string) => onComplete?.(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onComplete]
  )

  useEffect(() => {
    if (!jobId) {
      setState(INITIAL_STATE)
      return
    }

    setState((prev) => ({ ...prev, isPolling: true }))

    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/status`)
        if (!res.ok) return

        const json = await res.json()
        if (!json.success) return

        const { status, totalLeads, processedLeads, failedLeads, progress } = json.data

        setState({
          status,
          totalLeads,
          processedLeads,
          failedLeads,
          progress,
          isPolling: status !== 'completed' && status !== 'failed',
        })

        if (status === 'completed' || status === 'failed') {
          clearInterval(intervalId)
          onCompleteRef(jobId!)
        }
      } catch {
        // Network error — keep polling, don't crash
      }
    }

    // Poll immediately, then on interval
    poll()
    const intervalId = setInterval(poll, pollingInterval)

    return () => clearInterval(intervalId)
  }, [jobId, pollingInterval, onCompleteRef])

  return state
}
