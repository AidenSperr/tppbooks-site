import { getLoreEntryWithHtml, getAllLoreEntries } from '@/lib/lore'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const entries = getAllLoreEntries()
  return entries.map((entry) => ({
    category: entry.category,
    slug: entry.slug,
  }))
}

export default async function LoreEntryPage({ params }: Props) {
  const { category, slug } = await params

  const entry = await getLoreEntryWithHtml(category, slug)
  if (!entry) notFound()

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <p style={{ textTransform: 'capitalize', opacity: 0.6 }}>
        {entry.category.replace(/-/g, ' ')}
      </p>
      <h1>{entry.frontmatter.title}</h1>
      {entry.frontmatter.tags && (
        <div style={{ marginBottom: '1rem' }}>
          {entry.frontmatter.tags.map((tag) => (
            <span key={tag} style={{ marginRight: '0.5rem', opacity: 0.7 }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: entry.content }} />
    </main>
  )
}