'use client'

import { useEffect, useState } from 'react'
import CsvUploader from '@/components/csv/CsvUploader'
import CsvColumnMapper, { type ParsedLead } from '@/components/csv/CsvColumnMapper'
import CsvPreview from '@/components/csv/CsvPreview'
import JobProgress from '@/components/csv/JobProgress'
import ResultsTable from '@/components/csv/ResultsTable'
import ExportButton from '@/components/csv/ExportButton'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5

interface Credits {
  used: number
  limit: number
}

const STEP_LABELS: Record<Step, string> = {
  1: 'Upload',
  2: 'Map',
  3: 'Preview',
  4: 'Process',
  5: 'Results',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CsvPage() {
  const [step, setStep] = useState<Step>(1)
  const [file, setFile] = useState<File | null>(null)
  const [mappedLeads, setMappedLeads] = useState<ParsedLead[]>([])
  const [jobId, setJobId] = useState<string | null>(null)
  const [credits, setCredits] = useState<Credits>({ used: 0, limit: 10 })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch user credits on mount
  useEffect(() => {
    fetch('/api/user/credits')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCredits(json.data)
      })
      .catch(() => {/* keep defaults */})
  }, [])

  // ── Step 1 → 2 ─────────────────────────────────────────────────────────────
  function handleFileSelect(selected: File | null) {
    setFile(selected)
    if (selected) setStep(2)
  }

  // ── Step 2 → 3 ─────────────────────────────────────────────────────────────
  function handleMappingComplete(leads: ParsedLead[]) {
    setMappedLeads(leads)
    setStep(3)
  }

  // ── Step 3 → 4: submit job ─────────────────────────────────────────────────
  async function handleStartProcessing(validLeads: ParsedLead[]) {
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/jobs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: validLeads }),
      })
      const json = await res.json()

      if (!json.success) {
        setSubmitError(json.error ?? 'Submission failed. Please try again.')
        return
      }

      setJobId(json.data.jobId)
      setStep(4)
    } catch {
      setSubmitError('Network error. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Step 4 → 5 ─────────────────────────────────────────────────────────────
  function handleProcessingComplete() {
    setStep(5)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk CSV Upload</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload a list of leads and generate personalized icebreakers for all of them.
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">

          {/* Step 1: Upload */}
          {step === 1 && (
            <StepShell title="Upload your CSV file">
              <CsvUploader onFileSelect={handleFileSelect} />
            </StepShell>
          )}

          {/* Step 2: Map columns */}
          {step === 2 && file && (
            <StepShell title="Map your columns">
              <CsvColumnMapper
                file={file}
                onMappingComplete={handleMappingComplete}
                onBack={() => setStep(1)}
              />
            </StepShell>
          )}

          {/* Step 3: Preview & validate */}
          {step === 3 && (
            <StepShell title="Preview & validate">
              {submitError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}
              <CsvPreview
                leads={mappedLeads}
                credits={credits}
                onStartProcessing={handleStartProcessing}
                onBack={() => setStep(2)}
              />
              {submitting && (
                <div className="mt-4 text-center text-sm text-gray-400">Submitting job…</div>
              )}
            </StepShell>
          )}

          {/* Step 4: Processing */}
          {step === 4 && jobId && (
            <StepShell title="Processing your leads">
              <p className="mb-5 text-xs text-gray-400">
                You can close this tab — your job will continue running in the background.
                Come back to{' '}
                <a href="/dashboard/jobs" className="text-indigo-600 hover:underline">
                  Jobs History
                </a>{' '}
                to find your results.
              </p>
              <JobProgress jobId={jobId} onComplete={handleProcessingComplete} />
            </StepShell>
          )}

          {/* Step 5: Results */}
          {step === 5 && jobId && (
            <StepShell
              title="Your icebreakers are ready"
              action={<ExportButton jobId={jobId} isCompleted />}
            >
              <ResultsTable jobId={jobId} />
            </StepShell>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── StepIndicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps: Step[] = [1, 2, 3, 4, 5]
  return (
    <nav aria-label="Progress" className="flex items-center justify-between">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                s < current
                  ? 'bg-indigo-600 text-white'
                  : s === current
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s < current ? '✓' : s}
            </div>
            <span
              className={`text-xs whitespace-nowrap ${
                s === current ? 'font-semibold text-indigo-700' : 'text-gray-400'
              }`}
            >
              {STEP_LABELS[s]}
            </span>
          </div>

          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className={`mb-5 h-px w-full flex-1 min-w-[24px] transition-colors ${
                s < current ? 'bg-indigo-300' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </nav>
  )
}

// ─── StepShell ────────────────────────────────────────────────────────────────

function StepShell({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}
