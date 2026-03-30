// Central source of truth for all plan details.

export const PLANS = {
  FREE: {
    name: 'Free',
    slug: 'FREE',
    price: 0,
    credits: 10,
    features: [
      '10 credits per month',
      'Single lead input',
      'Perfect to test the product',
    ],
  },
  PRO: {
    name: 'Pro',
    slug: 'PRO',
    price: 9,
    credits: 500,
    features: [
      '500 credits per month',
      'CSV bulk upload (up to 1,000 leads)',
      'One-click CSV export',
      'Priority processing queue',
      'Industry-aware AI tone',
      'Email support (within 24 hours)',
      'Credits reset on your billing date',
    ],
  },
  SCALE: {
    name: 'Scale',
    slug: 'SCALE',
    price: 79,
    credits: 5000,
    features: [
      '5,000 credits per month',
      'CSV bulk upload',
      'Priority processing',
      'Export to CSV',
      'API access',
      'CRM integrations',
      'Team seats',
      'Priority support',
    ],
  },
} as const

type PlanKey = keyof typeof PLANS

export function getPlanCredits(plan: string): number {
  const key = plan.toUpperCase() as PlanKey
  return PLANS[key]?.credits ?? 10
}
