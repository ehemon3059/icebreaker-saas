// Central source of truth for all plan details.
// Variant IDs come from your Lemon Squeezy dashboard after creating products.
// Set these in .env.local:
//   NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID=...
//   NEXT_PUBLIC_LEMONSQUEEZY_SCALE_VARIANT_ID=...

export const PLANS = {
  FREE: {
    name: 'Free',
    slug: 'FREE',
    price: 0,
    credits: 10,
    variantId: null, // No Lemon Squeezy variant — free is the default state
    features: [
      '10 icebreakers per month',
      'Single lead generation',
      'Basic scraping',
    ],
  },
  PRO: {
    name: 'Pro',
    slug: 'PRO',
    price: 29,
    credits: 500,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID!,
    features: [
      '500 icebreakers per month',
      'CSV bulk upload',
      'Priority scraping',
      'Export to CSV',
    ],
  },
  SCALE: {
    name: 'Scale',
    slug: 'SCALE',
    price: 79,
    credits: 5000,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_SCALE_VARIANT_ID!,
    features: [
      '5,000 icebreakers per month',
      'CSV bulk upload',
      'Priority scraping',
      'Export to CSV',
      'Priority support',
    ],
  },
} as const

type PlanKey = keyof typeof PLANS
type PlanValue = (typeof PLANS)[PlanKey]

export function getPlanByVariantId(variantId: string): PlanValue | null {
  for (const key of Object.keys(PLANS) as PlanKey[]) {
    const plan = PLANS[key]
    if (plan.variantId === variantId) return plan
  }
  return null
}

export function getPlanCredits(plan: string): number {
  const key = plan.toUpperCase() as PlanKey
  return PLANS[key]?.credits ?? 10 // default to FREE limit
}
