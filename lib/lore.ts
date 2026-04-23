import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'content')

export interface LoreFrontmatter {
  title: string
  category: string
  series?: string
  tags?: string[]
  spoilerFree?: boolean
}

export interface LoreEntry {
  slug: string
  category: string
  frontmatter: LoreFrontmatter
  content: string
}

export function getAllLoreEntries(): LoreEntry[] {
  const entries: LoreEntry[] = []

  const categories = fs.readdirSync(contentDirectory)

  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category)
    if (!fs.statSync(categoryPath).isDirectory()) continue

    const files = fs.readdirSync(categoryPath)

    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const slug = file.replace(/\.md$/, '')
      const filePath = path.join(categoryPath, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      entries.push({
        slug,
        category,
        frontmatter: data as LoreFrontmatter,
        content,
      })
    }
  }

  return entries
}

export function getLoreEntry(category: string, slug: string): LoreEntry | null {
  const filePath = path.join(contentDirectory, category, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    category,
    frontmatter: data as LoreFrontmatter,
    content,
  }
}

export async function getLoreEntryWithHtml(category: string, slug: string): Promise<LoreEntry | null> {
  const entry = getLoreEntry(category, slug)
  if (!entry) return null

  const processed = await remark().use(html).process(entry.content)

  return {
    ...entry,
    content: processed.toString(),
  }
}