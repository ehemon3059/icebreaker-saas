import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Run Supabase session refresh + auth redirects first.
  const response = await updateSession(request)

  // If the response is already a redirect (from updateSession), respect it.
  if (response.status === 307 || response.status === 308) {
    return response
  }

  // For authenticated users accessing /dashboard, ensure geo verification is done.
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const geoVerified = request.cookies.get('geo_verified')?.value
    if (!geoVerified) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/country'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
