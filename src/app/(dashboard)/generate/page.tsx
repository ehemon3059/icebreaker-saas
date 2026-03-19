'use client'

import { useState } from 'react'

interface GenerateResult {
  message: string
  spamCheck: {
    isClean: boolean
    flaggedWords: string[]
    severity: 'none' | 'low' | 'high'
  }
  credits: {
    used: number
    limit: number
    remaining: number
  }
}

interface FormState {
  name: string
  title: string
  company: string
  website: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const INITIAL_FORM: FormState = { name: '', title: '', company: '', website: '' }

export default function GeneratePage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setResult(null)
    setErrorMsg('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          title: form.title.trim(),
          company: form.company.trim(),
          website: form.website.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setResult(data.data as GenerateResult)
      setStatus('success')
    } catch {
      setErrorMsg('Network error. Please check your connection.')
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Icebreaker</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter a prospect&apos;s details and we&apos;ll craft a personalized opening line.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
        >
          <Field
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            required
          />
          <Field
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Head of Sales"
            required
          />
          <Field
            label="Company"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Acme Corp"
            required
          />
          <Field
            label="Website URL"
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Spinner />
                Generating...
              </>
            ) : (
              'Generate Icebreaker'
            )}
          </button>
        </form>

        {/* Error */}
        {status === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Result */}
        {status === 'success' && result && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <p className="text-gray-900 text-base leading-relaxed font-medium">
                &ldquo;{result.message}&rdquo;
              </p>

              {/* Copy button */}
              <button
                onClick={() => copyToClipboard(result.message)}
                className={`shrink-0 flex items-center gap-1.5 text-xs font-medium border rounded-lg px-3 py-1.5 transition-colors ${
                  copied
                    ? 'text-green-700 border-green-200 bg-green-50'
                    : 'text-indigo-600 border-indigo-200 hover:text-indigo-800'
                }`}
              >
                {copied ? (
                  <>
                    <CheckIcon />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardIcon />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Spam warning */}
            {!result.spamCheck.isClean && (
              <div className="flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                <span>⚠</span>
                <span>
                  May trigger spam filters — flagged words:{' '}
                  <span className="font-semibold">{result.spamCheck.flaggedWords.join(', ')}</span>
                </span>
              </div>
            )}

            {/* Credits remaining */}
            <p className="text-xs text-gray-400 text-right">
              {result.credits.remaining} credit{result.credits.remaining !== 1 ? 's' : ''} remaining
              {' '}({result.credits.used} / {result.credits.limit} used)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  required?: boolean
}

function Field({ label, name, value, onChange, placeholder, type = 'text', required }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
      />
    </div>
  )
}

function ClipboardIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
