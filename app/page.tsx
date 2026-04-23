import Link from 'next/link'
import { getAllLoreEntries } from '@/lib/lore'

// Book data — update titles/subtitles as needed
const BOOKS = [
  {
    number: 'I',
    title: 'Two Elven Sojourners',
    subtitle: 'Book One',
    spineColor: '#1a1a2e',
    spineAccent: '#d4af6a',
    textColor: '#d4af6a',
    borderColor: 'rgba(212,175,106,0.4)',
    available: true,
  },
  {
    number: 'II',
    title: 'Daughter of Ruin',
    subtitle: 'Book Two',
    spineColor: '#2a0a0a',
    spineAccent: '#c44040',
    textColor: '#e08080',
    borderColor: 'rgba(196,64,64,0.4)',
    available: false,
  },
  {
    number: 'III',
    title: 'A New Era',
    subtitle: 'Book Three',
    spineColor: '#0a1a0a',
    spineAccent: '#4a8a4a',
    textColor: '#80c080',
    borderColor: 'rgba(74,138,74,0.4)',
    available: false,
  },
]

const FEATURED_CATEGORIES = [
  { slug: 'people-of-importance', label: 'People of Importance', icon: '👤' },
  { slug: 'holy-beings', label: 'Holy Beings', icon: '✦' },
  { slug: 'nations', label: 'Nations', icon: '⚑' },
  { slug: 'elements', label: 'Elements', icon: '◈' },
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
        <p className="fade-up d1" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--gold-dim)',
          marginBottom: '0.75rem',
        }}>
          The World of
        </p>

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
          width: 'min(340px, 80vw)',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--gold-dim))' }} />
          <span style={{ color: 'var(--gold-dim)', fontSize: '0.8rem', letterSpacing: '0.2em', fontFamily: "'Cinzel', serif" }}>TPP SERIES</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, var(--gold-dim))' }} />
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

        {/* CTAs */}
        <div className="fade-up d4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/lore" className="cta-btn">Explore the Lore</Link>
          <Link href="/series/tpp" className="cta-btn cta-btn-ghost">The Series</Link>
        </div>

        {/* Scroll indicator */}
        <div className="fade-in d5" style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--gold-dim)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, var(--gold-dim), transparent)' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BOOKS ROW
      ══════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-rule" />
            <h2 className="ornamented-heading" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', display: 'inline-block' }}>
              The Trilogy
            </h2>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            {BOOKS.map((book) => (
              <div
                key={book.number}
                className="book-spine"
                style={{
                  width: '160px',
                  height: '240px',
                  background: book.spineColor,
                  border: `1px solid ${book.borderColor}`,
                  borderTop: `3px solid ${book.spineAccent}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1rem',
                  position: 'relative',
                  boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
                  opacity: book.available ? 1 : 0.55,
                }}
              >
                {/* Roman numeral */}
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  color: book.spineAccent,
                  opacity: 0.7,
                }}>BOOK {book.number}</span>

                {/* Title */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.8rem',
                    letterSpacing: '0.06em',
                    color: book.textColor,
                    lineHeight: 1.4,
                    marginBottom: '0.5rem',
                  }}>
                    {book.title}
                  </div>
                  {/* Decorative accent line */}
                  <div style={{ width: '24px', height: '1px', background: book.spineAccent, margin: '0 auto', opacity: 0.5 }} />
                </div>

                {/* Available / Coming soon */}
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.55rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: book.available ? book.spineAccent : 'rgba(255,255,255,0.2)',
                }}>
                  {book.available ? 'Available' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LORE PREVIEW
      ══════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-rule" />
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}>
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/lore`}
                className="lore-category-card"
              >
                <div style={{
                  fontSize: '1.2rem',
                  marginBottom: '0.6rem',
                  color: 'var(--gold-dim)',
                }}>
                  {cat.icon}
                </div>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  color: 'var(--gold-mid)',
                }}>
                  {cat.label}
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/lore" className="cta-btn">Browse All Entries</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BOTTOM ORNAMENT
      ══════════════════════════════════════════════ */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 0 4rem',
        color: 'var(--gold-dim)',
        fontSize: '0.8rem',
        letterSpacing: '0.3em',
        fontFamily: "'Cinzel', serif",
      }}>
        ✦ &nbsp; ✦ &nbsp; ✦
      </div>
    </>
  )
}
