import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — IcebreakerAI',
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

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '48px' }}>
          Last Updated: March 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <Section title="1. The Service">
            <p>
              IcebreakerAI is an AI-powered tool that generates personalized opening lines for cold
              emails and outreach messages. The Service allows users to input prospect information
              and receive AI-generated icebreakers via single generation or bulk CSV upload.
              By accessing or using IcebreakerAI, you agree to be bound by these Terms of Service.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least 18 years old and capable of forming a legally binding contract to
              use the Service. By using IcebreakerAI, you represent that you meet these requirements.
              If you are using the Service on behalf of a business, you represent that you have
              authority to bind that business to these Terms.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <p>
              You must create an account to access the full Service. You are responsible for
              maintaining the confidentiality of your login credentials and for all activity that
              occurs under your account. You agree to provide accurate information when registering
              and to notify us immediately of any unauthorized use of your account.
            </p>
          </Section>

          <Section title="4. Acceptable Use">
            <p style={{ marginBottom: '12px' }}>You agree not to use the Service to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Send unsolicited bulk email (spam) in violation of applicable laws, including CAN-SPAM and GDPR</li>
              <li>Generate content targeting individuals without a legitimate business reason</li>
              <li>Harass, threaten, or deceive any person or entity</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
              <li>Reverse-engineer, scrape, or attempt to extract the underlying AI models or data</li>
              <li>Share your account credentials with third parties or resell access to the Service</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </Section>

          <Section title="5. Subscription & Billing">
            <p>
              Plans are billed monthly. Your subscription renews automatically on your billing date.
              Billing is handled securely by our third-party payment processor. By subscribing, you
              authorize recurring charges to your payment method until you cancel. Prices may change
              with 30 days&apos; notice. Regional pricing may apply based on your country of location.
            </p>
          </Section>

          <Section title="6. Credits">
            <p>
              Your plan includes a monthly credit allowance. Each successfully generated icebreaker
              uses 1 credit. Credits reset on your billing date and unused credits do not roll over.
              Failed scrapes do not consume credits.
            </p>
          </Section>

          <Section title="7. Refunds">
            <p>
              We offer a 7-day refund on your first subscription payment. After 7 days or after the
              second billing cycle, payments are non-refundable. See our{' '}
              <a href="/refund" style={{ color: 'var(--purple-main)', textDecoration: 'none' }}>
                Refund Policy
              </a>{' '}
              for full details.
            </p>
          </Section>

          <Section title="8. Cancellation">
            <p>
              You may cancel your subscription at any time from Dashboard → Settings → Billing.
              Your access continues until the end of the current billing period. We do not provide
              partial-month refunds for cancellations.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              The icebreakers and other content generated by the Service on your behalf belong to you.
              You may use them freely in your outreach campaigns without restriction. The IcebreakerAI
              brand, interface, codebase, and underlying models remain the property of IcebreakerAI
              and may not be copied or reproduced.
            </p>
          </Section>

          <Section title="10. AI-Generated Content">
            <p>
              IcebreakerAI uses artificial intelligence to generate personalized opening lines.
              All AI-generated content is provided to you for review before use. You are responsible
              for reviewing, editing, and approving any content before sending it to third parties.
              IcebreakerAI does not send messages on your behalf and is not responsible for how
              generated content is used after export.
            </p>
          </Section>

          <Section title="11. Disclaimer of Warranties">
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind. IcebreakerAI does
              not guarantee reply rates, email deliverability, or any specific business outcome from
              using the generated content. We do not warrant that the Service will be uninterrupted,
              error-free, or free of harmful components.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, our total liability to you for any claim arising
              from your use of the Service will not exceed the amount you paid us in the 3 months
              preceding the claim. In no event shall IcebreakerAI be liable for indirect, incidental,
              special, or consequential damages.
            </p>
          </Section>

          <Section title="13. Governing Law">
            <p>
              These Terms are governed by the laws of Bangladesh. Any disputes will be resolved in the
              courts of Bangladesh, unless otherwise required by local consumer protection law in your
              country.
            </p>
          </Section>

          <Section title="14. Termination">
            <p>
              You may delete your account at any time from your account settings. We may suspend or
              terminate your access if you violate these Terms or if we discontinue the Service, with
              reasonable notice where possible. Upon termination, your right to use the Service ceases
              immediately.
            </p>
          </Section>

          <Section title="15. Changes to These Terms">
            <p>
              We may update these Terms from time to time. When we do, we will update the &ldquo;Last
              Updated&rdquo; date at the top of this page. Continued use of the Service after changes are
              posted constitutes your acceptance of the revised Terms. We will make reasonable efforts
              to notify active users of material changes via email.
            </p>
          </Section>

          <Section title="16. Contact">
            <p>
              Questions about these Terms:{' '}
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
