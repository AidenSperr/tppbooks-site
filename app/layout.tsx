import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'The World of Nasariane',
  description: 'The official lore compendium for the TPP book series by Aiden Sperr.',
  openGraph: {
    title: 'The World of Nasariane',
    description: 'Explore the lore, people, and places of the TPP universe.',
    siteName: 'TPP Books',
  },
}

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
        <NavBar />

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