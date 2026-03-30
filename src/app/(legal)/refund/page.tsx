import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy — IcebreakerAI',
}

export default function RefundPage() {
  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh', padding: '64px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        <h1
          style={{
            fontFamily: 'var(--font-sora), Sora, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, color: 'var(--text-primary)',
            marginBottom: '8px', letterSpacing: '-0.01em',
          }}
        >
          Refund Policy
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '48px' }}>
          Last Updated: March 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <Section title="7-Day Refund Window">
            <p>
              We offer a full refund on your first subscription payment if you request it within 7 days
              of being charged. After 7 days, or after your second billing cycle, payments are non-refundable.
            </p>
          </Section>

          <Section title="How to Request a Refund">
            <p style={{ marginBottom: '12px' }}>
              To request a refund, email us at{' '}
              <a href="mailto:support@icebreakerAI.com" style={{ color: 'var(--purple-main)', textDecoration: 'none' }}>
                support@icebreakerAI.com
              </a>{' '}
              with:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Your account email address</li>
              <li>The date of the charge</li>
              <li>A brief reason for the refund (optional, but helpful)</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We will process your request within 1–2 business days and confirm via email.
            </p>
          </Section>

          <Section title="When Refunds Are Not Available">
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Requests made after the 7-day window from your first charge</li>
              <li>Any charge after your first payment (second month onward)</li>
              <li>Credit purchases (if applicable in future)</li>
              <li>Accounts that have violated our Terms of Service</li>
            </ul>
          </Section>

          <Section title="Free Plan">
            <p>
              The Free plan has no charges and is not subject to this refund policy. You can downgrade
              to the Free plan at any time from your dashboard.
            </p>
          </Section>

          <Section title="Cancellation">
            <p>
              You can cancel your subscription at any time from Dashboard → Settings → Billing.
              Cancellation takes effect at the end of your current billing period — you retain access
              until then. We do not provide partial-month refunds for cancellations.
            </p>
          </Section>

          <Section title="Processing Note">
            <p>
              Refunds are processed through our payment processor and typically appear in your account
              within 5–10 business days, depending on your bank. If you have not received your refund
              after 10 business days, contact us at{' '}
              <a href="mailto:support@icebreakerAI.com" style={{ color: 'var(--purple-main)', textDecoration: 'none' }}>
                support@icebreakerAI.com
              </a>
              .
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy:{' '}
              <a href="mailto:support@icebreakerAI.com" style={{ color: 'var(--purple-main)', textDecoration: 'none' }}>
                support@icebreakerAI.com
              </a>
              <br />
              Company: IcebreakerAI · Founder: Eh Emon · Bangladesh
            </p>
          </Section>

        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        style={{
          fontFamily: 'var(--font-sora), Sora, sans-serif',
          fontSize: '1.15rem', fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: '12px',
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  )
}
