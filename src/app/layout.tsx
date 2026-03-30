import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import ThemeProvider from '@/components/providers/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'IcebreakerAI — AI-Powered Cold Email Openers',
    template: '%s | IcebreakerAI',
  },
  description:
    'Generate personalized cold email icebreakers using AI. Upload your leads, and get unique opening lines that actually get replies.',
  keywords: [
    'cold email',
    'icebreaker',
    'sales AI',
    'email personalization',
    'lead generation',
    'outreach',
  ],
  authors: [{ name: 'IcebreakerAI' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'IcebreakerAI',
    title: 'IcebreakerAI — AI-Powered Cold Email Openers',
    description: 'Generate personalized cold email icebreakers using AI.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IcebreakerAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IcebreakerAI — AI-Powered Cold Email Openers',
    description: 'Generate personalized cold email icebreakers using AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${sora.variable} ${dmSans.variable} antialiased`}>
        <ThemeProvider>
          <PostHogProvider>
            <Navbar />
            {children}
            <Footer />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
