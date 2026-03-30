// Country-based pricing configuration.
// Discount regions (IN, BR, PH) get lower prices.
// Standard regions (US, GB, CA, OTHER) all pay $29/mo.

export type CountryCode = 'US' | 'GB' | 'CA' | 'IN' | 'BR' | 'PH' | 'OTHER'

export const COUNTRY_OPTIONS: Array<{
  code: CountryCode
  label: string
  flag: string
  proPrice: number
  scalePrice: number
}> = [
  { code: 'US',    label: 'United States',  flag: '🇺🇸',   proPrice: 29, scalePrice: 79 },
  { code: 'GB',    label: 'UK',             flag: '🇬🇧',   proPrice: 29, scalePrice: 79 },
  { code: 'CA',    label: 'Canada',         flag: '🇨🇦',   proPrice: 29, scalePrice: 79 },
  { code: 'IN',    label: 'India',          flag: '🇮🇳',   proPrice: 9,  scalePrice: 25 },
  { code: 'BR',    label: 'Brazil',         flag: '🇧🇷',   proPrice: 15, scalePrice: 40 },
  { code: 'PH',    label: 'Philippines',    flag: '🇵🇭',   proPrice: 12, scalePrice: 32 },
  { code: 'OTHER', label: 'Other country',  flag: '🌍',    proPrice: 29, scalePrice: 79 },
]

// Country codes that get discounted pricing — must verify IP before granting.
export const DISCOUNT_COUNTRIES: CountryCode[] = ['IN', 'BR', 'PH']

// Returns the pricing config for a given country code.
export function getPricingForCountry(code: string) {
  return (
    COUNTRY_OPTIONS.find((c) => c.code === code) ??
    COUNTRY_OPTIONS.find((c) => c.code === 'OTHER')!
  )
}

// Whether the IP country check should be enforced for a selected country.
// Only enforced for discount countries to prevent abuse.
export function requiresIpVerification(selectedCountry: CountryCode): boolean {
  return DISCOUNT_COUNTRIES.includes(selectedCountry)
}
