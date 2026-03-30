'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Credits {
  used: number
  limit: number
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'var(--purple-s1)',
        }}
      />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark/light mode"
      style={{
        width: '36px', height: '36px', borderRadius: '8px',
        background: 'var(--purple-s1)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.25s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {theme === 'dark'
        ? <Sun size={16} color="var(--purple-main)" />
        : <Moon size={16} color="var(--purple-main)" />
      }
    </button>
  )
}

const NAV_LINKS = [
  { label: 'How It Works', href: '/#how' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setCredits(null); return }
    fetch('/api/user/credits')
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.data) setCredits({ used: json.data.used, limit: json.data.limit })
      })
      .catch(() => null)
  }, [user])

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
          position: 'sticky',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: '64px',
          background: scrolled
            ? 'var(--bg-card)'
            : 'var(--bg-card)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          transition: 'box-shadow 0.25s cubic-bezier(.4,0,.2,1)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
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
            gap: '16px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              textDecoration: 'none', flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'var(--purple-main)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', flexShrink: 0,
              }}
            >
              ❄
            </div>
            <span
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: '1.05rem',
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            >
              IcebreakerAI
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                  transition: 'color 0.25s cubic-bezier(.4,0,.2,1)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--purple-main)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '10px' }}>
            <ThemeToggle />

            {user ? (
              <>
                {remaining !== null && (
                  <span
                    style={{
                      padding: '5px 12px', borderRadius: '999px',
                      background: 'var(--purple-s1)',
                      border: '1px solid var(--purple-s2)',
                      color: 'var(--purple-main)',
                      fontSize: '0.78rem', fontWeight: 500,
                    }}
                  >
                    {remaining.toLocaleString()} credits
                  </span>
                )}
                <Link
                  href="/dashboard"
                  style={{
                    padding: '9px 18px', borderRadius: '8px',
                    background: 'var(--purple-main)', color: '#ffffff',
                    fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                    transition: 'background 0.25s cubic-bezier(.4,0,.2,1)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--purple-deep)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--purple-main)')}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem', cursor: 'pointer',
                    padding: '8px 4px',
                    fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                    transition: 'color 0.25s cubic-bezier(.4,0,.2,1)',
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
                    padding: '9px 16px',
                    background: 'none', color: 'var(--text-secondary)',
                    fontSize: '0.85rem', textDecoration: 'none',
                    fontWeight: 500,
                    fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                    transition: 'color 0.25s cubic-bezier(.4,0,.2,1)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: '9px 20px', borderRadius: '999px',
                    background: 'var(--purple-main)', color: '#ffffff',
                    fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(107,78,255,0.35)',
                    transition: 'background 0.25s cubic-bezier(.4,0,.2,1)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--purple-deep)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--purple-main)')}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile right: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '8px', padding: '7px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Toggle menu"
            >
              {menuOpen
                ? <X size={18} color="var(--text-primary)" />
                : <Menu size={18} color="var(--text-primary)" />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{ position: 'fixed', inset: 0, zIndex: 99, top: '64px' }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border)',
              padding: '20px 24px 28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ height: '1px', background: 'var(--border)' }} />
              {user ? (
                <>
                  {remaining !== null && (
                    <span style={{ color: 'var(--purple-main)', fontSize: '0.82rem' }}>
                      {remaining.toLocaleString()} credits left
                    </span>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', padding: '12px', borderRadius: '12px',
                      background: 'var(--purple-main)', color: '#ffffff',
                      fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center',
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{
                      background: 'none', border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left', padding: 0,
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.92rem' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', padding: '12px', borderRadius: '999px',
                      background: 'var(--purple-main)', color: '#ffffff',
                      fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(107,78,255,0.35)',
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
