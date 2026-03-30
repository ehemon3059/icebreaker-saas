'use client'

import { useState } from 'react'
import { COUNTRY_OPTIONS, type CountryCode } from '@/lib/billing/geo-pricing'

interface Props {
  initialName: string | null
  initialEmail: string
  initialCountry: string | null
}

export default function ProfileForm({ initialName, initialEmail, initialCountry }: Props) {
  const [name, setName] = useState(initialName ?? '')
  const [email, setEmail] = useState(initialEmail)
  const [country, setCountry] = useState<CountryCode | ''>(
    (initialCountry as CountryCode) ?? ''
  )

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setSuccess('')
    setError('')

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, country: country || undefined }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
    } else {
      setSuccess(
        email !== initialEmail
          ? 'Profile updated. Check your new email for a confirmation link.'
          : 'Profile updated successfully.'
      )
    }
  }

  const currentCountryOption = COUNTRY_OPTIONS.find((c) => c.code === country)

  return (
    <div className="space-y-6">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-500 text-gray-900"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-500 text-gray-900"
        />
        <p className="mt-1 text-xs text-gray-400">
          Changing your email will send a confirmation link to the new address.
        </p>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COUNTRY_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setCountry(option.code)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left text-sm transition-colors ${
                country === option.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{option.flag}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
        {currentCountryOption && (
          <p className="mt-2 text-xs text-gray-400">
            Current: {currentCountryOption.flag} {currentCountryOption.label}
            {' '}· Pricing: ${currentCountryOption.proPrice}/mo PRO
          </p>
        )}
      </div>

      {/* Feedback */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}
