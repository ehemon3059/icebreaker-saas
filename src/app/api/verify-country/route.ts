import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { type CountryCode, requiresIpVerification } from '@/lib/billing/geo-pricing'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const selectedCountry = body.selectedCountry as CountryCode

  if (!selectedCountry) {
    return NextResponse.json({ error: 'Missing selectedCountry' }, { status: 400 })
  }

  // Vercel sets this header automatically on deployed instances.
  // In local dev it's absent — we skip the IP check in that case.
  const ipCountry = req.headers.get('x-vercel-ip-country')
  const isDev = !ipCountry

  // Only enforce IP check for discount countries (IN, BR, PH).
  // Standard-priced countries (US, GB, CA, OTHER) are trusted.
  let match = true
  if (!isDev && requiresIpVerification(selectedCountry)) {
    match = ipCountry === selectedCountry
  }

  // "OTHER" is valid only when the IP is not one of the specific tracked countries.
  if (!isDev && selectedCountry === 'OTHER') {
    const specificCountries = ['US', 'GB', 'CA', 'IN', 'BR', 'PH']
    match = !specificCountries.includes(ipCountry!)
  }

  if (!match) {
    return NextResponse.json(
      {
        match: false,
        message:
          'Your connection appears to be from a different country than selected. If you are using a VPN, please disable it and try again.',
      },
      { status: 403 }
    )
  }

  // Upsert user and mark location as verified.
  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      country: selectedCountry,
      locationVerified: true,
      ipCountry: ipCountry ?? selectedCountry,
    },
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name ?? null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
      country: selectedCountry,
      locationVerified: true,
      ipCountry: ipCountry ?? selectedCountry,
      subscriptionTier: 'FREE',
      creditLimit: 10,
      creditsUsed: 0,
    },
  })

  // Set a geo_verified cookie so middleware can skip the DB check on every request.
  const response = NextResponse.json({ match: true })
  response.cookies.set('geo_verified', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
  return response
}
