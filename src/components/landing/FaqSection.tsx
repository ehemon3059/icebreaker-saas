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
  {
    q: 'Does IcebreakerAI send emails for me?',
    a: 'No. IcebreakerAI only generates the opening line text. You copy or export it and send from your own outreach tool (Lemlist, Instantly, Apollo, etc.). We never access or send from your email inbox.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            FAQ
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 700, color: 'var(--text-primary)',
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            const isLast = i === FAQS.length - 1
            return (
              <div
                key={i}
                style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}
              >
                <button
                  onClick={() => toggle(i)}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center',
                    justifyContent: 'space-between', padding: '20px 24px',
                    textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.95rem', fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sora), Sora, sans-serif',
                    }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      marginLeft: '16px', flexShrink: 0,
                      color: 'var(--text-muted)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>

                {isOpen && (
                  <p
                    style={{
                      padding: '0 24px 20px',
                      fontSize: '0.9rem', lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                    }}
                  >
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
