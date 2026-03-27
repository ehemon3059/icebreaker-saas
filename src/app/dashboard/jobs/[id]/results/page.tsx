'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface ResultRow {
  leadId: string
  name: string
  company: string
  title: string
  website: string | null
  messageId: string | null
  message: string | null
  isClean: boolean
  flaggedWords: string[]
}

export default function ResultsPage() {
  const { id: jobId } = useParams<{ id: string }>()
  const router = useRouter()

  const [results, setResults] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/jobs/${jobId}/results`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) {
          setError(json.error ?? 'Failed to load results')
        } else {
          setResults(json.data)
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [jobId])

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 1500)
    })
  }, [])

  const exportCsv = useCallback(() => {
    const header = 'Name,Title,Company,Website,Icebreaker'
    const rows = results.map((r) =>
      [r.name, r.title, r.company, r.website ?? '', r.message ?? '']
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `icebreakers-${jobId.slice(-8)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [results, jobId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">{error}</p>
        <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline">
          Go back
        </button>
      </div>
    )
  }

  const cleanCount = results.filter((r) => r.isClean).length
  const flaggedCount = results.length - cleanCount

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/jobs" className="text-xs text-gray-400 hover:text-gray-600 mb-1 block">
              ← Back to Jobs
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Results</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {results.length} icebreakers
              {flaggedCount > 0 && (
                <span className="ml-2 text-yellow-600">· {flaggedCount} flagged</span>
              )}
            </p>
          </div>
          {results.length > 0 && (
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Export CSV
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{results.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Clean</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{cleanCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Flagged</p>
            <p className="text-2xl font-bold text-yellow-500 mt-1">{flaggedCount}</p>
          </div>
        </div>

        {/* Table */}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-sm text-gray-500">No results found for this job.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-3 text-left">Lead</th>
                  <th className="px-5 py-3 text-left">Icebreaker</th>
                  <th className="px-5 py-3 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((row) => (
                  <tr key={row.leadId} className="hover:bg-gray-50 transition-colors">
                    {/* Lead info */}
                    <td className="px-5 py-4 w-48">
                      <p className="font-medium text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{row.title}</p>
                      <p className="text-xs text-gray-400">{row.company}</p>
                    </td>

                    {/* Message */}
                    <td className="px-5 py-4">
                      {row.message ? (
                        <div className="space-y-1">
                          <p className="text-gray-800 leading-relaxed">{row.message}</p>
                          {!row.isClean && row.flaggedWords.length > 0 && (
                            <p className="text-xs text-yellow-600">
                              Flagged: {row.flaggedWords.join(', ')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No message generated</span>
                      )}
                    </td>

                    {/* Copy button */}
                    <td className="px-5 py-4 text-right">
                      {row.message && (
                        <button
                          onClick={() => copy(row.message!, row.leadId)}
                          className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          {copied === row.leadId ? 'Copied!' : 'Copy'}
                        </button>
                      )}
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
