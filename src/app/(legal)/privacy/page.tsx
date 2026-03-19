import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 font-sans md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">Privacy Policy</h1>
        <p className="mb-12 text-sm text-gray-500">Last updated: March 19, 2026</p>

        <div className="space-y-10 text-gray-700">

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p className="mb-3 leading-relaxed">
              We collect only what we need to provide the Service:
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                <strong>Account information</strong> — your email address and name, provided when
                you sign up directly or via OAuth (Google).
              </li>
              <li>
                <strong>Prospect data</strong> — names, job titles, company names, and website
                URLs that you enter manually or upload via CSV. This data is used solely to
                generate icebreakers on your behalf.
              </li>
              <li>
                <strong>Usage data</strong> — which features you use, how many icebreakers you
                generate, and error events. This helps us improve the Service.
              </li>
              <li>
                <strong>Payment information</strong> — we do not store your payment details. All
                billing is handled by Lemon Squeezy; we only receive a confirmation of your
                subscription status.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed">
              <li>To create and manage your account</li>
              <li>To generate AI icebreakers from the prospect data you provide</li>
              <li>To track credit usage and enforce plan limits</li>
              <li>To send transactional emails (e.g. billing receipts) — no marketing emails without consent</li>
              <li>To diagnose errors and improve reliability via aggregated analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">3. Data Storage</h2>
            <p className="leading-relaxed">
              Your account data and generated icebreakers are stored in a PostgreSQL database
              hosted by <strong>Supabase</strong>, located in the United States. Scraped website
              content used for AI context is cached for up to 24 hours to improve speed, then
              automatically deleted. We use industry-standard encryption in transit (TLS) and at
              rest.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">4. Third-Party Services</h2>
            <p className="mb-3 leading-relaxed">
              We use the following third-party services to operate IcebreakerAI:
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                <strong>Supabase</strong> — authentication and database hosting
              </li>
              <li>
                <strong>Google Gemini</strong> — AI generation. Prospect names, titles, and company
                context are sent to Google's API to generate icebreakers. Google's data use is
                governed by their API Terms of Service.
              </li>
              <li>
                <strong>Lemon Squeezy</strong> — payment processing and subscription management
              </li>
              <li>
                <strong>Upstash</strong> — Redis-based rate limiting and job queuing; no personal
                data is stored there beyond rate limit counters keyed by IP address
              </li>
              <li>
                <strong>PostHog</strong> — product analytics (pageviews, feature usage). Data is
                anonymized where possible and used only to improve the Service.
              </li>
              <li>
                <strong>Sentry</strong> — error tracking. Error reports may include stack traces
                and request context, but we configure Sentry to exclude sensitive user data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">5. Cookies</h2>
            <p className="leading-relaxed">
              We use cookies minimally. An authentication session cookie is set when you log in to
              keep you signed in. We do not use advertising or cross-site tracking cookies. PostHog
              sets an anonymous analytics cookie to distinguish unique sessions; you can opt out
              via your browser settings or a global privacy signal.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">6. Data Retention</h2>
            <p className="leading-relaxed">
              Your account data and generated icebreakers are retained while your account is
              active. If you delete your account, your personal information and prospect data are
              deleted within 30 days. Aggregated, anonymized usage statistics may be retained
              indefinitely as they cannot be linked to you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">7. Your Rights</h2>
            <p className="mb-3 leading-relaxed">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed">
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Deletion</strong> — ask us to delete your account and all associated data</li>
              <li><strong>Correction</strong> — update inaccurate information in your account settings</li>
              <li><strong>Export</strong> — download your generated icebreakers as a CSV from your dashboard</li>
              <li><strong>Objection</strong> — opt out of analytics tracking at any time</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              To exercise any of these rights, email us at{' '}
              <a href="mailto:hello@icebreakerAI.com" className="text-blue-600 underline hover:text-blue-700">
                hello@icebreakerAI.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">8. Children's Privacy</h2>
            <p className="leading-relaxed">
              IcebreakerAI is not directed at children under the age of 13. We do not knowingly
              collect personal information from anyone under 13. If you believe a child has
              provided us with personal data, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">9. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. The "Last updated" date at the
              top of this page reflects the most recent revision. We will notify active users of
              material changes via email. Continued use of the Service after changes are posted
              constitutes acceptance of the revised Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">10. Contact Information</h2>
            <p className="leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@icebreakerAI.com" className="text-blue-600 underline hover:text-blue-700">
                hello@icebreakerAI.com
              </a>
              . We take privacy seriously and will respond promptly.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
