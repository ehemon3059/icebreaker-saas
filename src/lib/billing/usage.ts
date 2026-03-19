import { prisma } from '@/lib/prisma'

export async function checkCredits(userId: string): Promise<{
  hasCredits: boolean
  used: number
  limit: number
  remaining: number
  plan: string
}> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { creditsUsed: true, creditLimit: true, subscriptionTier: true },
  })

  const remaining = Math.max(0, user.creditLimit - user.creditsUsed)

  return {
    hasCredits: remaining > 0,
    used: user.creditsUsed,
    limit: user.creditLimit,
    remaining,
    plan: user.subscriptionTier,
  }
}

export async function deductCredit(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { creditsUsed: { increment: 1 } },
  })
}

export async function deductCredits(userId: string, count: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { creditsUsed: { increment: count } },
  })
}
