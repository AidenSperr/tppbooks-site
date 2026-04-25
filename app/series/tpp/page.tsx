import Link from 'next/link'

const BOOKS = [
  {
    number: 'I',
    title: 'Two Elven Sojourners',
    seriesTitle: 'The Polaenian Prophecies',
    status: 'available',
    amazonUrl: 'https://www.amazon.com/dp/B0F3B9JSBF',
    spineColor: '#1a1a2e',
    accentColor: '#d4af6a',
    borderColor: 'rgba(212,175,106,0.45)',
    tagline: 'The prophecy begins with two unlikely sojourners.',
    synopsis: `Within the lands of Alatryan continent, there existed ten Gems, forged by the holy powers known as the Eleven. These Gems allowed the mortal beings of Alatrya to use the ten elements, catalysts with unlimited mana and power, brought into the world with the intention to be used for good and prosperity.

    But when a powerful Demon named Huolong discovered information about the Gem of Kashtet, the God of Fire, he desired its infinite strength for himself. When he finally discovered the Gem with the help of the Dragonkinnian sailor, Vakviva Evvuniav, he stole it from the rightful place in the land, absorbing its might.

    With his newfound Flame, he became a leader of the Demonic country of Huozhi, using the ruling King and Queen as puppets for his own gain.

    Taking notice of the turmoil, the Eleven thought with one another to come up with a strategy to ensure peace once more in Alatrya. Using Vakviva and her newfound guild, the Cavant A-Meftua, they put together a plan to give the nine remaining Gems to worthy recipients, those who they believed would use their magic for holy purposes, and gather them in the Lively City, Kaedoa.

    The first to arrive, those wielding Shadow and Wind, were two of Elvish descent, known as Anue Beidaka and Chuntian Zhenfung. The Polaenian Prophecies: Two Elven Sojourners follows these Gemwielders on their travels to Kaedoa, encountering legendary beasts, arduous landscapes, and many of those who seek to either assist to hinder their quest to defeat Huolong and bring peace back to Alatrya and the planet Nasariane.`,

    details: [
      { label: 'Published', value: '2025' },
      { label: 'Words', value: '~91617' },
      { label: 'Genre', value: 'Epic Fantasy' },
      { label: 'Setting', value: 'Alatrya, Nasariane' },
    ],
  },
  {
    number: 'II',
    title: 'Daughter of Ruin',
    seriesTitle: 'The Polaenian Prophecies',
    status: 'upcoming',
    amazonUrl: null,
    spineColor: '#2a0a0a',
    accentColor: '#c44040',
    borderColor: 'rgba(196,64,64,0.45)',
    tagline: 'The continent burns, and the prophecies spell great change.',
    synopsis: `The second volume of The Polaenian Prophecies. Details forthcoming.`,
    details: [
      { label: 'Status', value: 'In Progress' },
      { label: 'Genre', value: 'Epic Fantasy' },
      { label: 'Setting', value: 'Alatrya, Nasariane' },
    ],
  },
  {
    number: 'III',
    title: 'A New Era',
    seriesTitle: 'The Polaenian Prophecies',
    status: 'upcoming',
    amazonUrl: null,
    spineColor: '#0a1a0a',
    accentColor: '#4a8a4a',
    borderColor: 'rgba(74,138,74,0.45)',
    tagline: 'What survives the prophecy must become something new.',
    synopsis: `The final volume of The Polaenian Prophecies. Details forthcoming.`,
    details: [
      { label: 'Status', value: 'In Progress' },
      { label: 'Genre', value: 'Epic Fantasy' },
      { label: 'Setting', value: 'Alatrya, Nasariane' },
    ],
  },
]

