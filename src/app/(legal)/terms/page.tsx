import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 font-sans md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">Terms of Service</h1>
        <p className="mb-12 text-sm text-gray-500">Last updated: March 19, 2026</p>

        <div className="space-y-10 text-gray-700">

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using IcebreakerAI ("the Service"), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Service.
              These terms apply to all visitors, registered users, and paying customers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">2. Description of Service</h2>
            <p className="leading-relaxed">
              IcebreakerAI is an AI-powered tool that generates personalized opening lines for cold
              emails and outreach messages. The Service allows users to input prospect information
              and receive AI-generated icebreakers via single generation or bulk CSV upload.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">3. User Accounts</h2>
            <p className="leading-relaxed">
              You must create an account to access the full Service. You are responsible for
              maintaining the confidentiality of your login credentials and for all activity that
              occurs under your account. You agree to provide accurate information when registering
              and to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">4. Billing & Refunds</h2>
            <p className="leading-relaxed">
              Paid plans are billed monthly. Payments are processed securely by{' '}
              <strong>Lemon Squeezy</strong>, our payment processor. By subscribing to a paid plan,
              you authorize us to charge your payment method on a recurring basis until you cancel.
            </p>
            <p className="mt-3 leading-relaxed">
              Credits reset on your monthly billing date. Unused credits do not roll over to the
              next period. You may cancel your subscription at any time from your dashboard; you
              will retain access until the end of the current billing period. We do not offer
              refunds for partial months or unused credits, but please contact us if you have an
              issue and we will work with you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">5. Acceptable Use</h2>
            <p className="mb-3 leading-relaxed">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed">
              <li>Send unsolicited bulk email (spam) in violation of applicable laws, including CAN-SPAM and GDPR</li>
              <li>Generate content targeting individuals without a legitimate business reason</li>
              <li>Harass, threaten, or deceive any person or entity</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
              <li>Reverse-engineer, scrape, or attempt to extract the underlying AI models or data</li>
              <li>Share your account credentials with third parties or resell access to the Service</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">6. Data & Privacy</h2>
            <p className="leading-relaxed">
              Your use of the Service is also governed by our{' '}
              <a href="/privacy" className="text-blue-600 underline hover:text-blue-700">
                Privacy Policy
              </a>
              , which is incorporated into these Terms by reference. We take reasonable steps to
              protect your data, but you are responsible for the prospect data you upload and must
              ensure you have a legal basis for processing that data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">7. Intellectual Property</h2>
            <p className="leading-relaxed">
              The icebreakers and other content generated by the Service on your behalf belong to
              you. You may use them freely in your outreach campaigns without restriction. The
              IcebreakerAI brand, interface, codebase, and underlying models remain the property
              of IcebreakerAI and may not be copied or reproduced.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">8. Limitation of Liability</h2>
            <p className="leading-relaxed">
              The Service is provided "as is" without warranties of any kind. IcebreakerAI does
              not guarantee reply rates, email deliverability, or any specific business outcome
              from using the generated content. To the fullest extent permitted by law, our total
              liability to you for any claim arising from your use of the Service will not exceed
              the amount you paid us in the 3 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">9. Termination</h2>
            <p className="leading-relaxed">
              You may delete your account at any time from your account settings. We may suspend
              or terminate your access if you violate these Terms or if we discontinue the Service,
              with reasonable notice where possible. Upon termination, your right to use the Service
              ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">10. Changes to Terms</h2>
            <p className="leading-relaxed">
              We may update these Terms from time to time. When we do, we will update the "Last
              updated" date at the top of this page. Continued use of the Service after changes
              are posted constitutes your acceptance of the revised Terms. We will make reasonable
              efforts to notify active users of material changes via email.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">11. Contact Information</h2>
            <p className="leading-relaxed">
              If you have questions about these Terms, please reach out at{' '}
              <a href="mailto:hello@icebreakerAI.com" className="text-blue-600 underline hover:text-blue-700">
                hello@icebreakerAI.com
              </a>
              . We're a small team and will respond promptly.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
