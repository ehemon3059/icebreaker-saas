'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Credits {
  used: number
  limit: number
}

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Auth state
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  // Credits for logged-in users
  useEffect(() => {
    if (!user) { setCredits(null); return }

    fetch('/api/user/credits')
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.data) setCredits({ used: json.data.used, limit: json.data.limit })
      })
      .catch(() => null)
  }, [user])

  // Shadow on scroll
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 4) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    setMenuOpen(false)
  }

  const remaining = credits ? Math.max(0, credits.limit - credits.used) : null

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-200',
          scrolled ? 'shadow-sm' : 'border-b border-gray-100',
        ].join(' ')}
      >
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
            <Zap size={18} className="text-blue-600" fill="currentColor" />
            IcebreakerAI
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 md:flex">
            {user ? (
              <>
                <Link href="/#pricing" className="text-sm text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
                {remaining !== null && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {remaining.toLocaleString()} credits left
                  </span>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/#pricing" className="text-sm text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute inset-x-0 top-16 border-b border-gray-100 bg-white px-4 pb-6 pt-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  {remaining !== null && (
                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {remaining.toLocaleString()} credits left
                    </span>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-gray-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/#pricing"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-gray-600"
                  >
                    Pricing
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-sm text-gray-500"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/#pricing"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-gray-600"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-gray-600"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer so page content starts below the fixed navbar */}
      <div className="h-16" />
    </>
  )
}
