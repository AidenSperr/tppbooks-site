import { getLoreEntryWithHtml, getAllLoreEntries } from '@/lib/lore'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// ── Static params ────────────────────────────────────────

export async function generateStaticParams() {
  const entries = getAllLoreEntries()
  return entries.map((e) => ({
    category: e.category,
    slug: e.slug,
  }))
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

// ── Infobox field definitions per category ───────────────

function getInfoboxFields(
  category: string,
  fm: Record<string, unknown>
): { label: string; value: string }[] {
  const fields: { label: string; value: string }[] = []
  const add = (label: string, key: string) => {
    if (fm[key]) fields.push({ label, value: String(fm[key]) })
  }

  // Fields present on all types
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
  }

  return fields
}

// ── Page ─────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ category: string; slug: string }>
}

export default async function LoreEntryPage({ params }: PageProps) {
  const { category, slug } = await params
  const entry = await getLoreEntryWithHtml(category, slug)

  if (!entry)
    notFound()

  const { frontmatter, content } = entry
  const infoFields = getInfoboxFields(category, frontmatter as unknown as Record<string, unknown>)
  const categoryLabel = CATEGORY_LABELS[category] ?? category
  const tags: string[] = Array.isArray(frontmatter.tags) ? frontmatter.tags : []

  return (
    <div className="page-container" style={{ paddingBottom: '5rem' }}>

      {/* ── Breadcrumb ────────────────────────────────── */}
      <nav
        style={{
          paddingTop: '1.5rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          display: 'flex',
          gap: '0.5rem',
          color: 'var(--cream-muted)',
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.06em',
        }}
      >
        <Link href="/lore" style={{ color: 'var(--cream-muted)' }}>
          Lore
        </Link>
        <span>›</span>
        <span style={{ color: 'var(--gold-dim)' }}>{categoryLabel}</span>
        <span>›</span>
        <span style={{ color: 'var(--cream-dim)' }}>{frontmatter.title}</span>
      </nav>

      {/* ── Layout ───────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr min(300px, 30%)',
          gap: '2.5rem',
          alignItems: 'start',
        }}
        className="lore-layout"
      >
        {/* ── Main content ─────────────────────────── */}
        <article>
          {/* Header */}
          <header style={{ marginBottom: '2rem' }}>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold-dim)',
                marginBottom: '0.5rem',
              }}
            >
              {categoryLabel}
            </p>

            <h1 style={{ marginBottom: '0.25rem' }}>{frontmatter.title}</h1>

            {frontmatter.pronunciation && (
              <p
                style={{
                  fontStyle: 'italic',
                  color: 'var(--cream-muted)',
                  fontSize: '1rem',
                  marginBottom: '0.75rem',
                }}
              >
                {frontmatter.pronunciation}
              </p>
            )}

            {/* Spoiler badge + tags row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {frontmatter.spoilerFree ? (
                <span className="safe-badge">✓ Spoiler Free</span>
              ) : (
                <span className="spoiler-badge">⚠ Contains Spoilers</span>
              )}
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Gold divider */}
          <div className="gold-divider">
            <span className="gold-divider-icon">✦</span>
          </div>

          {/* Prose content */}
          <div
            className="lore-prose"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>

        {/* ── Sidebar infobox ───────────────────────── */}
        {infoFields.length > 0 && (
          <aside>
            <div className="infobox">
              <div className="infobox-title">{frontmatter.title}</div>
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

      {/* ── Back link ─────────────────────────────────── */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <Link
          href="/lore"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--gold-dim)',
          }}
        >
          ← Back to Compendium
        </Link>
      </div>

      {/* Responsive style for the two-column grid */}
      <style>{`
        @media (max-width: 720px) {
          .lore-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}