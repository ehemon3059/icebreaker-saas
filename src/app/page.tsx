import type { Metadata } from 'next'
import Link from 'next/link'
import LiveDemo from '@/components/landing/LiveDemo'
import PricingSection from '@/components/landing/PricingSection'
import FaqSection from '@/components/landing/FaqSection'
import PreviewTableCopy from '@/components/landing/PreviewTableCopy'

export const metadata: Metadata = {
  title: 'IcebreakerAI — Write Personalized Cold Email Openers in Seconds',
  description:
    'IcebreakerAI reads your prospect\'s company website and writes a unique, relevant opening line for every lead on your list. Upload a CSV. Get replies.',
  openGraph: {
    title: 'IcebreakerAI — Write Personalized Cold Email Openers in Seconds',
    description: 'Upload a CSV. Get personalized cold email openers powered by AI.',
    url: '/',
  },
}

// ─── Static data ───────────────────────────────────────────────────────────────

const PREVIEW_ROWS = [
  {
    name: 'Sarah Mitchell',
    meta: 'VP of Sales · Notion',
    icebreaker:
      'Your sales team probably spends hours on manual data entry that Notion Agents could handle in minutes.',
  },
  {
    name: 'James Okafor',
    meta: 'Head of Growth · Linear',
    icebreaker:
      'Your product planning workflow probably looks different now that AI agents are actually shipping code.',
  },
  {
    name: 'Emma Larsson',
    meta: 'Director of Marketing · Webflow',
    icebreaker:
      "Your no-code approach to custom websites probably means your marketing team deals with a lot of technical product education.",
  },
]

const LOGOS = ['Lemlist', 'Instantly.ai', 'Apollo.io', 'Smartlead', 'HubSpot', 'Salesforce']

const STEPS = [
  {
    num: '01',
    icon: '📤',
    title: 'Upload your CSV',
    description:
      'Drop in your lead list with name, company, and website. We handle any column structure with our smart column mapper.',
  },
  {
    num: '02',
    icon: '🤖',
    title: 'AI scrapes & writes',
    description:
      "We scrape each company's website, extract their value proposition, and write a unique icebreaker for every single lead.",
  },
  {
    num: '03',
    icon: '📥',
    title: 'Export & send',
    description:
      'Download your enriched CSV with an icebreaker column. Import into Lemlist, Instantly, or Apollo and start sending.',
  },
]

const FEATURES = [
  {
    icon: '🧠',
    title: 'Website-Aware AI',
    description: 'The AI reads your prospect\'s company website — not just their job title — to write something they\'ll actually notice.',
  },
  {
    icon: '📁',
    title: 'CSV Bulk Upload',
    description: 'Upload hundreds of leads at once. Our smart column mapper handles messy CSV headers automatically.',
  },
  {
    icon: '⬇️',
    title: 'One-Click Export',
    description: 'Download your enriched CSV with an icebreaker column added, ready to import into your outreach tool.',
  },
  {
    icon: '🎯',
    title: 'Industry-Aware Tone',
    description: 'The AI adapts its writing style to match the industry — different tone for SaaS, recruiting, real estate, and agencies.',
  },
  {
    icon: '⚡',
    title: 'Results in Under 60 Seconds',
    description: 'Most batches complete in under a minute. Priority processing for Pro and Scale plans.',
  },
  {
    icon: '🔑',
    title: 'Credit-Based System',
    description: 'You only use a credit when an icebreaker is successfully generated. Failed scrapes don\'t cost you anything.',
  },
  {
    icon: '✅',
    title: 'AI Output You Control',
    description: 'Every icebreaker is shown to you before it reaches anyone\'s inbox. You review, edit, or discard any output before exporting. The AI assists your judgment — it does not replace it.',
  },
]

const SECURITY_POINTS = [
  {
    icon: '🔒',
    title: 'HTTPS Encrypted',
    description: 'All data transferred between your browser and IcebreakerAI is protected by HTTPS encryption. Your credentials and lead data are never sent in plain text.',
  },
  {
    icon: '🛡️',
    title: 'Secure Authentication',
    description: 'Login is handled through Google OAuth or password-based auth with industry-standard token management. We never store your raw password.',
  },
  {
    icon: '🔐',
    title: 'Data Isolation',
    description: 'Your account data, lead lists, and generated icebreakers are isolated per user. No user can access another user\'s data.',
  },
  {
    icon: '🇪🇺',
    title: 'GDPR Aligned',
    description: 'We follow GDPR principles for data collection, storage, and deletion — including your right to access or delete your data at any time.',
  },
  {
    icon: '🚫',
    title: 'No Spam Policy',
    description: 'IcebreakerAI is a writing assistant. We do not send emails on your behalf. We do not access your email inbox. We do not share your prospect data.',
  },
]

