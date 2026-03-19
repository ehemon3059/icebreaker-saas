'use client'

import { useMemo } from 'react'
import type { ParsedLead } from './CsvColumnMapper'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CsvPreviewProps {
  leads: ParsedLead[]
  credits: { used: number; limit: number }
  onStartProcessing: (validLeads: ParsedLead[]) => void
  onBack: () => void
}

interface ValidationResult {
  valid: ParsedLead[]
  duplicatesRemoved: number
  invalidSkipped: number
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://') || url.includes('.')
}

function validateLeads(raw: ParsedLead[]): ValidationResult {
  let duplicatesRemoved = 0
  let invalidSkipped = 0
  const seen = new Set<string>()
  const valid: ParsedLead[] = []

  for (const lead of raw) {
    // Trim all fields
    const trimmed: ParsedLead = {
      name: lead.name.trim(),
      title: lead.title.trim(),
      company: lead.company?.trim() ?? '',
      email: lead.email?.trim(),
      website: lead.website?.trim(),
      linkedinUrl: lead.linkedinUrl?.trim(),
    }

    // Rule 1: name must not be empty
    if (!trimmed.name) { invalidSkipped++; continue }

    // Rule 2: company and website can't both be empty
    if (!trimmed.company && !trimmed.website) { invalidSkipped++; continue }

    // Rule 5: if website provided, must look like a URL
    if (trimmed.website && !isValidUrl(trimmed.website)) {
      trimmed.website = undefined // strip invalid URL, don't skip the lead
    }

    // Rule 3: deduplicate by name + company
    const key = `${trimmed.name.toLowerCase()}|${trimmed.company.toLowerCase()}`
    if (seen.has(key)) { duplicatesRemoved++; continue }
    seen.add(key)

    valid.push(trimmed)
  }

  return { valid, duplicatesRemoved, invalidSkipped }
}

// ─── Component ────────────────────────────────────────────────────────────────

const PREVIEW_LIMIT = 5

export default function CsvPreview({ leads, credits, onStartProcessing, onBack }: CsvPreviewProps) {
  const { valid, duplicatesRemoved, invalidSkipped } = useMemo(
    () => validateLeads(leads),
    [leads]
  )

  const remaining = credits.limit - credits.used
  const leadsWithoutWebsite = valid.filter((l) => !l.website && !l.linkedinUrl).length
  const hasEnoughCredits = valid.length <= remaining
  const canProcess = valid.length > 0 && hasEnoughCredits

  const previewRows = valid.slice(0, PREVIEW_LIMIT)
  const hiddenCount = valid.length - PREVIEW_LIMIT

  return (
    <div className="space-y-5">

      {/* Summary card */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          value={valid.length}
          label="valid leads"
          color="green"
        />
        <SummaryCard
          value={duplicatesRemoved}
          label="duplicates removed"
          color="yellow"
        />
        <SummaryCard
          value={invalidSkipped}
          label="invalid rows skipped"
          color="red"
        />
      </div>

      {/* No-website warning */}
      {leadsWithoutWebsite > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
          <span className="mt-0.5">⚠</span>
          <span>
            <strong>{leadsWithoutWebsite} lead{leadsWithoutWebsite !== 1 ? 's' : ''}</strong>{' '}
            {leadsWithoutWebsite !== 1 ? 'have' : 'has'} no website or LinkedIn URL — icebreakers
            will be generated using name and title only.
          </span>
        </div>
      )}

      {/* Credit check */}
      <div className={`rounded-lg border px-4 py-3 text-sm ${
        hasEnoughCredits
          ? 'border-indigo-100 bg-indigo-50 text-indigo-800'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}>
        {hasEnoughCredits ? (
          <span>
            This will use <strong>{valid.length}</strong> of your{' '}
            <strong>{remaining}</strong> remaining credits.
          </span>
        ) : (
          <span>
            You need <strong>{valid.length}</strong> credits but only have{' '}
            <strong>{remaining}</strong>. Remove some leads or upgrade your plan.
          </span>
        )}
      </div>

      {/* Preview table */}
      {valid.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {previewRows.map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.title}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.company}</td>
                  <td className="px-4 py-3 text-gray-400 truncate max-w-[180px]">
                    {lead.website || lead.linkedinUrl || (
                      <span className="italic text-gray-300">none</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hiddenCount > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-400 text-center">
              …and {hiddenCount} more lead{hiddenCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* No valid leads */}
      {valid.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-10 text-center text-sm text-gray-400">
          No valid leads found. Check your column mapping and try again.
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onStartProcessing(valid)}
          disabled={!canProcess}
          className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Processing {valid.length > 0 ? `${valid.length} leads` : ''}
        </button>
      </div>
    </div>
  )
}

// ─── SummaryCard ──────────────────────────────────────────────────────────────

type CardColor = 'green' | 'yellow' | 'red'

const COLOR_CLASSES: Record<CardColor, { bg: string; value: string; label: string }> = {
  green:  { bg: 'bg-green-50 border-green-100',  value: 'text-green-700',  label: 'text-green-600' },
  yellow: { bg: 'bg-yellow-50 border-yellow-100', value: 'text-yellow-700', label: 'text-yellow-600' },
  red:    { bg: 'bg-red-50 border-red-100',       value: 'text-red-700',    label: 'text-red-600' },
}

function SummaryCard({ value, label, color }: { value: number; label: string; color: CardColor }) {
  const c = COLOR_CLASSES[color]
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${c.bg}`}>
      <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
      <p className={`text-xs mt-0.5 ${c.label}`}>{label}</p>
    </div>
  )
}
