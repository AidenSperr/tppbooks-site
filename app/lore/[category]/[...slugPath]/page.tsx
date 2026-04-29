import { getLoreEntryWithHtml, getLoreChildren, getAllLoreEntries } from '@/lib/lore'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

// ── Static params ────────────────────────────────────────

export async function generateStaticParams() {
  const entries = getAllLoreEntries()
  const contentDir = path.join(process.cwd(), 'content')
  const params: { category: string; slugPath: string[] }[] = []

  // Add all entry (leaf) paths
  for (const e of entries) {
    params.push({ category: e.category, slugPath: e.slugPath })
  }

  // Add all subcategory (directory) paths
  function addDirPaths(dir: string, category: string, relParts: string[]) {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (fs.statSync(full).isDirectory()) {
        const parts = [...relParts, entry]
        params.push({ category, slugPath: parts })
        addDirPaths(full, category, parts)
      }
    }
  }

  for (const category of fs.readdirSync(contentDir)) {
    const catPath = path.join(contentDir, category)
    if (fs.statSync(catPath).isDirectory()) {
      addDirPaths(catPath, category, [])
    }
  }

  return params
}

// ── Category display names ───────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
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

/** Convert a kebab-case folder name to a display label. */
function folderLabel(name: string): string {
  return CATEGORY_LABELS[name] ?? name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Infobox field definitions per category ───────────────

function getInfoboxFields(
  category: string,
  fm: Record<string, unknown>
): { label: string; value: string }[] {
  const fields: { label: string; value: string }[] = []
  const add = (label: string, key: string) => {
    const val = fm[key]
    if (!val) return
    const str = Array.isArray(val) ? val.join(', ') : String(val)
    // Strip Obsidian wikilinks from infobox values
    fields.push({ label, value: str.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, t, a) => a || t) })
  }

  add('Series', 'series')
  add('Type', 'type')

  switch (category) {
    case 'people-of-importance':
    case 'other-people':
      add('Race', 'race')
      add('Ethnicity', 'ethnicity')
      add('Nation', 'nation')
      add('Affiliation', 'affiliation')
      add('Elements', 'elements')
      break
    case 'holy-beings':
    case 'unholy-beings':
      add('Tier', 'tier')
      add('Element', 'element')
      add('Parent', 'parent')
      break
    case 'elements':
      add('Deity', 'deity')
      break
    case 'nations':
      add('Ruler', 'ruler')
      add('Primary Race', 'primaryRace')
      add('Region', 'region')
      break
    case 'cities':
      add('Nation', 'nation')
      add('Region', 'region')
      break
    case 'regions':
      add('Nation', 'nation')
      break
  }

  return fields
}

// ── Page ─────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ category: string; slugPath: string[] }>
}

