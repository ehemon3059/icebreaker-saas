import Papa from 'papaparse'
import type { ResultRow } from '@/components/csv/ResultsTable'

export function exportResultsToCsv(results: ResultRow[], jobId: string): void {
  const rows = results.map((r) => ({
    Name: r.name,
    Title: r.title,
    Company: r.company,
    Website: r.website ?? '',
    Icebreaker: r.message ?? '',
    Spam_Status: r.isClean ? 'Clean' : `Flagged (${r.flaggedWords.join(', ')})`,
  }))

  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const filename = `icebreakers-${jobId}-${date}.csv`

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Release the object URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
