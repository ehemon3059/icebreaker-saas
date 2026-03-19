'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'How does the AI personalization work?',
    a: "We scrape public information from your prospect's company website and combine it with their name and role. Our AI then writes a unique opening line that references something specific about their company.",
  },
  {
    q: "What if a website can't be scraped?",
    a: "No problem — and you won't be charged for failed scrapes. If we can't access a website, the AI still generates a solid icebreaker based on the prospect's job title and company name.",
  },
  {
    q: 'How do credits work?',
    a: "Each successfully generated icebreaker uses 1 credit. Credits reset monthly on your billing date. Unused credits don't roll over.",
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes — cancel with one click from your dashboard. You'll keep access until the end of your current billing period.",
  },
  {
    q: 'What formats can I export?',
    a: 'You can copy individual icebreakers to your clipboard or export your entire batch as a CSV file, ready to import into Lemlist, Instantly, or any outreach tool.',
  },
  {
    q: 'Is my data safe?',
    a: "We don't store your prospects' data longer than needed for generation. Scraped website content is cached for 24 hours to improve speed, then deleted.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <section className="bg-gray-50 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 md:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={[
                      'ml-4 shrink-0 text-gray-400 transition-transform duration-200',
                      isOpen ? 'rotate-180' : '',
                    ].join(' ')}
                  />
                </button>

                {isOpen && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
