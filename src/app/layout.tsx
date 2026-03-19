import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <Navbar />
          {children}
          <Footer />
        </PostHogProvider>
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
