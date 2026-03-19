'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ResultRow {
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

export interface ResultsTableProps {
  jobId: string
}

type SortField = 'name' | 'company'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 50

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResultsTable({ jobId }: ResultsTableProps) {
  const [rows, setRows] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)

  // ── Fetch results ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/results`)
        const json = await res.json()
        if (!json.success) throw new Error(json.error)
        setRows(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [jobId])

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const base = q
      ? rows.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.company.toLowerCase().includes(q) ||
            r.title.toLowerCase().includes(q)
        )
      : rows

    return [...base].sort((a, b) => {
      const valA = a[sortField].toLowerCase()
      const valB = b[sortField].toLowerCase()
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })
  }, [rows, search, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
    setPage(0)
  }

  // ── Copy ───────────────────────────────────────────────────────────────────
  async function handleCopy(leadId: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedId(leadId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // ── Regenerate ─────────────────────────────────────────────────────────────
  const handleRegenerate = useCallback(
    async (leadId: string) => {
      setRegeneratingId(leadId)
      try {
        const res = await fetch(`/api/jobs/${jobId}/regenerate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId }),
        })
        const json = await res.json()
        if (!json.success) throw new Error(json.error)

        const { message, isClean, flaggedWords } = json.data
        setRows((prev) =>
          prev.map((r) =>
            r.leadId === leadId ? { ...r, message, isClean, flaggedWords } : r
          )
        )
      } catch (err) {
        console.error('[ResultsTable] regenerate failed:', err)
      } finally {
        setRegeneratingId(null)
      }
    },
    [jobId]
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        Loading results…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search by name, company, or title…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <span className="shrink-0 text-xs text-gray-400">
          Showing {pageRows.length} of {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left w-8">#</th>
              <SortableHeader label="Name" field="name" current={sortField} dir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Company" field="company" current={sortField} dir={sortDir} onSort={toggleSort} />
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Icebreaker</th>
              <th className="px-4 py-3 text-left">Spam</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pageRows.map((row, i) => {
              const globalIndex = page * PAGE_SIZE + i + 1
              const isRegenerating = regeneratingId === row.leadId
              const isCopied = copiedId === row.leadId
              const truncated = row.message ? row.message.slice(0, 100) + (row.message.length > 100 ? '…' : '') : null

              return (
                <tr key={row.leadId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{globalIndex}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.company}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{row.title}</td>

                  {/* Icebreaker with full text on hover */}
                  <td className="px-4 py-3 max-w-xs">
                    {row.message ? (
                      <span title={row.message} className="cursor-help text-gray-700">
                        {truncated}
                      </span>
                    ) : (
                      <span className="italic text-gray-300">—</span>
                    )}
                  </td>

                  {/* Spam badge */}
                  <td className="px-4 py-3">
                    {row.isClean ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-100">
                        Clean
                      </span>
                    ) : (
                      <span
                        title={`Flagged: ${row.flaggedWords.join(', ')}`}
                        className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 border border-yellow-100 cursor-help"
                      >
                        ⚠ Flagged
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {row.message && (
                        <button
                          onClick={() => handleCopy(row.leadId, row.message!)}
                          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                            isCopied
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {isCopied ? '✓ Copied' : 'Copy'}
                        </button>
                      )}
                      <button
                        onClick={() => handleRegenerate(row.leadId)}
                        disabled={isRegenerating}
                        className="rounded-md border border-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRegenerating ? '…' : 'Regenerate'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No results match your search.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── SortableHeader ───────────────────────────────────────────────────────────

function SortableHeader({
  label,
  field,
  current,
  dir,
  onSort,
}: {
  label: string
  field: SortField
  current: SortField
  dir: SortDir
  onSort: (f: SortField) => void
}) {
  const active = current === field
  return (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${active ? 'text-indigo-600' : ''}`}
      >
        {label}
        <span className="text-xs">{active ? (dir === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  )
}
