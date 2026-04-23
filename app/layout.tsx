import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'The World of Nasariane',
  description: 'The official lore compendium for the TPP book series by Aiden Sperr.',
  openGraph: {
    title: 'The World of Nasariane',
    description: 'Explore the lore, people, and places of the TPP universe.',
    siteName: 'TPP Books',
  },
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/series/tpp', label: 'Series' },
  { href: '/lore', label: 'Lore' },
  { href: '/map', label: 'Map' },
  { href: '/about', label: 'About' },
]

// SVG filigree corner — a simple ornamental bracket
function FiligreeSvg() {
  return (
    <svg
      className="filigree-corner"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 58 L2 2 L58 2" stroke="#d4af6a" strokeWidth="1.5" fill="none" />
      <path d="M2 20 Q10 2 20 2" stroke="#d4af6a" strokeWidth="0.75" fill="none" strokeDasharray="2 3" />
      <circle cx="2" cy="2" r="2.5" fill="#d4af6a" />
      <circle cx="2" cy="58" r="1.5" fill="#d4af6a" opacity="0.5" />
      <circle cx="58" cy="2" r="1.5" fill="#d4af6a" opacity="0.5" />
    </svg>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* ── Navigation ─────────────────────────────────── */}
        <header className="site-nav">
          <div className="page-container">
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '60px',
              }}
            >
              {/* Wordmark */}
              <Link
                href="/"
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '0.95rem',
                  letterSpacing: '0.1em',
                  color: 'var(--gold-mid)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                TPP Books
              </Link>

              {/* Nav links */}
              <ul
                style={{
                  display: 'flex',
                  gap: '2rem',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="nav-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        {/* ── Main content ───────────────────────────────── */}
        <main>{children}</main>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            marginTop: '6rem',
            padding: '2.5rem 0',
          }}
        >
          <div
            className="page-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.8rem',
                color: 'var(--gold-dim)',
                letterSpacing: '0.12em',
              }}
            >
              TPP Books
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--cream-muted)', margin: 0 }}>
              The World of Nasariane © {new Date().getFullYear()} · All rights reserved
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}