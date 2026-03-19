'use client'

import { useState } from 'react'
import { exportResultsToCsv } from '@/lib/export'

export interface ExportButtonProps {
  jobId: string
  isCompleted: boolean
}

export default function ExportButton({ jobId, isCompleted }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    if (!isCompleted || loading) return

    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/results`)
      const json = await res.json()

      if (!json.success) {
        console.error('[ExportButton] Failed to fetch results:', json.error)
        return
      }

      exportResultsToCsv(json.data, jobId)
    } catch (err) {
      console.error('[ExportButton] Export failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={!isCompleted || loading}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Spinner />
          Exporting…
        </>
      ) : (
        <>
          <DownloadIcon />
          Export CSV
        </>
      )}
    </button>
  )
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
