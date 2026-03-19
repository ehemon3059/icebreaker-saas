'use client'

// Lemon.js types — injected by the <Script> tag in layout.tsx
declare global {
  interface Window {
    createLemonSqueezy: () => void
    LemonSqueezy: {
      Url: {
        Open: (url: string) => void
      }
    }
  }
}

export interface CheckoutButtonProps {
  variantId: string
  userId: string
  userEmail: string
  label?: string
  className?: string
}

export default function CheckoutButton({
  variantId,
  userId,
  userEmail,
  label = 'Upgrade',
  className,
}: CheckoutButtonProps) {
  function handleClick() {
    const storeUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL!

    const url = new URL(`${storeUrl}/checkout/buy/${variantId}`)
    url.searchParams.set('checkout[custom][user_id]', userId) // CRITICAL: links payment → user
    url.searchParams.set('checkout[email]', userEmail)        // pre-fills email in checkout
    url.searchParams.set('embed', '1')                        // overlay, not redirect

    // Initialise Lemon.js overlay (idempotent)
    if (typeof window !== 'undefined' && window.createLemonSqueezy) {
      window.createLemonSqueezy()
    }

    window.LemonSqueezy.Url.Open(url.toString())
  }

  return (
    <button onClick={handleClick} className={className}>
      {label}
    </button>
  )
}
