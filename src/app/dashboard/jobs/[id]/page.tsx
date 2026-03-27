'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

interface JobData {
  id: string
  status: JobStatus
  totalLeads: number
  processedLeads: number
  failedLeads: number
  progress: number
  createdAt: string
}

const POLL_INTERVAL = 3000

export default function JobProgressPage() {
  const { id: jobId } = useParams<{ id: string }>()
  const router = useRouter()

  const [job, setJob] = useState<JobData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/status`)
        const json = await res.json()
        if (cancelled) return

        if (!json.success) {
          setError(json.error ?? 'Failed to fetch status')
          return
        }

        setJob(json.data)

        if (json.data.status === 'completed') {
          router.replace(`/dashboard/jobs/${jobId}/results`)
          return
        }

        if (json.data.status !== 'failed') {
          setTimeout(poll, POLL_INTERVAL)
        }
      } catch {
        if (!cancelled) setError('Network error')
      }
    }

    poll()
    return () => { cancelled = true }
  }, [jobId, router])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">{error}</p>
        <Link href="/dashboard/jobs" className="text-sm text-indigo-600 hover:underline">
          Back to Jobs
        </Link>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  const isFailed = job.status === 'failed'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 space-y-6 text-center">

        <div>
          <Link href="/dashboard/jobs" className="text-xs text-gray-400 hover:text-gray-600">
            ← Back to Jobs
          </Link>
        </div>

        {isFailed ? (
          <>
            <p className="text-4xl">❌</p>
            <h1 className="text-lg font-semibold text-gray-900">Job Failed</h1>
            <p className="text-sm text-gray-500">
              {job.processedLeads} of {job.totalLeads} leads were processed before the failure.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <span className="h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Processing your leads</h1>
            <p className="text-sm text-gray-500">
              You can close this tab — results will be ready shortly.
            </p>
          </>
        )}

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isFailed ? 'bg-red-400' : 'bg-indigo-500'}`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {job.processedLeads} / {job.totalLeads} leads
            {job.failedLeads > 0 && (
              <span className="ml-2 text-yellow-600">· {job.failedLeads} failed</span>
            )}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600">
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </div>
      </div>
    </div>
  )
}
