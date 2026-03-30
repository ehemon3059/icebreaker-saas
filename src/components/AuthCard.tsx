'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthCardProps {
  view: 'sign_in' | 'sign_up'
}

export default function AuthCard({ view: initialView }: AuthCardProps) {
  const supabase = createClient()

  const [view, setView] = useState(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/auth/callback`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (view === 'sign_up') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      })
      if (error) {
        setError(error.message)
      } else {
        setEmailSent(true)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        window.location.href = '/dashboard'
      }
    }
    setLoading(false)
  }

  async function handleResend() {
    setResending(true)
    setResendSuccess(false)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: redirectTo },
    })
    setResending(false)
    if (!error) setResendSuccess(true)
  }

  // ── Email sent confirmation screen ──
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="text-5xl">📬</div>
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="text-gray-500 text-sm">
            We sent a confirmation link to <span className="font-medium text-gray-700">{email}</span>.
            Click the link to activate your account.
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-6 space-y-4">
            <p className="text-sm text-gray-500">Didn&apos;t receive it?</p>

            {resendSuccess && (
              <p className="text-sm text-green-600 font-medium">Email resent! Check your inbox.</p>
            )}

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {resending ? 'Sending…' : 'Resend confirmation email'}
            </button>

            <p className="text-xs text-gray-400">
              Also check your <span className="font-medium">spam / junk</span> folder.
            </p>
          </div>

          <button
            onClick={() => { setEmailSent(false); setView('sign_in') }}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  // ── Main auth form ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🧊</div>
          <h1 className="text-2xl font-bold text-gray-900">IcebreakerAI</h1>
          <p className="text-sm text-gray-500">
            {view === 'sign_in'
              ? 'Welcome back — sign in to your account'
              : 'Create your account and start generating icebreakers'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8 space-y-4">

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email + Password */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
          >
            {loading
              ? 'Please wait…'
              : view === 'sign_in' ? 'Sign in' : 'Create account'}
          </button>

          {/* Toggle sign in / sign up */}
          <p className="text-center text-sm text-gray-500">
            {view === 'sign_in' ? (
              <>Don&apos;t have an account?{' '}
                <button onClick={() => { setView('sign_up'); setError('') }} className="text-blue-600 hover:underline font-medium">Sign up</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setView('sign_in'); setError('') }} className="text-blue-600 hover:underline font-medium">Sign in</button>
              </>
            )}
          </p>

          {/* Forgot password */}
          {view === 'sign_in' && (
            <p className="text-center text-xs text-gray-400">
              <Link href="/forgot-password" className="hover:text-gray-600 underline">Forgot your password?</Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
