'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// ── Types (mirrors lib/lore.ts) ──────────────────────────

interface LoreEntry {
  slug: string
  category: string
  frontmatter: {
    title: string
    type?: string
    tags?: string[]
    spoilerFree?: boolean
    pronunciation?: string
  }
}

// ── Category display names ───────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  'book-of-nasariane': 'Book of Nasariane',
  'cities': 'Cities',
  'elements': 'Elements',
  'entities': 'Entities',
  'ethnicities': 'Ethnicities',
  'events': 'Events',
  'geographic-places': 'Geographic Places',
  'holy-beings': 'Holy Beings',
  'important-objects': 'Important Objects',
  'nations': 'Nations',
  'organizations': 'Organizations',
  'other-people': 'Other People',
  'people-of-importance': 'People of Importance',
  'races': 'Races',
  'regions': 'Regions',
  'speciation': 'Speciation',
  'structures': 'Structures',
  'timelines': 'Timelines',
  'unholy-beings': 'Unholy Beings',
}

// ── Component ────────────────────────────────────────────

export default function LorePage() {
  const [entries, setEntries] = useState<LoreEntry[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  // Fetch entries from the API route (we'll create this)
  useEffect(() => {
    fetch('/api/lore')
      .then((r) => r.json())
      .then((data) => setEntries(data))
      .catch(() => setEntries([]))
  }, [])

  const categories = Array.from(new Set(entries.map((e) => e.category))).sort()

  const filtered = entries.filter((e) => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      e.frontmatter.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.frontmatter.tags ?? []).some((t) => t.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  // Group filtered entries by category
  const grouped = filtered.reduce<Record<string, LoreEntry[]>>((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = []
    acc[entry.category].push(entry)
    return acc
  }, {})

  return (
    <div className="page-container" style={{ paddingBottom: '5rem' }}>

      {/* ── Page header ───────────────────────────────── */}
      <div className="page-header">
        <p className="eyebrow">World of Nasariane</p>
        <h1 style={{ marginBottom: '0.5rem' }}>Lore Compendium</h1>
        <p style={{ maxWidth: '560px', fontSize: '1.05rem', marginBottom: 0 }}>
          An encyclopaedia of the people, places, powers, and history that shape
          the world of the Nasariane.
        </p>

        {/* Gold divider */}
        <div className="gold-divider" style={{ marginTop: '2rem' }}>
          <span className="gold-divider-icon">✦</span>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search entries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'var(--navy-mid)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            padding: '0.6rem 1rem',
            color: 'var(--cream)',
            fontFamily: "'Crimson Text', serif",
            fontSize: '1rem',
            width: '100%',
            maxWidth: '400px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold-dim)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* ── Category filter pills ──────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <button
          className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* ── Entry grid ────────────────────────────────── */}
      {Object.keys(grouped).length === 0 ? (
        <p style={{ color: 'var(--cream-muted)', textAlign: 'center', marginTop: '4rem' }}>
          No entries found.
        </p>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([cat, catEntries]) => (
            <section key={cat} style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-dim)',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '0.5rem',
                  marginBottom: '1.25rem',
                }}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1rem',
                }}
              >
                {catEntries
                  .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
                  .map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/lore/${entry.category}/${entry.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="lore-card">
                        <div className="card-title">{entry.frontmatter.title}</div>
                        {entry.frontmatter.pronunciation && (
                          <div
                            style={{
                              fontStyle: 'italic',
                              fontSize: '0.8rem',
                              color: 'var(--cream-muted)',
                              marginBottom: '0.3rem',
                            }}
                          >
                            {entry.frontmatter.pronunciation}
                          </div>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '0.5rem',
                          }}
                        >
                          <span className="card-meta">
                            {entry.frontmatter.type ?? CATEGORY_LABELS[cat]}
                          </span>
                          {entry.frontmatter.spoilerFree ? (
                            <span className="safe-badge">Spoiler Free</span>
                          ) : (
                            <span className="spoiler-badge">Spoilers</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))
      )}
    </div>
  )
}