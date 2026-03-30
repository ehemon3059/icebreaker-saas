import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us — IcebreakerAI',
  description: 'We built the tool we always wished existed. Learn about IcebreakerAI, our mission, and the team behind it.',
}

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '72px 24px 56px', textAlign: 'center', background: 'var(--bg-card-2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Beta badge */}
          <div style={{ marginBottom: '20px' }}>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '5px 14px', borderRadius: '999px',
                border: '1px solid var(--purple-s2)',
                background: 'var(--purple-s1)',
                fontSize: '0.75rem', color: 'var(--purple-main)', fontWeight: 500,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
              Currently in Beta — Actively building
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 800, color: 'var(--text-primary)',
              marginBottom: '16px', letterSpacing: '-0.02em',
            }}
          >
            About IcebreakerAI
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            We built the tool we always wished existed.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>

        {/* Our Story */}
        <section style={{ padding: '64px 0 48px', borderBottom: '1px solid var(--border)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
            }}
          >
            Our Story
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            Cold email personalization is one of those tasks that everyone knows matters but nobody
            wants to do manually. Writing a genuine, relevant opener for every single prospect
            takes research, time, and creativity — at scale, it&apos;s simply not possible for most teams.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            IcebreakerAI was born from that frustration. We wanted a tool that could read a
            company&apos;s website, understand their context, and write an opening line that actually
            sounds like a human wrote it — because someone did design the system that writes it.
          </p>
        </section>

        {/* Our Mission */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
            }}
          >
            Our Mission
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            To make personalized outreach accessible to every salesperson, recruiter, and founder —
            not just the ones with time or a large research team. We believe the best outreach
            is relevant, respectful, and personal. IcebreakerAI helps you achieve all three,
            at any volume.
          </p>
        </section>

        {/* What We Believe */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
            }}
          >
            What We Believe
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'Relevance beats volume', body: 'A hundred well-researched emails outperform a thousand generic ones every time.' },
              { title: 'AI should assist, not replace', body: 'Our job is to save you time on the research and drafting — your judgment and voice are still essential.' },
              { title: 'Transparency matters', body: 'We show you everything the AI generates before it goes anywhere. No black boxes.' },
              { title: 'Privacy is non-negotiable', body: "Your data and your prospects' data are handled with care. We take GDPR seriously." },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                }}
              >
                <span style={{ color: 'var(--purple-main)', fontSize: '1.1rem', flexShrink: 0, marginTop: '2px' }}>✦</span>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-sora), Sora, sans-serif',
                      fontSize: '0.95rem', fontWeight: 700,
                      color: 'var(--text-primary)', marginBottom: '6px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px',
            }}
          >
            Our Team
          </h2>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '24px',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: '1.05rem', fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: '6px',
              }}
            >
              Eh Emon — Founder &amp; CEO
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Builder, engineer, and the person who got tired of writing icebreakers manually.
              Based in Bangladesh. Building globally.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Contact:{' '}
              <a href="mailto:hello@icebreakerAI.com" style={{ color: 'var(--purple-main)', textDecoration: 'none' }}>
                hello@icebreakerAI.com
              </a>
            </p>
          </div>

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
                fontSize: '0.9rem', fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: '14px',
              }}
            >
              Business Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['Company Name', 'IcebreakerAI'],
                ['Founder', 'Eh Emon'],
                ['Location', 'Bangladesh (Remote Team, Operating Globally)'],
                ['General Email', 'hello@icebreakerAI.com'],
                ['Support Email', 'support@icebreakerAI.com'],
                ['Status', '🟢 Currently in Beta'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: '12px', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: '140px', flexShrink: 0 }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why We're Different */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
            }}
          >
            Why We&apos;re Different
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'We use real website content, not just a job title — so icebreakers are actually specific.',
              'We show you every generated output before you export — no blind automation.',
              'We charge per credit, not per seat — no penalties for team size.',
              'We\'re a small, focused team that ships fast and listens to users.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                <span style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '3px' }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* AI & Content Transparency */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
            }}
          >
            AI &amp; Content Transparency
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            IcebreakerAI uses AI to generate personalized opening lines based on publicly available
            company website information. All AI-generated content is presented to users for review
            before exporting or sending. Our AI is a writing assistant — users are always in control
            of the final message.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            We use <strong style={{ color: 'var(--text-primary)' }}>Google Gemini</strong> as our
            underlying AI model. Prospect context (company name, website text) is sent to the AI
            API for generation purposes only. We do not use your data to train AI models.
          </p>
        </section>

        {/* Our Commitment to Privacy */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
            }}
          >
            Our Commitment to Privacy
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            We don&apos;t sell your data. We don&apos;t share your prospects&apos; data. We collect only what
            is necessary to run the service, and we follow GDPR principles for everything we store.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            You have the right to request access to, correction of, or deletion of your personal data
            at any time. Contact us at{' '}
            <a href="mailto:support@icebreakerAI.com" style={{ color: 'var(--purple-main)', textDecoration: 'none' }}>
              support@icebreakerAI.com
            </a>
            .
          </p>
        </section>

        {/* Contact */}
        <section style={{ padding: '48px 0 72px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
            }}
          >
            Contact
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
            We&apos;re a small team and we read every message. If you have questions, feedback, or just
            want to say hello — reach out anytime.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '12px 28px', borderRadius: '999px',
              background: 'var(--purple-main)', color: '#ffffff',
              fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(107,78,255,0.3)',
            }}
          >
            Get in Touch →
          </Link>
        </section>

      </div>
    </div>
  )
}
