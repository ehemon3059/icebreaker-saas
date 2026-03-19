import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { INDUSTRIES } from '@/data/industries'

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ industry: industry.slug }))
}

// ─── Per-page metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>
}): Promise<Metadata> {
  const { industry: slug } = await params
  const industry = INDUSTRIES.find((i) => i.slug === slug)
  if (!industry) return {}

  return {
    title: industry.title,
    description: industry.description,
    openGraph: {
      title: industry.title,
      description: industry.description,
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry: slug } = await params
  const industry = INDUSTRIES.find((i) => i.slug === slug)

  if (!industry) notFound()

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Header */}
      <section className="border-b border-gray-100 px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600">
            {industry.name}
          </span>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
            {industry.title}
          </h1>
          <p className="text-lg text-gray-600">{industry.description}</p>
        </div>
      </section>

      {/* Examples */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-xl font-semibold text-gray-900">
            Example Icebreakers
          </h2>

          <div className="space-y-6">
            {industry.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                {/* Lead info */}
                <p className="mb-3 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{ex.name}</span>
                  {' · '}
                  {ex.title}
                  {' · '}
                  {ex.company}
                </p>

                {/* Icebreaker quote */}
                <blockquote className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3">
                  <p className="text-base leading-relaxed text-gray-900">{ex.icebreaker}</p>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            Generate your own icebreakers
          </h2>
          <p className="mb-8 text-blue-100">
            Try the AI free — no account needed.
          </p>
          <a
            href="/#demo"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            Try free
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </main>
  )
}
