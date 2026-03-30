'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { COUNTRY_OPTIONS, type CountryCode } from '@/lib/billing/geo-pricing'

export default function CountryPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<CountryCode | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!selected) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/verify-country', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedCountry: selected }),
      })
      const data = await res.json()

      if (data.match) {
        router.push('/dashboard')
      } else {
        setError(data.message ?? 'Location verification failed.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const selectedOption = COUNTRY_OPTIONS.find((c) => c.code === selected)

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Where are you located?</h1>
          <p className="mt-2 text-sm text-gray-400">
            We use your location to show you the correct pricing.
          </p>
        </div>

        {/* Country selector */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            {COUNTRY_OPTIONS.map((option) => (
              <button
                key={option.code}
                onClick={() => setSelected(option.code)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${
                  selected === option.code
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{option.flag}</span>
                  <span className="font-medium">{option.label}</span>
                </span>
                <span className="text-sm text-gray-400">
                  ${option.proPrice}/mo
                </span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
              <p className="mt-1 text-red-500/70">
                If you are using a VPN, please disable it and try again.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!selected || loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Verifying…'
              : selectedOption
              ? `Continue as ${selectedOption.label}`
              : 'Select your country'}
          </button>

          <p className="text-center text-xs text-gray-600">
            Your location is verified once and stored securely. This cannot be changed later.
          </p>
        </div>
      </div>
    </div>
  )
}
