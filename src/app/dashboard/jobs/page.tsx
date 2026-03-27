import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const jobs = await prisma.processingJob.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      totalLeads: true,
      processedLeads: true,
      failedLeads: true,
      errorMessage: true,
      createdAt: true,
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Processing Jobs</h1>
            <p className="mt-1 text-sm text-gray-500">
              All your CSV uploads and their icebreaker results.
            </p>
          </div>
          <Link
            href="/dashboard/csv"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            + Upload CSV
          </Link>
        </div>

        {/* Empty state */}
        {jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm font-medium text-gray-700">No jobs yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Upload a CSV to start bulk generating icebreakers.
            </p>
            <Link
              href="/dashboard/csv"
              className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Upload CSV
            </Link>
          </div>
        )}

        {/* Jobs list */}
        {jobs.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Progress</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    {/* Date */}
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {job.createdAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      <span className="ml-2 text-xs text-gray-400">
                        {job.createdAt.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <span className="text-gray-700 font-medium">
                          {job.processedLeads} / {job.totalLeads} leads
                        </span>
                        {job.totalLeads > 0 && (
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${progressBarColor(job.status as JobStatus)}`}
                              style={{
                                width: `${Math.round((job.processedLeads / job.totalLeads) * 100)}%`,
                              }}
                            />
                          </div>
                        )}
                        {job.failedLeads > 0 && (
                          <span className="text-xs text-yellow-600">
                            ⚠ {job.failedLeads} failed
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status as JobStatus} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <JobAction jobId={job.id} status={job.status as JobStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function progressBarColor(status: JobStatus): string {
  if (status === 'completed') return 'bg-green-500'
  if (status === 'failed') return 'bg-red-400'
  return 'bg-indigo-500'
}

const STATUS_STYLES: Record<JobStatus, string> = {
  pending:    'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700',
  completed:  'bg-green-100 text-green-700',
  failed:     'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<JobStatus, string> = {
  pending:    'Pending',
  processing: 'Processing',
  completed:  'Completed',
  failed:     'Failed',
}

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status === 'processing' && (
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      {STATUS_LABELS[status]}
    </span>
  )
}

function JobAction({ jobId, status }: { jobId: string; status: JobStatus }) {
  if (status === 'completed') {
    return (
      <Link
        href={`/dashboard/jobs/${jobId}/results`}
        className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        View Results →
      </Link>
    )
  }

  if (status === 'processing' || status === 'pending') {
    return (
      <Link
        href={`/dashboard/jobs/${jobId}`}
        className="inline-flex items-center rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
      >
        View Progress
      </Link>
    )
  }

  if (status === 'failed') {
    return (
      <Link
        href={`/dashboard/jobs/${jobId}`}
        className="inline-flex items-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors"
      >
        View Details
      </Link>
    )
  }

  return null
}