const USE_CASES = [
  {
    role: 'SaaS Sales',
    icon: '💼',
    description: 'Reference the prospect\'s product, recent growth, or tech stack to open with genuine relevance.',
  },
  {
    role: 'Recruiting',
    icon: '🎯',
    description: 'Personalize outreach with company hiring context, culture signals, and team growth patterns.',
  },
  {
    role: 'Real Estate',
    icon: '🏠',
    description: 'Connect with buyers, sellers, and developers using property and market-specific opening lines.',
  },
  {
    role: 'Marketing Agencies',
    icon: '📣',
    description: 'Scale outbound for clients with AI-written openers tailored to each prospect\'s business.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0 64px', textAlign: 'center', position: 'relative' }}>
        {/* Radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '0%', left: '50%', transform: 'translateX(-50%)',
            width: '700px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(107,78,255,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>

          {/* Beta badge */}
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '5px 14px', borderRadius: '999px',
                border: '1px solid var(--purple-s2)',
                background: 'var(--purple-s1)',
                fontSize: '0.75rem', color: 'var(--purple-main)', fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--accent-green)', display: 'inline-block',
                }}
              />
              Currently in Beta — Early users welcome
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              color: 'var(--text-primary)',
            }}
          >
            Write Personalized Cold Email
            <br />
            <span style={{ color: 'var(--purple-main)' }}>Openers in Seconds</span>
            {' '}— Not Hours
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
            }}
          >
            IcebreakerAI reads your prospect&apos;s company website and writes a unique, relevant
            opening line for every lead on your list. Upload a CSV. Get replies.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '14px', flexWrap: 'wrap', marginBottom: '24px',
            }}
          >
            <Link
              href="/signup"
              style={{
                padding: '14px 32px', borderRadius: '999px',
                background: 'var(--purple-main)', color: '#ffffff',
                fontSize: '1rem', fontWeight: 600,
                textDecoration: 'none', display: 'inline-block',
                boxShadow: '0 4px 20px rgba(107,78,255,0.35)',
                transition: 'background 0.25s cubic-bezier(.4,0,.2,1)',
              }}
            >
              Start Free — No Credit Card Required
            </Link>
            <a
              href="#demo"
              style={{
                padding: '14px 32px', borderRadius: '999px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                textDecoration: 'none', display: 'inline-block',
                transition: 'border-color 0.25s cubic-bezier(.4,0,.2,1)',
              }}
            >
              See a Live Demo ↓
            </a>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '20px', flexWrap: 'wrap',
            }}
          >
            {['🔒 Secure Login', '🛡️ Data Encrypted', '✅ Cancel Anytime', '⚡ Results in Under 60 Seconds'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Preview table */}
          <div
            style={{
              marginTop: '64px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.08)',
            }}
          >
            {/* macOS-style window bar */}
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--bg-card-2)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5a5a' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f5a623' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-green)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                icebreakers — results.csv
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', minWidth: '560px' }}>
                <thead>
                  <tr>
                    {['Lead', 'AI Icebreaker', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        style={{
                          color: 'var(--text-muted)', fontWeight: 500, textAlign: 'left',
                          padding: '12px 16px', borderBottom: '1px solid var(--border)',
                          fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW_ROWS.map((row) => (
                    <tr key={row.name}>
                      <td
                        style={{
                          padding: '14px 16px',
                          borderBottom: '1px solid var(--border)',
                          verticalAlign: 'top', minWidth: '180px',
                        }}
                      >
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {row.meta}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px', verticalAlign: 'top',
                          color: 'var(--purple-deep)', lineHeight: 1.5, maxWidth: '400px',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        {row.icebreaker}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px', verticalAlign: 'top', whiteSpace: 'nowrap',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.72rem', color: 'var(--accent-green)',
                            background: 'rgba(34,197,94,0.1)',
                            padding: '2px 8px', borderRadius: '999px',
                          }}
                        >
                          ✓ Clean
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px', verticalAlign: 'top',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <PreviewTableCopy text={row.icebreaker} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SOCIAL PROOF BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: 'var(--bg-card-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.75rem', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '24px',
              fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
            }}
          >
            Built for modern sales teams using tools like:
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '36px', flexWrap: 'wrap' }}>
            {LOGOS.map((logo) => (
              <span
                key={logo}
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                }}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PROBLEM SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: '640px' }}>
            <p
              style={{
                fontSize: '0.72rem', color: 'var(--purple-main)',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                marginBottom: '16px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span style={{ width: '20px', height: '1px', background: 'var(--purple-main)', display: 'inline-block' }} />
              The Problem
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 700, lineHeight: 1.2,
                color: 'var(--text-primary)', marginBottom: '20px',
              }}
            >
              Cold email is broken.
              <br />
              Generic openers get ignored.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '40px' }}>
              &ldquo;Hope you&apos;re well&rdquo; doesn&apos;t work. Copy-paste templates are obvious. Manual personalization at scale takes hours.
              Sales teams are stuck choosing between volume and relevance — until now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '20px' }}>
            {[
              { icon: '😴', title: 'Generic openers get deleted', body: 'Prospects can spot a template in the first five words. They delete it before reading the pitch.' },
              { icon: '⏱️', title: 'Manual research doesn\'t scale', body: 'Researching every prospect takes 5–10 minutes each. That\'s hours lost per campaign.' },
              { icon: '📋', title: 'Copy-paste hurts your brand', body: 'Lazy personalization ("[First Name], loved your work at [Company]") makes you look like spam.' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{item.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '1rem', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how" style={{ padding: '80px 0', background: 'var(--bg-card-2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '56px' }}>
            <p
              style={{
                fontSize: '0.72rem', color: 'var(--purple-main)',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                marginBottom: '16px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span style={{ width: '20px', height: '1px', background: 'var(--purple-main)', display: 'inline-block' }} />
              How It Works
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 700, lineHeight: 1.2,
                color: 'var(--text-primary)', marginBottom: '16px',
              }}
            >
              From lead list to{' '}
              <span style={{ color: 'var(--purple-main)' }}>personalized openers</span>
              <br />in 3 steps
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.7 }}>
              No prompt engineering. No copy-pasting. Just upload and go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px' }}>
            {STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '32px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '4rem', color: 'rgba(107,78,255,0.07)',
                    position: 'absolute', top: '12px', right: '18px',
                    lineHeight: 1, pointerEvents: 'none', userSelect: 'none', fontWeight: 800,
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'var(--purple-s1)',
                    border: '1px solid var(--purple-s2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', marginBottom: '20px',
                  }}
                >
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '1.05rem', fontWeight: 700,
                    marginBottom: '10px', color: 'var(--text-primary)',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LIVE DEMO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="demo">
        <LiveDemo />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '52px' }}>
            <p
              style={{
                fontSize: '0.72rem', color: 'var(--purple-main)',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                marginBottom: '16px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span style={{ width: '20px', height: '1px', background: 'var(--purple-main)', display: 'inline-block' }} />
              Features
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 700, lineHeight: 1.2,
                color: 'var(--text-primary)', marginBottom: '16px',
              }}
            >
              Everything you need.{' '}
              <span style={{ color: 'var(--purple-main)' }}>Nothing you don&apos;t.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.7 }}>
              Built for sales professionals who want real personalization at scale — without the manual work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '20px' }}>
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{feat.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '1rem', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}
                >
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECURITY SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--bg-card-2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p
              style={{
                fontSize: '0.72rem', color: 'var(--purple-main)',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                marginBottom: '16px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                justifyContent: 'center',
              }}
            >
              <span style={{ width: '20px', height: '1px', background: 'var(--purple-main)', display: 'inline-block' }} />
              Security
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 700, lineHeight: 1.2,
                color: 'var(--text-primary)', marginBottom: '16px',
              }}
            >
              Built With Security You Can Trust
            </h2>
            <p
              style={{
                fontSize: '1rem', color: 'var(--text-secondary)',
                maxWidth: '520px', margin: '0 auto', lineHeight: 1.7,
              }}
            >
              We take your data and your prospects&apos; data seriously. Here&apos;s exactly how we protect it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '20px' }}>
            {SECURITY_POINTS.map((point) => (
              <div
                key={point.title}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{point.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '1rem', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}
                >
                  {point.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          USE CASES
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '52px' }}>
            <p
              style={{
                fontSize: '0.72rem', color: 'var(--purple-main)',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                marginBottom: '16px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
            >
              <span style={{ width: '20px', height: '1px', background: 'var(--purple-main)', display: 'inline-block' }} />
              Use Cases
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 700, lineHeight: 1.2,
                color: 'var(--text-primary)', marginBottom: '16px',
              }}
            >
              Built for every team
              <br />
              that sends cold email
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '20px' }}>
            {USE_CASES.map((uc) => (
              <div
                key={uc.role}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{uc.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '1rem', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}
                >
                  {uc.role}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING PREVIEW  (landing section)
      ══════════════════════════════════════════════════════════════════════ */}
      <div id="pricing" style={{ background: 'var(--bg-card-2)' }}>
        <PricingSection />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <div id="faq">
        <FaqSection />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0 100px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--purple-s1) 0%, var(--bg-card) 100%)',
              border: '1px solid var(--purple-s2)',
              borderRadius: '24px',
              padding: 'clamp(40px, 6vw, 72px) clamp(24px, 4vw, 48px)',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)',
                width: '400px', height: '200px',
                background: 'radial-gradient(ellipse, rgba(107,78,255,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-sora), Sora, sans-serif',
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 700, letterSpacing: '-0.01em',
                  color: 'var(--text-primary)', marginBottom: '16px',
                }}
              >
                Stop writing generic openers.
                <br />
                <span style={{ color: 'var(--purple-main)' }}>Start getting replies.</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '1.05rem' }}>
                Try IcebreakerAI free — no credit card required. Your first 10 icebreakers are on us.
              </p>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '14px', flexWrap: 'wrap',
                }}
              >
                <Link
                  href="/signup"
                  style={{
                    padding: '14px 32px', borderRadius: '999px',
                    background: 'var(--purple-main)', color: '#ffffff',
                    fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(107,78,255,0.35)',
                    display: 'inline-block',
                  }}
                >
                  Start Free →
                </Link>
                <a
                  href="#demo"
                  style={{
                    padding: '14px 32px', borderRadius: '999px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem', textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Try the demo first
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
