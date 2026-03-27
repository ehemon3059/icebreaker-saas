import Link from 'next/link'

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', href: '/#how' },
      { label: 'Live demo', href: '/#demo' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Get started', href: '/signup' },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'SaaS sales', href: '#' },
      { label: 'Recruiting', href: '#' },
      { label: 'Real estate', href: '#' },
      { label: 'Agencies', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 0 32px',
        background: '#0a0a0a',
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
          <div>
            <Link
              href="/"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                textDecoration: 'none', marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: '#22d07a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px',
                }}
              >
                ❄
              </div>
              <span
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: '1.1rem', color: '#e8eaf2', fontWeight: 400,
                }}
              >
                IcebreakerAI
              </span>
            </Link>
            <p
              style={{
                fontSize: '0.85rem', color: '#7a7f96',
                maxWidth: '240px', lineHeight: '1.6',
              }}
            >
              AI-powered cold email personalization for sales teams, recruiters, and agencies worldwide.
            </p>
          </div>

          {/* Link columns */}
          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
            {columns.map((col) => (
              <div key={col.heading}>
                <h4
                  style={{
                    fontSize: '0.75rem', color: '#e8eaf2',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: '14px', fontWeight: 600,
                  }}
                >
                  {col.heading}
                </h4>
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      display: 'block', fontSize: '0.85rem',
                      color: '#7a7f96', textDecoration: 'none', marginBottom: '10px',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: '#3e4259' }}>
            © {new Date().getFullYear()} IcebreakerAI. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#3e4259' }}>
            Built with ♥ in Bangladesh 🇧🇩 · Serving the world 🌍
          </p>
        </div>

      </div>
    </footer>
  )
}
