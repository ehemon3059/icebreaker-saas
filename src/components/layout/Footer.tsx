import Link from 'next/link'

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'How It Works', href: '/#how' },
      { label: 'Live Demo', href: '/#demo' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Get Started', href: '/signup' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'support@icebreakerAI.com', href: 'mailto:support@icebreakerAI.com' },
      { label: 'hello@icebreakerAI.com', href: 'mailto:hello@icebreakerAI.com' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '56px 0 32px',
        background: 'var(--bg-card)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Top row: brand + link columns */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap',
            marginBottom: '48px',
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: '240px' }}>
            <Link
              href="/"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                textDecoration: 'none', marginBottom: '14px',
              }}
            >
              <div
                style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: 'var(--purple-main)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', flexShrink: 0,
                }}
              >
                ❄
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-sora), Sora, sans-serif',
                  fontSize: '1.05rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              >
                IcebreakerAI
              </span>
            </Link>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: '1.65',
              }}
            >
              AI-powered cold email personalization for sales teams, recruiters, and agencies worldwide.
            </p>
          </div>

          {/* Link columns */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '14px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                  }}
                >
                  {col.heading}
                </h4>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      marginBottom: '10px',
                      transition: 'color 0.25s cubic-bezier(.4,0,.2,1)',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              IcebreakerAI · Founder: Eh Emon · Bangladesh (Remote Team, Operating Globally)
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              © 2026 IcebreakerAI. All rights reserved.
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.7 }}>
            AI-generated content is reviewed by users before sending. IcebreakerAI does not send emails on your behalf.
          </p>
        </div>

      </div>
    </footer>
  )
}