export default async function LoreCatchAllPage({ params }: PageProps) {
  const { category, slugPath } = await params
  const categoryLabel = folderLabel(category)

  // ── Check if this path points to a directory (index page) ──
  const contentDir = path.join(process.cwd(), 'content')
  const targetPath = path.join(contentDir, category, ...slugPath)
  const isDirectory = fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()

  if (isDirectory) {
    // ── Subcategory index page ─────────────────────────────
    const { dirs, files } = getLoreChildren(category, slugPath)

    // Build breadcrumb segments
    const breadcrumbs: { label: string; href: string }[] = [
      { label: 'Lore', href: '/lore' },
      { label: categoryLabel, href: `/lore/${category}` },
    ]
    for (let i = 0; i < slugPath.length; i++) {
      breadcrumbs.push({
        label: folderLabel(slugPath[i]),
        href: `/lore/${category}/${slugPath.slice(0, i + 1).join('/')}`,
      })
    }
    const currentLabel = breadcrumbs[breadcrumbs.length - 1].label

    const sortedFiles = [...files].sort((a, b) => a.title.localeCompare(b.title))
    const sortedDirs = [...dirs].sort()

    return (
      <div className="page-container" style={{ paddingBottom: '5rem' }}>

        {/* Breadcrumb */}
        <nav className="fade-up d1" style={{ paddingTop: '1.5rem', marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', color: 'var(--cream-muted)', fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}>
          {breadcrumbs.slice(0, -1).map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href={crumb.href} style={{ color: 'var(--cream-muted)', fontWeight: 600 }}>{crumb.label}</Link>
              <span style={{ fontWeight: 600 }}>›</span>
            </span>
          ))}
          <span style={{ color: 'var(--gold-dim)', fontWeight: 600 }}>{currentLabel}</span>
        </nav>

        {/* Header */}
        <div className="page-header fade-up d1">
          <p className="eyebrow">{categoryLabel}</p>
          <h1 style={{ marginBottom: '0.5rem' }}>{currentLabel}</h1>
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
              {sortedDirs.map((dir) => {
                const href = `/lore/${category}/${[...slugPath, dir].join('/')}`
                return (
                  <Link key={dir} href={href} style={{ textDecoration: 'none' }}>
                    <div className="lore-card-compact">
                      <div className="card-title">{folderLabel(dir)}</div>
                      <div className="card-meta">Browse entries</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Files */}
        {sortedFiles.length > 0 && (
          <section className="fade-up d3" style={{ marginBottom: '3rem' }}>
            {sortedDirs.length > 0 && (
              <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                Entries
              </h2>
            )}
            <div className="lore-grid">
              {sortedFiles.map((entry) => {
                const href = `/lore/${category}/${entry.slugPath.join('/')}`
                return (
                  <Link key={entry.slug} href={href} style={{ textDecoration: 'none' }}>
                    <div className="lore-card-compact">
                      <div className="card-title">{entry.title}</div>
                      <div className="card-meta">{entry.frontmatter.type ?? ''}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {sortedDirs.length === 0 && sortedFiles.length === 0 && (
          <p style={{ color: 'var(--cream-muted)', textAlign: 'center', marginTop: '4rem', fontWeight: 600 }}>
            No entries found in this section.
          </p>
        )}

        {/* Back link */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <Link href={breadcrumbs[breadcrumbs.length - 2].href} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-dim)' }}>
            ← Back to {breadcrumbs[breadcrumbs.length - 2].label}
          </Link>
        </div>

      </div>
    )
  }

  // ── Leaf entry page ──────────────────────────────────────
  const entry = await getLoreEntryWithHtml(category, slugPath)
  if (!entry) notFound()

  const { frontmatter, content, title } = entry
  const infoFields = getInfoboxFields(category, frontmatter as unknown as Record<string, unknown>)
  const tags: string[] = Array.isArray(frontmatter.tags) ? frontmatter.tags : []

  // Build breadcrumb
  const breadcrumbs: { label: string; href: string }[] = [
    { label: 'Lore', href: '/lore' },
    { label: categoryLabel, href: `/lore/${category}` },
  ]
  for (let i = 0; i < slugPath.length - 1; i++) {
    breadcrumbs.push({
      label: folderLabel(slugPath[i]),
      href: `/lore/${category}/${slugPath.slice(0, i + 1).join('/')}`,
    })
  }

  return (
    <div className="page-container" style={{ paddingBottom: '5rem' }}>

      {/* Breadcrumb */}
      <nav className="fade-up d1" style={{ paddingTop: '1.5rem', marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', color: 'var(--cream-muted)', fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link href={crumb.href} style={{ color: 'var(--cream-muted)', fontWeight: 600 }}>{crumb.label}</Link>
            <span style={{ fontWeight: 600 }}>›</span>
          </span>
        ))}
        <span style={{ color: 'var(--cream-dim)', fontWeight: 600 }}>{title}</span>
      </nav>

      {/* Layout */}
      <div
        className="lore-layout fade-up d2"
        style={{ display: 'grid', gridTemplateColumns: '1fr min(300px, 30%)', gap: '2.5rem', alignItems: 'start' }}
      >
        {/* Main content */}
        <article>
          <header style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.5rem' }}>
              {categoryLabel}
            </p>
            <h1 style={{ marginBottom: '0.25rem' }}>{title}</h1>
            {frontmatter.pronunciation && (
              <p style={{ fontStyle: 'italic', color: 'var(--cream-muted)', fontSize: '1rem', marginBottom: '0.75rem' }}>
                {frontmatter.pronunciation}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
              {frontmatter.spoilerFree ? (
                <span className="safe-badge">✓ Spoiler Free</span>
              ) : (
                <span className="spoiler-badge">⚠ Contains Spoilers</span>
              )}
              {tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </header>

          <div className="gold-divider">
            <span className="gold-divider-icon">✦</span>
          </div>

          <div className="lore-prose" dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* Sidebar infobox */}
        {infoFields.length > 0 && (
          <aside>
            <div className="infobox">
              <div className="infobox-title">{title}</div>
              {infoFields.map(({ label, value }) => (
                <div key={label} className="infobox-row">
                  <span className="label">{label}</span>
                  <span className="value">{value}</span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Back link */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <Link
          href={slugPath.length > 1 ? `/lore/${category}/${slugPath.slice(0, -1).join('/')}` : `/lore/${category}`}
          style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-dim)' }}
        >
          ← Back to {slugPath.length > 1 ? folderLabel(slugPath[slugPath.length - 2]) : categoryLabel}
        </Link>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .lore-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
