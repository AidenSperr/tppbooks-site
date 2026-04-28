import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDirectory = path.join(process.cwd(), 'content')

export interface LoreFrontmatter {
  title?: string
  category?: string
  series?: string
  type?: string
  tags?: string[]
  spoilerFree?: boolean
  pronunciation?: string

  // People
  race?: string
  ethnicity?: string
  nation?: string
  affiliation?: string[]
  elements?: string[]

  // Elements
  deity?: string

  // Holy/Unholy Beings
  tier?: string
  element?: string
  parent?: string

  // Nations
  ruler?: string
  primaryRace?: string
  region?: string
}

export interface LoreEntry {
  /** The filename without .md (last path segment) */
  slug: string
  /** Top-level content folder, e.g. 'cities' */
  category: string
  /** Full path segments after category, e.g. ['othaala', 'akcolvathe'] */
  slugPath: string[]
  frontmatter: LoreFrontmatter
  /** Raw markdown (not processed) */
  content: string
  /** Resolved display title — frontmatter.title || first H1 || slug */
  title: string
}

// ── Helpers ─────────────────────────────────────────────

/** Extract the first # H1 from raw markdown, or fall back to slug-to-title. */
function extractTitle(content: string, slug: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) return match[1].trim()
  // Convert kebab-case slug to Title Case
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Strip Obsidian [[wikilinks]] and return plain text. */
export function stripWikilinks(text: string): string {
  return text.replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
}

// ── Recursive walker ────────────────────────────────────

/**
 * Walk a directory recursively, calling `onFile` for every .md file found.
 * `relParts` accumulates the path segments relative to `dir`.
 */
function walkDir(
  dir: string,
  relParts: string[],
  onFile: (filePath: string, relParts: string[]) => void
) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) {
      walkDir(full, [...relParts, entry], onFile)
    } else if (entry.endsWith('.md')) {
      onFile(full, [...relParts, entry.replace(/\.md$/, '')])
    }
  }
}

// ── Public API ───────────────────────────────────────────

/**
 * Returns every lore entry across all categories and subcategories.
 * Entries in flat categories have slugPath = [slug].
 * Entries in subcategories have slugPath = ['subcategory', ..., 'slug'].
 */
export function getAllLoreEntries(): LoreEntry[] {
  const entries: LoreEntry[] = []

  for (const category of fs.readdirSync(contentDirectory)) {
    const categoryPath = path.join(contentDirectory, category)
    if (!fs.statSync(categoryPath).isDirectory()) continue

    walkDir(categoryPath, [], (filePath, relParts) => {
      const slug = relParts[relParts.length - 1]
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const fm = data as LoreFrontmatter
      const title = fm.title || extractTitle(content, slug)

      entries.push({
        slug,
        category,
        slugPath: relParts,
        frontmatter: fm,
        content,
        title,
      })
    })
  }

  return entries
}

/**
 * Get a single lore entry by category + slugPath array.
 * e.g. getLoreEntryByPath('cities', ['othaala', 'akcolvathe'])
 */
export function getLoreEntryByPath(
  category: string,
  slugPath: string[]
): LoreEntry | null {
  const filePath = path.join(contentDirectory, category, ...slugPath) + '.md'
  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const fm = data as LoreFrontmatter
  const slug = slugPath[slugPath.length - 1]
  const title = fm.title || extractTitle(content, slug)

  return {
    slug,
    category,
    slugPath,
    frontmatter: fm,
    content,
    title,
  }
}

export async function getLoreEntryWithHtml(
  category: string,
  slugPath: string[]
): Promise<LoreEntry | null> {
  const entry = getLoreEntryByPath(category, slugPath)
  if (!entry) return null

  // Strip Obsidian wikilinks before rendering
  const cleaned = entry.content.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_, target, alias) => alias || target
  )
  const processed = await remark().use(html).process(cleaned)

  return { ...entry, content: processed.toString() }
}

/**
 * List the direct children of a given path segment.
 * Returns { dirs: string[], files: LoreEntry[] }
 * Used to build category/subcategory index pages.
 */
export function getLoreChildren(
  category: string,
  subPath: string[] = []
): { dirs: string[]; files: LoreEntry[] } {
  const dirPath = path.join(contentDirectory, category, ...subPath)
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return { dirs: [], files: [] }
  }

  const dirs: string[] = []
  const files: LoreEntry[] = []

  for (const entry of fs.readdirSync(dirPath)) {
    const full = path.join(dirPath, entry)
    if (fs.statSync(full).isDirectory()) {
      dirs.push(entry)
    } else if (entry.endsWith('.md')) {
      const slug = entry.replace(/\.md$/, '')
      const slugPath = [...subPath, slug]
      const fileContents = fs.readFileSync(full, 'utf8')
      const { data, content } = matter(fileContents)
      const fm = data as LoreFrontmatter
      const title = fm.title || extractTitle(content, slug)
      files.push({ slug, category, slugPath, frontmatter: fm, content, title })
    }
  }

  return { dirs, files }
}