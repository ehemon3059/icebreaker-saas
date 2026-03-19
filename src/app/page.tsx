import type { Metadata } from "next";
import { Upload, Sparkles, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "IcebreakerAI — AI-Powered Cold Email Openers",
  description:
    "Generate personalized cold email icebreakers using AI. Upload your leads, and get unique opening lines that actually get replies.",
  openGraph: {
    title: "IcebreakerAI — AI-Powered Cold Email Openers",
    description: "Generate personalized cold email icebreakers using AI.",
    url: "/",
  },
};
import LiveDemo from "@/components/landing/LiveDemo";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";

const steps = [
  {
    number: "1",
    icon: Upload,
    iconColor: "text-blue-600",
    title: "Upload Your Leads",
    description:
      "Paste a single lead or upload an entire CSV file with names, titles, and company websites.",
  },
  {
    number: "2",
    icon: Sparkles,
    iconColor: "text-purple-600",
    title: "AI Writes Your Openers",
    description:
      "Our AI scrapes company context and crafts a personalized icebreaker for each prospect in seconds.",
  },
  {
    number: "3",
    icon: Download,
    iconColor: "text-green-600",
    title: "Copy & Send",
    description:
      "Copy individual lines or export your entire list as a CSV. Ready for Gmail, Lemlist, or any outreach tool.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <span className="mb-6 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600">
            AI-Powered Sales Tool
          </span>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Write Perfect Cold Email Openers in Seconds
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
            Upload your leads, and our AI writes personalized icebreakers that
            actually get replies. No more generic templates.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#demo"
              className="w-full rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              Try It Free
            </a>
            <a
              href="#pricing"
              className="w-full rounded-lg border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map(({ number, icon: Icon, iconColor, title, description }) => (
              <div key={number} className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                    {number}
                  </span>
                </div>
                <Icon size={40} className={`mb-4 ${iconColor}`} />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LiveDemo />
      <PricingSection />
      <FaqSection />
    </main>
  );
}
