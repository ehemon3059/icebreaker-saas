'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParsedLead {
  name: string
  title: string
  company: string
  email?: string
  website?: string
  linkedinUrl?: string
}

export interface CsvColumnMapperProps {
  file: File
  onMappingComplete: (leads: ParsedLead[]) => void
  onBack: () => void
}

type RequiredField = 'name' | 'title' | 'company'
type OptionalField = 'email' | 'website' | 'linkedinUrl'
type MappedField = RequiredField | OptionalField

interface ColumnMapping {
  name: string
  title: string
  company: string
  email: string       // '' means skipped
  website: string
  linkedinUrl: string
}

const FIELD_LABELS: Record<MappedField, string> = {
  name: 'Name',
  title: 'Job Title',
  company: 'Company',
  email: 'Email',
  website: 'Website',
  linkedinUrl: 'LinkedIn URL',
}

const REQUIRED_FIELDS: RequiredField[] = ['name', 'title', 'company']
const OPTIONAL_FIELDS: OptionalField[] = ['email', 'website', 'linkedinUrl']

// ─── Auto-detect heuristics ───────────────────────────────────────────────────

const HEADER_PATTERNS: Record<MappedField, string[]> = {
  name:       ['name', 'full name', 'first name', 'fullname', 'contact name'],
  title:      ['title', 'job title', 'position', 'role', 'job role'],
  company:    ['company', 'company name', 'organization', 'organisation', 'employer'],
  email:      ['email', 'email address', 'e-mail'],
  website:    ['website', 'url', 'company url', 'domain', 'web', 'site'],
  linkedinUrl:['linkedin', 'linkedin url', 'linkedin profile', 'linkedin_url'],
}

function autoDetect(headers: string[]): ColumnMapping {
  const lower = headers.map((h) => h.toLowerCase().trim())
  const mapping: ColumnMapping = { name: '', title: '', company: '', email: '', website: '', linkedinUrl: '' }

  for (const [field, patterns] of Object.entries(HEADER_PATTERNS) as [MappedField, string[]][]) {
    const match = headers.find((_, i) => patterns.includes(lower[i]))
    if (match) mapping[field] = match
  }

  return mapping
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CsvColumnMapper({ file, onMappingComplete, onBack }: CsvColumnMapperProps) {
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [mapping, setMapping] = useState<ColumnMapping>({ name: '', title: '', company: '', email: '', website: '', linkedinUrl: '' })
  const [parseError, setParseError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Parse CSV on mount
  useEffect(() => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0) {
          setParseError(`CSV parse error: ${results.errors[0].message}`)
          return
        }
        const parsedHeaders = results.meta.fields ?? []
        setHeaders(parsedHeaders)
        setRows(results.data)
        setMapping(autoDetect(parsedHeaders))
      },
      error(err) {
        setParseError(`Failed to read file: ${err.message}`)
      },
    })
  }, [file])

  function handleMappingChange(field: MappedField, value: string) {
    setMapping((prev) => ({ ...prev, [field]: value }))
    setValidationError(null)
  }

  function handleConfirm() {
    // Validate required fields are mapped
    const missing = REQUIRED_FIELDS.filter((f) => !mapping[f])
    if (missing.length > 0) {
      setValidationError(
        `Please map the required fields: ${missing.map((f) => FIELD_LABELS[f]).join(', ')}`
      )
      return
    }

    // Transform rows → ParsedLead[]
    const leads: ParsedLead[] = rows
      .map((row) => {
        const name = row[mapping.name]?.trim()
        const title = row[mapping.title]?.trim()
        const company = row[mapping.company]?.trim()

        // Skip rows missing required values
        if (!name || !title || !company) return null

        const lead: ParsedLead = { name, title, company }
        if (mapping.email && row[mapping.email]?.trim()) lead.email = row[mapping.email].trim()
        if (mapping.website && row[mapping.website]?.trim()) lead.website = row[mapping.website].trim()
        if (mapping.linkedinUrl && row[mapping.linkedinUrl]?.trim()) lead.linkedinUrl = row[mapping.linkedinUrl].trim()

        return lead
      })
      .filter((l): l is ParsedLead => l !== null)

    if (leads.length === 0) {
      setValidationError('No valid leads found after mapping. Check that required columns have data.')
      return
    }

    onMappingComplete(leads)
  }

  // ── Parse error ────────────────────────────────────────────────────────────
  if (parseError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 space-y-3">
        <p className="font-medium">Failed to parse CSV</p>
        <p>{parseError}</p>
        <button onClick={onBack} className="text-red-600 underline hover:text-red-800">
          ← Go back
        </button>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (headers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-400">
        Parsing CSV…
      </div>
    )
  }

  // ── Mapping UI ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* File info */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-gray-700">{file.name}</span>
        <span>·</span>
        <span>{rows.length} rows detected</span>
      </div>

      {/* Required fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Required fields
        </p>
        {REQUIRED_FIELDS.map((field) => (
          <MappingRow
            key={field}
            label={FIELD_LABELS[field]}
            value={mapping[field]}
            headers={headers}
            firstRowValue={rows[0]?.[mapping[field]] ?? ''}
            required
            onChange={(v) => handleMappingChange(field, v)}
          />
        ))}
      </div>

      {/* Optional fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Optional fields
        </p>
        {OPTIONAL_FIELDS.map((field) => (
          <MappingRow
            key={field}
            label={FIELD_LABELS[field]}
            value={mapping[field]}
            headers={headers}
            firstRowValue={rows[0]?.[mapping[field]] ?? ''}
            required={false}
            onChange={(v) => handleMappingChange(field, v)}
          />
        ))}
      </div>

      {/* Validation error */}
      {validationError && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <span>⚠</span>
          {validationError}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Confirm mapping → Process {rows.length} leads
        </button>
      </div>
    </div>
  )
}

// ─── MappingRow ───────────────────────────────────────────────────────────────

interface MappingRowProps {
  label: string
  value: string
  headers: string[]
  firstRowValue: string
  required: boolean
  onChange: (value: string) => void
}

function MappingRow({ label, value, headers, firstRowValue, required, onChange }: MappingRowProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 shrink-0">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {required && <span className="ml-1 text-red-500 text-xs">*</span>}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition ${
          required && !value
            ? 'border-red-300 bg-red-50 text-red-700'
            : 'border-gray-300 bg-white text-gray-900'
        }`}
      >
        {!required && <option value="">— Skip —</option>}
        {required && <option value="">Select a column…</option>}
        {headers.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      {/* Preview: first value from that column */}
      {value && firstRowValue && (
        <span className="w-32 truncate text-xs text-gray-400 italic">
          e.g. &ldquo;{firstRowValue}&rdquo;
        </span>
      )}
    </div>
  )
}