export default function TPPSeriesPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.25s; }

        .buy-btn {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 0.72rem;
          font-weight: bold;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.7rem 1.75rem;
          border: 1px solid var(--gold-mid);
          color: var(--navy-deepest);
          background: var(--gold-mid);
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .buy-btn:hover { background: var(--gold-bright); }

        .book-card {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 2.5rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--border);
          align-items: start;
        }
        .book-card:last-child { border-bottom: none; }

        @media (max-width: 640px) {
          .book-card { grid-template-columns: 1fr; gap: 1.5rem; }
        }

        .book-spine-tall {
          width: 140px;
          height: 210px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 0.9rem;
          box-shadow: 4px 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
          transition: transform 0.25s ease;
        }
        .book-spine-tall:hover { transform: translateY(-4px); }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.75rem;
          margin-top: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .detail-item .dl {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--cream-muted);
          margin-bottom: 0.2rem;
        }
        .detail-item .dv { font-size: 0.9rem; color: var(--cream-dim); }

        .ghost-link {
          font-family: 'Cinzel', serif;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.7rem 1.75rem;
          border: 1px solid rgba(212,175,106,0.3);
          color: var(--cream-muted);
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }
        .ghost-link:hover { border-color: var(--gold-mid); color: var(--gold-mid); }
      `}</style>

      <div className="page-container" style={{ paddingBottom: '5rem' }}>

        {/* ── Page header ── */}
        <div className="page-header fade-up d1">
          <p className="eyebrow">Series</p>
          <h1 style={{ marginBottom: '0.5rem' }}>The Polaenian Prophecies</h1>
          <p style={{ maxWidth: '580px', fontSize: '1.05rem', marginBottom: 0 }}>
            An epic fantasy trilogy set on the supercontinent of Alatrya — a world
            of elemental magic, warring nations, ancient gods, and the prophecy
            that binds them all together.
          </p>
          <div className="gold-divider" style={{ marginTop: '2rem' }}>
            <span className="gold-divider-icon">✦</span>
          </div>
        </div>

        {/* ── Foreword pull quote ── */}
        <div
          className="fade-up d2"
          style={{
            background: 'var(--navy-mid)',
            border: '1px solid var(--border)',
            borderLeft: '2px solid var(--gold-dim)',
            padding: '1.5rem 2rem',
            marginBottom: '3.5rem',
            maxWidth: '740px',
          }}
        >
          <p style={{ fontStyle: 'italic', fontSize: '1rem', color: 'var(--cream-muted)', margin: 0, lineHeight: 1.8 }}>
            &ldquo;The One wrote to the people of this world who have ears to listen
            that the grace she provides would ultimately prevail over all evils.&rdquo;
          </p>
          <p style={{
            fontSize: '0.75rem',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.1em',
            color: 'var(--gold-dim)',
            margin: '0.75rem 0 0',
            textTransform: 'uppercase',
          }}>
            — C.Z., foreword to Book I
          </p>
        </div>

        {/* ── Books ── */}
        <section className="fade-up d3">
          {BOOKS.map((book) => (
            <div key={book.number} className="book-card">

              {/* Spine visual */}
              <div
                className="book-spine-tall"
                style={{
                  background: book.spineColor,
                  border: `1px solid ${book.borderColor}`,
                  borderTop: `3px solid ${book.accentColor}`,
                  opacity: book.status === 'available' ? 1 : 0.65,
                }}
              >
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: book.accentColor,
                  opacity: 0.8,
                }}>
                  BOOK {book.number}
                </span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.72rem',
                    color: book.accentColor,
                    lineHeight: 1.5,
                    letterSpacing: '0.04em',
                    marginBottom: '0.5rem',
                  }}>
                    {book.title}
                  </div>
                  <div style={{ width: '20px', height: '1px', background: book.accentColor, margin: '0 auto', opacity: 0.4 }} />
                </div>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.5rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: book.status === 'available' ? book.accentColor : 'rgba(255,255,255,0.2)',
                }}>
                  {book.status === 'available' ? 'Available' : 'Coming Soon'}
                </span>
              </div>

              {/* Content */}
              <div>
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-dim)',
                  marginBottom: '0.4rem',
                }}>
                  Book {book.number} · {book.seriesTitle}
                </p>
                <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginBottom: '0.3rem' }}>
                  {book.title}
                </h2>
                <p style={{ fontStyle: 'italic', color: 'var(--cream-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  {book.tagline}
                </p>

                {book.synopsis.split('\n\n').map((para, i) => (
                  <p key={i} style={{ fontSize: '0.97rem', lineHeight: 1.8, color: 'var(--cream-dim)', marginBottom: '0.9rem' }}>
                    {para}
                  </p>
                ))}

                <div className="detail-grid">
                  {book.details.map(d => (
                    <div key={d.label} className="detail-item">
                      <div className="dl">{d.label}</div>
                      <div className="dv">{d.value}</div>
                    </div>
                  ))}
                </div>

                {book.amazonUrl ? (
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-btn"
                  >
                    Buy on Amazon
                  </a>
                ) : (
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--cream-muted)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.1rem',
                  }}>
                    Not Yet Available
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ── Bottom CTAs ── */}
        <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold-dim)',
            marginBottom: '1.25rem',
          }}>
            Explore the World
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/lore" className="buy-btn">Lore Compendium</Link>
            <Link href="/map" className="ghost-link">World Map</Link>
          </div>
        </div>

      </div>
    </>
  )
}
