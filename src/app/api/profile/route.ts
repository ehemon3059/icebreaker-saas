import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { COUNTRY_OPTIONS, type CountryCode } from '@/lib/billing/geo-pricing'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, email, country } = body as { name?: string; email?: string; country?: string }

  // Validate country if provided
  if (country) {
    const valid = COUNTRY_OPTIONS.find((c) => c.code === country)
    if (!valid) return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
  }

  // Update email in Supabase Auth if changed
  if (email && email !== user.email) {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Update DB
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name !== undefined && { name: name.trim() || null }),
      ...(email !== undefined && { email }),
      ...(country !== undefined && { country: country as CountryCode }),
    },
    select: { name: true, email: true, country: true },
  })

  return NextResponse.json({ success: true, user: updated })
}
