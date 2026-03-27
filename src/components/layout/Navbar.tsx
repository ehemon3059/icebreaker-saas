'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
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
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: '0',
          background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transition: 'background 0.2s, box-shadow 0.2s',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <nav
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <div
              style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: '#22d07a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', flexShrink: 0,
              }}
            >
              ❄
            </div>
            <span
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '1.15rem',
                color: '#e8eaf2',
                fontWeight: 400,
              }}
            >
              IcebreakerAI
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
            <Link href="/#how" style={{ color: '#7a7f96', textDecoration: 'none', fontSize: '0.88rem' }}>
              How it works
            </Link>
            <Link href="/#demo" style={{ color: '#7a7f96', textDecoration: 'none', fontSize: '0.88rem' }}>
              Live demo
            </Link>
            <Link href="/#pricing" style={{ color: '#7a7f96', textDecoration: 'none', fontSize: '0.88rem' }}>
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '10px' }}>
            {user ? (
              <>
                {remaining !== null && (
                  <span
                    style={{
                      padding: '5px 12px', borderRadius: '100px',
                      background: 'rgba(34,208,122,0.1)',
                      border: '1px solid rgba(34,208,122,0.2)',
                      color: '#22d07a', fontSize: '0.78rem', fontWeight: 500,
                    }}
                  >
                    {remaining.toLocaleString()} credits
                  </span>
                )}
                <Link
                  href="/dashboard"
                  style={{
                    padding: '8px 18px', borderRadius: '8px',
                    background: '#22d07a', color: '#0a0a0a',
                    fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'none', border: 'none',
                    color: '#7a7f96', fontSize: '0.85rem', cursor: 'pointer',
                    padding: '8px 4px',
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: '8px 16px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'transparent', color: '#e8eaf2',
                    fontSize: '0.85rem', textDecoration: 'none',
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: '8px 18px', borderRadius: '8px',
                    background: '#22d07a', color: '#0a0a0a',
                    fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  Start free →
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden"
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', padding: '7px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <X size={18} color="#e8eaf2" />
              : <Menu size={18} color="#e8eaf2" />
            }
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute', top: '64px', left: 0, right: 0,
              background: '#111318',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '20px 24px 28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link href="/#how" onClick={() => setMenuOpen(false)} style={{ color: '#7a7f96', textDecoration: 'none', fontSize: '0.92rem' }}>How it works</Link>
              <Link href="/#demo" onClick={() => setMenuOpen(false)} style={{ color: '#7a7f96', textDecoration: 'none', fontSize: '0.92rem' }}>Live demo</Link>
              <Link href="/#pricing" onClick={() => setMenuOpen(false)} style={{ color: '#7a7f96', textDecoration: 'none', fontSize: '0.92rem' }}>Pricing</Link>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              {user ? (
                <>
                  {remaining !== null && (
                    <span style={{ color: '#22d07a', fontSize: '0.82rem' }}>
                      {remaining.toLocaleString()} credits left
                    </span>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', padding: '12px', borderRadius: '8px',
                      background: '#22d07a', color: '#0a0a0a',
                      fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{ background: 'none', border: 'none', color: '#7a7f96', fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#e8eaf2', textDecoration: 'none', fontSize: '0.92rem' }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', padding: '12px', borderRadius: '8px',
                      background: '#22d07a', color: '#0a0a0a',
                      fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Start free →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer so page content starts below the fixed navbar */}
      <div style={{ height: '64px' }} />
    </>
  )
}
