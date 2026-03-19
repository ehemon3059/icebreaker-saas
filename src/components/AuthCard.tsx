'use client'

import Link from 'next/link'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

interface AuthCardProps {
  view: 'sign_in' | 'sign_up'
}

export default function AuthCard({ view }: AuthCardProps) {
  const supabase = createClient()

  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/auth/callback`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🧊</div>
          <h1 className="text-2xl font-bold text-gray-900">IcebreakerAI</h1>
          <p className="text-sm text-gray-500">
            {view === 'sign_in'
              ? 'Welcome back — sign in to your account'
              : 'Create your account and start generating icebreakers'}
          </p>
        </div>

        {/* Auth UI card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8">
          <Auth
            supabaseClient={supabase}
            view={view}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'white',
                    defaultButtonBackgroundHover: '#f8fafc',
                    defaultButtonBorder: '#e2e8f0',
                    defaultButtonText: '#374151',
                    inputBackground: 'white',
                    inputBorder: '#d1d5db',
                    inputBorderHover: '#2563eb',
                    inputBorderFocus: '#2563eb',
                    inputText: '#111827',
                    inputLabelText: '#374151',
                    inputPlaceholder: '#9ca3af',
                    messageText: '#374151',
                    messageBackground: '#f0fdf4',
                    messageBorder: '#bbf7d0',
                    anchorTextColor: '#2563eb',
                    anchorTextHoverColor: '#1d4ed8',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '13px',
                    baseButtonSize: '14px',
                  },
                },
              },
              className: {
                button: 'font-medium',
                input: 'text-sm',
                label: 'font-medium',
              },
            }}
            providers={['google']}
            redirectTo={redirectTo}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  social_provider_text: 'Continue with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                },
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Create a password',
                  button_label: 'Create account',
                  social_provider_text: 'Continue with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                },
                forgotten_password: {
                  link_text: 'Forgot your password?',
                  button_label: 'Send reset email',
                  email_label: 'Email address',
                },
              },
            }}
            showLinks
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
        </p>

      </div>
    </div>
  )
}
