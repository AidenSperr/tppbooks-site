import Link from 'next/link'

const SECTIONS = [
  {
    eyebrow: 'The Author',
    heading: 'Aiden Sperr',
    body: [
      `Aiden Sperr is a nineteen-year-old author, worldbuilder, and computer science student from Titusville, Florida. Currently a senior at the University of Central Florida, he is pursuing a bachelor's degree in Computer Science with plans to continue into a master's program at the same institution.`,
      `He has been drawn to storytelling since childhood, especially stories that feel lived-in, where the world extends far beyond the edges of the page. The Polaenian Prophecies is his first published series.`,
    ],
  },
  {
    eyebrow: 'The Origin',
    heading: 'A Coffee on Campus',
    body: [
      `The Polaenian Prophecies began on an unremarkable evening during Aiden's sophomore year, sitting in a Starbucks on the UCF campus, waiting to leave for a bible study, with a story he had always meant to write finally demanding to be started.`,
      `What began as a pure creative outlet gradually grew in volume. As the world of Nasariane grew, so did its purpose. The conflicts that shape Alatrya, and Nasariane, by extension — tyranny, faith, the silence of gods, the cost of prophecy on ordinary people — were never just fantastical concepts lost to Medieval Europe. They are reflections: of modern society, of political reality, of what it means to believe in grace and justice in a world that often offers neither.`,
      `Aiden's faith as a Christian and his convictions about democracy, equity, and the responsibilities of governance are woven into the fabric of the series. The world of Nasariane tells of stories which mirror the real world.`,
    ],
  },
  {
    eyebrow: 'The Process',
    heading: 'Writing Like Watching a Film',
    body: [
      `Aiden writes cinematically. Before a word goes to the page, scenes play out in his head like he is watching them in a theater, and the words flow from that.`,
      `Early in the series, that vision ran ahead of any real plan. Much of Book One was written on instinct, the story forming naturally, and on a whim as it went. But the world kept expanding, the threads multiplying, and eventually structure became necessary.`,
      `That structure found its home in Obsidian, which is a note-taking tool that became the backbone of the entire project. Nations, languages, elemental systems, character histories, timelines all live in a vault that has grown alongside the books themselves. The lore compendium on this site is a view into those notes.`,
    ],
  },
]

export default function AboutPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.35s; }
        .d4 { animation-delay: 0.5s; }

        .about-section {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 3rem;
          padding: 3rem 0;
          border-bottom: 1px solid var(--border);
        }
        .about-section:last-of-type { border-bottom: none; }

        @media (max-width: 680px) {
          .about-section {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        .section-label {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-dim);
          padding-top: 0.35rem;
        }

        .about-heading {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          font-weight: 600;
          color: var(--gold-mid);
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }

        .about-body p {
          font-size: 1rem;
          line-height: 1.85;
          color: var(--cream-dim);
          margin-bottom: 1rem;
        }
        .about-body p:last-child { margin-bottom: 0; }

        .pull-quote {
          border-left: 2px solid var(--gold-dim);
          padding: 0.75rem 0 0.75rem 1.5rem;
          margin: 2.5rem 0;
          font-style: italic;
          font-size: 1.1rem;
          color: var(--cream-muted);
          line-height: 1.7;
        }

        .meta-card {
          background: var(--navy-mid);
          border: 1px solid var(--border);
          border-top: 2px solid var(--gold-dim);
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1.25rem;
        }
        .meta-item .ml {
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--cream-muted);
          margin-bottom: 0.3rem;
        }
        .meta-item .mv {
          font-size: 0.95rem;
          color: var(--cream-dim);
        }
      `}</style>

      <div className="page-container" style={{ paddingBottom: '5rem' }}>

        {/* ── Page header ── */}
        <div className="page-header fade-up d1">
          <p className="eyebrow">About</p>
          <h1 style={{ marginBottom: '0.5rem' }}>The Author</h1>
          <p style={{ maxWidth: '520px', fontSize: '1.05rem', marginBottom: 0 }}>
            The person behind the world of Nasariane.
          </p>
          <div className="gold-divider" style={{ marginTop: '2rem' }}>
            <span className="gold-divider-icon">✦</span>
          </div>
        </div>

        {/* ── Quick facts card ── */}
        <div className="meta-card fade-up d2" style={{ marginBottom: '1rem' }}>
          {[
            { label: 'Name', value: 'Aiden Sperr' },
            { label: 'Based in', value: 'Titusville, Florida' },
            { label: 'Studying', value: 'Computer Science, UCF' },
            { label: 'Series', value: 'The Polaenian Prophecies' },
            { label: 'Genre', value: 'Epic Fantasy' },
            { label: 'Books Out', value: '1' },
          ].map(item => (
            <div key={item.label} className="meta-item">
              <div className="ml">{item.label}</div>
              <div className="mv">{item.value}</div>
            </div>
          ))}
        </div>

        {/* ── Main sections ── */}
        <div style={{ marginTop: '3rem' }}>
          {SECTIONS.map((section, i) => (
            <div
              key={section.eyebrow}
              className={`about-section fade-up d${i + 2}`}
            >
              <div className="section-label">{section.eyebrow}</div>
              <div>
                <div className="about-heading">{section.heading}</div>
                <div className="about-body">
                  {section.body.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pull quote ── */}
        <div className="fade-up d4" style={{ maxWidth: '680px', margin: '3rem 0' }}>
          <div className="pull-quote">
            &ldquo;As time went on, I began to dedicate some of the underlying issues
            in the books to mirror that of modern society, a reflection of the
            current state of the world through an old and fantastical lens.&rdquo;
          </div>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold-dim)',
          }}>
            — Aiden Sperr
          </p>
        </div>

        {/* ── Bottom CTAs ── */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '2.5rem',
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <Link
            href="/series/tpp"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0.7rem 1.75rem',
              border: '1px solid var(--gold-mid)',
              color: 'var(--navy-deepest)',
              background: 'var(--gold-mid)',
              textDecoration: 'none',
              transition: 'background 0.2s',
              display: 'inline-block',
            }}
          >
            Read the Series
          </Link>
          <Link
            href="/lore"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0.7rem 1.75rem',
              border: '1px solid rgba(212,175,106,0.3)',
              color: 'var(--cream-muted)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-block',
            }}
          >
            Explore the Lore
          </Link>
        </div>

      </div>
    </>
  )
}
