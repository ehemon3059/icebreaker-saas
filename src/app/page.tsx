import type { Metadata } from 'next'
import LiveDemo from '@/components/landing/LiveDemo'
import PricingSection from '@/components/landing/PricingSection'
import FaqSection from '@/components/landing/FaqSection'
import PreviewTableCopy from '@/components/landing/PreviewTableCopy'

export const metadata: Metadata = {
  title: 'IcebreakerAI — Write Perfect Cold Email Openers in Seconds',
  description:
    'Upload your lead list and our AI writes personalized icebreakers that actually get replies. No more generic templates. Used by 500+ sales teams worldwide.',
  openGraph: {
    title: 'IcebreakerAI — Write Perfect Cold Email Openers in Seconds',
    description: 'Generate personalized cold email icebreakers using AI.',
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

const STATS = [
  { num: '500+', label: 'Sales teams worldwide' },
  { num: '2M+', label: 'Icebreakers generated' },
  { num: '8.4×', label: 'Higher reply rates' },
]

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

// ─── Colour tokens (avoids repetition) ────────────────────────────────────────

const c = {
  black:      '#0a0a0a',
  ink:        '#111318',
  surface:    '#16181f',
  card:       '#1c1f2a',
  border:     'rgba(255,255,255,0.08)',
  border2:    'rgba(255,255,255,0.14)',
  text:       '#e8eaf2',
  muted:      '#7a7f96',
  dim:        '#3e4259',
  green:      '#22d07a',
  greenDim:   'rgba(34,208,122,0.08)',
  greenBorder:'rgba(34,208,122,0.2)',
} as const

// ─── Reusable section-tag ─────────────────────────────────────────────────────

function SectionTag({ label, center = false }: { label: string; center?: boolean }) {
  return (
    <p
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: center ? 'center' : undefined,
        fontSize: '0.72rem',
        color: c.green,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        marginBottom: '16px',
      }}
    >
      <span style={{ width: '20px', height: '1px', background: c.green, display: 'inline-block' }} />
      {label}
    </p>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div
      style={{
        background: c.black,
        color: c.text,
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
        overflowX: 'hidden',
        minHeight: '100vh',
      }}
    >

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0 80px', textAlign: 'center', position: 'relative' }}>
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
            width: '700px', height: '450px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(34,208,122,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>

          {/* Badge */}
          <div style={{ marginBottom: '32px' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                border: '1px solid rgba(34,208,122,0.25)',
                background: 'rgba(34,208,122,0.06)',
                fontSize: '0.78rem', color: c.green,
              }}
            >
              <span
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: c.green, display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }}
              />
              AI-powered cold email personalization
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              color: c.text,
            }}
          >
            Write Perfect Cold Email
            <br />
            Openers{' '}
            <em style={{ fontStyle: 'italic', color: c.green }}>in Seconds</em>
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              fontSize: '1.1rem', color: c.muted,
              maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7,
            }}
          >
            Upload your lead list. Our AI scrapes their company website and writes a personalized
            icebreaker for every single prospect. No more generic &ldquo;Hope you&apos;re well.&rdquo;
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '14px', flexWrap: 'wrap', marginBottom: '20px',
            }}
          >
            <a
              href="/signup"
              style={{
                padding: '14px 32px', borderRadius: '10px',
                background: c.green, color: '#0a0a0a',
                fontSize: '1rem', fontWeight: 600,
                textDecoration: 'none', display: 'inline-block',
                transition: 'background 0.2s',
              }}
            >
              Generate free icebreakers →
            </a>
            <a
              href="#demo"
              style={{
                padding: '14px 32px', borderRadius: '10px',
                border: `1px solid ${c.border2}`, background: 'transparent',
                color: c.text, fontSize: '1rem',
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              See it live
            </a>
          </div>

          <p style={{ fontSize: '0.8rem', color: c.dim }}>
            <span style={{ color: c.muted }}>✦ No credit card required</span>
            &nbsp;·&nbsp;
            <span style={{ color: c.muted }}>10 free icebreakers on signup</span>
            &nbsp;·&nbsp;
            <span style={{ color: c.muted }}>Cancel anytime</span>
          </p>

          {/* ── Preview table ── */}
          <div
            style={{
              marginTop: '64px',
              background: c.card,
              border: `1px solid ${c.border}`,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
            }}
          >
            {/* macOS-style window bar */}
            <div
              style={{
                padding: '12px 16px', background: c.surface,
                borderBottom: `1px solid ${c.border}`,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5a5a' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f5a623' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22d07a' }} />
              <span style={{ fontSize: '0.75rem', color: c.muted, marginLeft: '8px' }}>
                icebreakers — results.csv
              </span>
            </div>

            {/* Scrollable table */}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', minWidth: '560px' }}
              >
                <thead>
                  <tr>
                    {['Lead', 'AI Icebreaker', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        style={{
                          color: c.muted, fontWeight: 500, textAlign: 'left',
                          padding: '12px 16px', borderBottom: `1px solid ${c.border}`,
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
                          borderBottom: 'rgba(255,255,255,0.04)',
                          verticalAlign: 'top', minWidth: '180px',
                          borderBottomWidth: '1px', borderBottomStyle: 'solid',
                          borderBottomColor: 'rgba(255,255,255,0.04)',
                        }}
                      >
                        <div style={{ fontWeight: 500, color: c.text }}>{row.name}</div>
                        <div style={{ fontSize: '0.75rem', color: c.muted, marginTop: '2px' }}>
                          {row.meta}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px', verticalAlign: 'top',
                          color: '#b8f5d4', lineHeight: 1.5, maxWidth: '400px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        {row.icebreaker}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px', verticalAlign: 'top', whiteSpace: 'nowrap',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.72rem', color: c.green,
                            background: 'rgba(34,208,122,0.1)',
                            padding: '2px 8px', borderRadius: '100px',
                          }}
                        >
                          ✓ Clean
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px', verticalAlign: 'top',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
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

      {/* ═══════════════════════════════════════════════════════════════════════
          LOGO BAR
      ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            padding: '48px 0', textAlign: 'center',
            borderTop: `1px solid ${c.border}`,
            borderBottom: `1px solid ${c.border}`,
          }}
        >
          <p
            style={{
              fontSize: '0.75rem', color: c.dim,
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '28px',
            }}
          >
            Works perfectly with your outreach stack
          </p>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '40px', flexWrap: 'wrap',
            }}
          >
            {LOGOS.map((logo) => (
              <span key={logo} style={{ fontSize: '0.88rem', color: c.dim, fontWeight: 500, letterSpacing: '0.05em' }}>
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            border: `1px solid ${c.border}`,
            borderRadius: '16px', overflow: 'hidden', margin: '64px 0',
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '36px', textAlign: 'center',
                borderRight: i < STATS.length - 1 ? `1px solid ${c.border}` : 'none',
                borderBottom: `1px solid ${c.border}`,
              }}
              className="last:border-b-0 sm:border-b-0"
            >
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: '2.8rem', color: c.green, lineHeight: 1, marginBottom: '6px',
                }}
              >
                {stat.num}
              </div>
              <div style={{ fontSize: '0.85rem', color: c.muted }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="how" style={{ padding: '80px 0 100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ marginBottom: '56px' }}>
            <SectionTag label="How it works" />
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400,
                letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '16px', color: c.text,
              }}
            >
              From lead list to{' '}
              <em style={{ fontStyle: 'italic', color: c.green }}>personalized openers</em>
              <br />in 3 steps
            </h2>
            <p style={{ fontSize: '1rem', color: c.muted, maxWidth: '480px', lineHeight: 1.7 }}>
              No prompt engineering. No copy-pasting. Just upload and go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px' }}>
            {STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  background: c.card,
                  border: `1px solid ${c.border}`,
                  borderRadius: '16px', padding: '32px',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Large ghost number */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: '4rem', color: 'rgba(34,208,122,0.07)',
                    position: 'absolute', top: '16px', right: '20px',
                    lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
                  }}
                >
                  {step.num}
                </div>

                <div
                  style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: c.greenDim,
                    border: `1px solid ${c.greenBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', marginBottom: '20px',
                  }}
                >
                  {step.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '10px', color: c.text }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: c.muted, lineHeight: 1.65 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          LIVE DEMO  (existing component — light bg section)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="demo">
        <LiveDemo />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRICING  (existing component — white bg section)
      ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: '#ffffff' }}>
        <PricingSection />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ  (existing component)
      ══════════════════════════════════════════════════════════════════════════ */}
      <FaqSection />

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0 100px', background: c.black }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1c1f2a 0%, rgba(34,208,122,0.04) 100%)',
              border: '1px solid rgba(34,208,122,0.2)',
              borderRadius: '24px', padding: 'clamp(40px, 6vw, 72px) clamp(24px, 4vw, 48px)',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Bottom glow */}
            <div
              style={{
                position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)',
                width: '400px', height: '200px',
                background: 'radial-gradient(ellipse, rgba(34,208,122,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative' }}>
              <SectionTag label="Get started today" center />
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400,
                  letterSpacing: '-0.02em', color: c.text, marginBottom: '16px',
                }}
              >
                Stop writing generic openers.
                <br />
                <em style={{ fontStyle: 'italic', color: c.green }}>Start getting replies.</em>
              </h2>
              <p style={{ color: c.muted, marginBottom: '36px', fontSize: '1.05rem' }}>
                Join 500+ sales teams who replaced copy-paste with AI personalization.
                Your first 10 icebreakers are free.
              </p>
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '14px', flexWrap: 'wrap',
                }}
              >
                <a
                  href="/signup"
                  style={{
                    padding: '14px 32px', borderRadius: '10px',
                    background: c.green, color: '#0a0a0a',
                    fontSize: '1rem', fontWeight: 600,
                    textDecoration: 'none', display: 'inline-block',
                  }}
                >
                  Generate free icebreakers →
                </a>
                <a
                  href="#demo"
                  style={{
                    padding: '14px 32px', borderRadius: '10px',
                    border: `1px solid ${c.border2}`, background: 'transparent',
                    color: c.text, fontSize: '1rem',
                    textDecoration: 'none', display: 'inline-block',
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
