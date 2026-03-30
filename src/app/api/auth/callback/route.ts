import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if this user has completed location verification.
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { locationVerified: true },
        })

        // New user (not in DB yet) or hasn't verified → onboarding
        if (!dbUser || !dbUser.locationVerified) {
          return NextResponse.redirect(`${origin}/onboarding/country`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth failed — send back to login with error param
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
