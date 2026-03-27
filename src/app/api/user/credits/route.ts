import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {}, // don't overwrite anything on re-login
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name ?? null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
      subscriptionTier: 'FREE',  // ← matches your schema
      creditLimit: 10,
      creditsUsed: 0,
    },
    select: {
      creditsUsed: true,
      creditLimit: true,
      subscriptionTier: true,  // ← matches your schema
    },
  })

  return NextResponse.json({
    success: true,
    data: {
      used: dbUser.creditsUsed,
      limit: dbUser.creditLimit,
      tier: dbUser.subscriptionTier,
    },
  })
}