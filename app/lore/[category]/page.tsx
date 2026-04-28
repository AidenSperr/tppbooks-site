import { getLoreChildren } from '@/lib/lore'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

// ── Static params ────────────────────────────────────────

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content')
  return fs
    .readdirSync(contentDir)
    .filter((d) => fs.statSync(path.join(contentDir, d)).isDirectory())
    .map((category) => ({ category }))
}

// ── Helpers ──────────────────────────────────────────────

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
  'miscellaneous': 'Miscellaneous',
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

function folderLabel(name: string): string {
  return CATEGORY_LABELS[name] ?? name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Page ─────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryIndexPage({ params }: PageProps) {
  const { category } = await params
  const contentDir = path.join(process.cwd(), 'content')
  const catPath = path.join(contentDir, category)

  if (!fs.existsSync(catPath)) notFound()

  const categoryLabel = folderLabel(category)
  const { dirs, files } = getLoreChildren(category)

  const sortedFiles = [...files].sort((a, b) => a.title.localeCompare(b.title))
  const sortedDirs = [...dirs].sort()

  return (
    <div className="page-container" style={{ paddingBottom: '5rem' }}>

      {/* Breadcrumb */}
      <nav className="fade-up d1" style={{ paddingTop: '1.5rem', marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', color: 'var(--cream-muted)', fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}>
        <Link href="/lore" style={{ color: 'var(--cream-muted)' }}>Lore</Link>
        <span>›</span>
        <span style={{ color: 'var(--gold-dim)' }}>{categoryLabel}</span>
      </nav>

      {/* Header */}
      <div className="page-header fade-up d1">
        <p className="eyebrow">Lore Compendium</p>
        <h1 style={{ marginBottom: '0.5rem' }}>{categoryLabel}</h1>
        <div className="gold-divider" style={{ marginTop: '1.5rem' }}>
          <span className="gold-divider-icon">✦</span>
        </div>
      </div>

      {/* Sub-directories */}
      {sortedDirs.length > 0 && (
        <section className="fade-up d2" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            Subcategories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.65rem' }}>
            {sortedDirs.map((dir) => (
              <Link key={dir} href={`/lore/${category}/${dir}`} style={{ textDecoration: 'none' }}>
                <div className="lore-card-compact">
                  <div className="card-title">{folderLabel(dir)}</div>
                  <div className="card-meta">Browse entries</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Direct entries */}
      {sortedFiles.length > 0 && (
        <section className="fade-up d3" style={{ marginBottom: '3rem' }}>
          {sortedDirs.length > 0 && (
            <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              Entries
            </h2>
          )}
          <div className="lore-grid">
            {sortedFiles.map((entry) => (
              <Link key={entry.slug} href={`/lore/${category}/${entry.slugPath.join('/')}`} style={{ textDecoration: 'none' }}>
                <div className="lore-card-compact">
                  <div className="card-title">{entry.title}</div>
                  <div className="card-meta">{entry.frontmatter.type ?? ''}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sortedDirs.length === 0 && sortedFiles.length === 0 && (
        <p style={{ color: 'var(--cream-muted)', textAlign: 'center', marginTop: '4rem' }}>
          No entries found in this category.
        </p>
      )}

      {/* Back to compendium */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <Link href="/lore" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-dim)' }}>
          ← Back to Compendium
        </Link>
      </div>

    </div>
  )
}
