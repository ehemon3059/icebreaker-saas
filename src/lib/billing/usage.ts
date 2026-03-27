import { prisma } from '@/lib/prisma'

export async function checkCredits(userId: string): Promise<{
  hasCredits: boolean
  used: number
  limit: number
  tier: string
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      creditsUsed: true,
      creditLimit: true,
      subscriptionTier: true,  // ← correct field name
    },
  })

  if (!user) {
    throw new Error(`User ${userId} not found. Auth callback may not have synced.`)
  }

  return {
    hasCredits: user.creditsUsed < user.creditLimit,
    used: user.creditsUsed,
    limit: user.creditLimit,
    tier: user.subscriptionTier,
  }
}

export async function incrementCredits(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { creditsUsed: { increment: 1 } },
  })
}