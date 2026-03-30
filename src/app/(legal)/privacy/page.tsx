import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — IcebreakerAI',
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

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '48px' }}>
          Last Updated: March 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <Section title="1. Who We Are">
            <p>
              IcebreakerAI is a software-as-a-service (SaaS) product that generates personalized cold
              email opening lines using artificial intelligence. Our website is icebreakerAI.com.
              IcebreakerAI is founded and operated by Eh Emon, Bangladesh.
            </p>
          </Section>

          <Section title="2. What Information We Collect">
            <p style={{ marginBottom: '12px' }}>We collect only what is necessary to provide the Service:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Account Information</strong> — When
                you sign up, we collect your name, email address, and login method (Google or
                email/password). We also collect your country of location for pricing and compliance purposes.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Lead Data You Upload</strong> — When
                you upload a CSV, we store the name, job title, company, and website URL of your
                prospects temporarily to generate icebreakers. This data is not used for any other purpose.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Payment Information</strong> — Payment
                processing is handled entirely by our third-party payment processor. We do not store your
                credit card number, bank details, or any payment instrument on our servers.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Usage Data</strong> — We collect
                information about how you use IcebreakerAI — pages visited, features used, credits
                consumed — to improve the product and diagnose issues.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Technical Data</strong> — We collect
                IP addresses, browser type, and device information for security, fraud prevention, and
                regional pricing purposes.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>To create and manage your account</li>
              <li>To generate AI icebreakers from the prospect data you provide</li>
              <li>To track credit usage and enforce plan limits</li>
              <li>To apply regional pricing based on your location</li>
              <li>To send transactional emails (e.g. billing receipts) — no marketing emails without consent</li>
              <li>To diagnose errors and improve reliability via aggregated analytics</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing">
            <p style={{ marginBottom: '12px' }}>We share data only with:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Our payment processor</strong> — handles billing and tax compliance</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> — database and authentication infrastructure</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Vercel</strong> — hosting and serverless infrastructure</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Google Gemini API</strong> — AI generation. Only company website text is sent, not your personal account data</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>PostHog</strong> — anonymous product analytics</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Sentry</strong> — error tracking, configured to exclude sensitive user data</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Upstash</strong> — rate limiting and job queuing; no personal data stored</li>
            </ul>
            <p style={{ marginTop: '12px' }}>All third-party providers are bound by data protection agreements.</p>
          </Section>

          <Section title="5. Data Retention">
            <p>
              Your account data and generated icebreakers are retained while your account is active.
              Scraped website content used for AI context is cached for up to 24 hours to improve speed,
              then automatically deleted. If you delete your account, your personal information and
              prospect data are deleted within 30 days. Aggregated, anonymized usage statistics may be
              retained indefinitely as they cannot be linked to you.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p style={{ marginBottom: '12px' }}>Depending on your location, you have the right to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Deletion</strong> — ask us to delete your account and all associated data</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Correction</strong> — update inaccurate information in your account settings</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Export</strong> — download your generated icebreakers as a CSV from your dashboard</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Objection</strong> — opt out of analytics tracking at any time</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              To exercise any of these rights, email us at{' '}
              <a href="mailto:support@icebreakerAI.com" style={{ color: 'var(--purple-main)', textDecoration: 'none' }}>
                support@icebreakerAI.com
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              We use cookies minimally. An authentication session cookie is set when you log in to keep
              you signed in. We do not use advertising or cross-site tracking cookies. PostHog sets an
              anonymous analytics cookie to distinguish unique sessions; you can opt out via your browser
              settings or a global privacy signal.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              All data is transmitted over HTTPS. Data at rest is encrypted. We use industry-standard
              security practices including secure authentication tokens, isolated user data storage, and
              rate limiting to prevent abuse. We conduct regular reviews of our infrastructure security.
            </p>
          </Section>

          <Section title="9. AI Processing">
            <p>
              IcebreakerAI uses Google Gemini to generate icebreakers. When you process a lead, the
              prospect&apos;s company name and public website content are sent to the AI API for generation.
              Your personal account information is not included in AI API requests. AI-generated content
              is reviewed by you before use — we do not send anything on your behalf.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>
              IcebreakerAI is not directed at children under the age of 13. We do not knowingly collect
              personal information from anyone under 13. If you believe a child has provided us with
              personal data, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last Updated&rdquo; date at the top
              of this page reflects the most recent revision. We will notify active users of material
              changes via email. Continued use of the Service after changes are posted constitutes
              acceptance of the revised Policy.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For privacy-related questions:{' '}
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
