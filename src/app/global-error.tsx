'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white font-sans text-gray-900">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <button
          onClick={() => reset()}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
