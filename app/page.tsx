import Link from 'next/link'
import { getAllLoreEntries } from '@/lib/lore'
import HomeCarousel from '@/components/BookCarousel'

const FEATURED_CATEGORIES = [
  { slug: 'people-of-importance', label: 'People of Importance' },
  { slug: 'holy-beings', label: 'Holy Beings' },
  { slug: 'nations', label: 'Nations' },
  { slug: 'elements', label: 'Elements' },
  { slug: 'races', label: 'Races' },
]

export default function HomePage() {
  const entries = getAllLoreEntries()
  const entryCount = entries.length
  const categoryCount = new Set(entries.map(e => e.category)).size

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .fade-up   { animation: fadeUp 0.8s ease both; }
        .fade-in   { animation: fadeIn 1.2s ease both; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.25s; }
        .d3 { animation-delay: 0.4s; }
        .d4 { animation-delay: 0.6s; }
        .d5 { animation-delay: 0.8s; }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            var(--gold-dim) 0%,
            var(--gold-bright) 40%,
            var(--gold-warm) 60%,
            var(--gold-dim) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 6s linear infinite;
        }

        .book-spine {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }
        .book-spine:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .cta-btn {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.8rem 2rem;
          border: 1px solid var(--gold-mid);
          color: var(--gold-mid);
          background: transparent;
          transition: background 0.25s ease, color 0.25s ease;
          text-decoration: none;
        }
        .cta-btn:hover {
          background: var(--gold-mid);
          color: var(--navy-deepest);
        }
        .cta-btn-ghost {
          border-color: rgba(212,175,106,0.3);
          color: var(--cream-muted);
        }
        .cta-btn-ghost:hover {
          background: rgba(212,175,106,0.08);
          color: var(--gold-mid);
        }

        .section-rule {
          width: 40px;
          height: 1px;
          background: var(--gold-dim);
          margin: 0 auto 1rem;
        }

        .lore-category-card {
          border: 1px solid var(--border);
          padding: 1.5rem;
          background: var(--navy-mid);
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          text-decoration: none;
          display: block;
        }
        .lore-category-card:hover {
          border-color: var(--border-bright);
          background: var(--navy-light);
          transform: translateY(-3px);
        }

        .ornamented-heading::before,
        .ornamented-heading::after {
          content: '✦';
          font-size: 0.5em;
          color: var(--gold-dim);
          margin: 0 0.75em;
          vertical-align: middle;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem 1.5rem 5rem',
          gap: '0',
        }}
      >
        {/* Atmospheric background layers */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(80,60,140,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(180,120,30,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 30% 30% at 80% 20%, rgba(100,50,50,0.06) 0%, transparent 60%)
          `
        }} />

        {/* Eyebrow */}
        <h4 className="fade-up d1" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold-dim)',
          marginBottom: '0.75rem',
        }}>
          The World of
        </h4>

        {/* Main title */}
        <h1
          className="fade-up d2 shimmer-text"
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            lineHeight: 1.1,
            marginBottom: '0.25rem',
          }}
        >
          Nasariane
        </h1>

        {/* Subtitle rule */}
        <div className="fade-up d3" style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          margin: '0.75rem auto',
          width: 'min(400px, 80vw)',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--gold-dim))', marginBottom: '3px' }} />
          <h4 style={{ color: 'var(--gold-dim)', fontSize: '0.8rem', letterSpacing: '0.2em', fontFamily: "'Cinzel', serif" }}>TPP SERIES & MORE</h4>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, var(--gold-dim))', marginBottom: '3px' }} />
        </div>

        {/* Tagline */}
        <p className="fade-up d3" style={{
          fontFamily: "'Crimson Text', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
          color: 'var(--cream-dim)',
          maxWidth: '520px',
          marginBottom: '2rem',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          For when all seems lost, when the world is crumbling, a hand will be upon your shoulder...
        </p>

        {/* CTA */}
        <div className="fade-up d4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/lore" className="cta-btn">Explore the Lore</Link>
        </div>

        {/* Scroll indicator */}
        <div className="fade-in d5" style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        }}>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--gold-dim)', textTransform: 'uppercase' }}>Scroll</h4>
          <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, var(--gold-dim), transparent)' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BOOKS ROW
      ══════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-container">
          <HomeCarousel />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LORE PREVIEW
      ══════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="ornamented-heading" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', display: 'inline-block' }}>
              Lore Compendium
            </h2>
            <p style={{
              marginTop: '1rem',
              color: 'var(--cream-muted)',
              fontSize: '1rem',
              maxWidth: '480px',
              margin: '1rem auto 0',
            }}>
              {entryCount} entries across {categoryCount} categories. Spoiler-free reading available.
            </p>
          </div>

          {/* Category cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}>
            {FEATURED_CATEGORIES.map((cat) => {
              const count = entries.filter(e => e.category === cat.slug).length
              return (
                <Link
                  key={cat.slug}
                  href={`/lore/${cat.slug}`}
                  className="lore-category-card"
                >
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--gold-dim)',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.02em',
                  }}>
                    {count}
                  </div>
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.78rem',
                    letterSpacing: '0.06em',
                    color: 'var(--gold-mid)',
                    lineHeight: 1.35,
                  }}>
                    {cat.label}
                  </div>
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--cream-muted)',
                  }}>
                    entries
                  </div>
                </Link>
              )
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/lore" className="cta-btn">Browse All Entries</Link>
          </div>
        </div>
      </section>
    </>
  )
}
