import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — IcebreakerAI',
  description: 'Get in touch with the IcebreakerAI team. We read every message and typically respond within 24 hours.',
}

const QUICK_ANSWERS = [
  {
    q: 'Where do I find my credits?',
    a: 'Log in and go to your Dashboard. Your remaining credits are shown in the top bar and on the dashboard home.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Dashboard → Settings → Billing and click Cancel Subscription. Your access continues until the end of the billing period.',
  },
  {
    q: 'I found a bug. What should I do?',
    a: 'Email us at support@icebreakerAI.com with a description of what happened and any screenshots. We fix bugs fast.',
  },
  {
    q: 'Can I get a refund?',
    a: 'We offer a 7-day refund on your first subscription payment. Email support@icebreakerAI.com with your request.',
  },
]

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* Header */}
      <section
        style={{
          padding: '72px 24px 56px', textAlign: 'center',
          background: 'var(--bg-card-2)', borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p
            style={{
              display: 'inline-block',
              padding: '5px 14px', borderRadius: '999px',
              border: '1px solid var(--purple-s2)',
              background: 'var(--purple-s1)',
              fontSize: '0.75rem', color: 'var(--purple-main)', fontWeight: 500,
              marginBottom: '20px',
            }}
          >
            IcebreakerAI is currently in Beta — feedback especially welcome
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800, color: 'var(--text-primary)',
              marginBottom: '16px', letterSpacing: '-0.02em',
            }}
          >
            Get in Touch
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We&apos;re a small team and we read every message. Typical response time is under 24 hours on business days.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px 80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '48px', alignItems: 'start' }}>

          {/* Contact form */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: '1.4rem', fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: '24px',
              }}
            >
              Send us a message
            </h2>
            <form
              action="mailto:support@icebreakerAI.com"
              method="get"
              encType="text/plain"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label
                  htmlFor="name"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Jane Smith"
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@company.com"
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select a topic…</option>
                  <option value="billing">Billing / Subscription</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">General Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="body"
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  style={{
                    width: '100%', padding: '11px 14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '13px 28px', borderRadius: '999px',
                  background: 'var(--purple-main)', color: '#ffffff',
                  fontSize: '0.95rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(107,78,255,0.3)',
                  transition: 'background 0.25s cubic-bezier(.4,0,.2,1)',
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info + FAQ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Direct contact */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-sora), Sora, sans-serif',
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: '16px',
                }}
              >
                Direct Email
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Support
                  </p>
                  <a
                    href="mailto:support@icebreakerAI.com"
                    style={{ fontSize: '0.9rem', color: 'var(--purple-main)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    support@icebreakerAI.com
                  </a>
                </div>
                <div style={{ height: '1px', background: 'var(--border)' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    General
                  </p>
                  <a
                    href="mailto:hello@icebreakerAI.com"
                    style={{ fontSize: '0.9rem', color: 'var(--purple-main)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    hello@icebreakerAI.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quick answers */}
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-sora), Sora, sans-serif',
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: '16px',
                }}
              >
                Quick Answers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {QUICK_ANSWERS.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '16px 18px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.88rem', fontWeight: 600,
                        color: 'var(--text-primary)', marginBottom: '6px',
                        fontFamily: 'var(--font-sora), Sora, sans-serif',
                      }}
                    >
                      {item.q}
                    </p>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
