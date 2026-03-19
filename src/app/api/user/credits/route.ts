import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { creditsUsed: true, creditLimit: true },
  })

  if (!dbUser) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: {
      used: dbUser.creditsUsed,
      limit: dbUser.creditLimit,
    },
  })
}
