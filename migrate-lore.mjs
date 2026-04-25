/**
 * migrate-lore.mjs
 *
 * Copies markdown files from the Obsidian vault to the site's content directory.
 * Files are renamed to kebab-case. Content is copied verbatim.
 *
 * Usage — migrate everything:
 *   node migrate-lore.mjs
 *
 * Usage — migrate specific categories only (use site folder names):
 *   node migrate-lore.mjs nations cities people-of-importance
 */

import fs from 'fs'
import path from 'path'

// ── Config ───────────────────────────────────────────────────────────────────

const VAULT_ROOT   = 'D:\\TPPGameNotes\\MainVault\\TPP Book'
const SITE_CONTENT = 'C:\\Users\\Aiden\\Documents\\CodingProjects\\TPPBooksSite\\tppbooks-site\\content'

// ── Category definitions ──────────────────────────────────────────────────────
//
// Each entry is either:
//
//   Simple (flat folder):
//   { vault: 'Nations', site: 'nations' }
//
//   Recursive (preserve subfolders):
//   { vault: 'Cities', site: 'cities', recursive: true }
//
//   Custom sources (specific vault paths flattened into one site folder):
//   { site: 'book-of-nasariane', sources: ['Book of Nasariane/Notes', 'Book of Nasariane/Notes/Books'] }

const CATEGORIES = [
  // Flat folders
  { vault: 'Elements',             site: 'elements' },
  { vault: 'Entities',             site: 'entities' },
  { vault: 'Events',               site: 'events' },
  { vault: 'Holy Beings',          site: 'holy-beings' },
  { vault: 'Important Objects',    site: 'important-objects' },
  { vault: 'Miscellaneous',        site: 'miscellaneous' },
  { vault: 'Nations',              site: 'nations' },
  { vault: 'Organizations',        site: 'organizations' },
  { vault: 'Other People',         site: 'other-people' },
  { vault: 'People of Importance', site: 'people-of-importance' },
  { vault: 'Races',                site: 'races' },
  { vault: 'Speciation',           site: 'speciation' },
  { vault: 'Structures',           site: 'structures' },
  { vault: 'Timelines',            site: 'timelines' },
  { vault: 'Unholy Beings',        site: 'unholy-beings' },

  // Recursive — subfolders are preserved as subcategories
  { vault: 'Cities',              site: 'cities',            recursive: true },
  { vault: 'Ethnicities',         site: 'ethnicities',       recursive: true },
  { vault: 'Geographic Places',   site: 'geographic-places', recursive: true },
  { vault: 'Regions',             site: 'regions',           recursive: true },

  // Custom — specific vault paths flattened into one site folder
  {
    site: 'book-of-nasariane',
    sources: [
      'Book of Nasariane\\Notes',
      'Book of Nasariane\\Notes\\Books',
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function toKebabCase(filename) {
  return filename
    .replace(/\.md$/, '')           // strip extension
    .toLowerCase()
    .replace(/[''']/g, '')          // strip apostrophes
    .replace(/[^a-z0-9]+/g, '-')   // non-alphanumeric runs → hyphens
    .replace(/^-+|-+$/g, '')        // trim leading/trailing hyphens
    + '.md'
}

/**
 * Copy all .md files from srcDir into destDir (non-recursive).
 * Returns the number of files copied.
 */
function copyMdFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`   ⚠  Source not found, skipping: ${srcDir}`)
    return 0
  }

  fs.mkdirSync(destDir, { recursive: true })

  const files = fs.readdirSync(srcDir).filter(f =>
    f.endsWith('.md') && fs.statSync(path.join(srcDir, f)).isFile()
  )

  let count = 0
  for (const file of files) {
    const destName = toKebabCase(file)
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, destName))
    console.log(`   ✓  ${file} → ${destName}`)
    count++
  }
  return count
}

/**
 * Recursively copy .md files from srcDir into destDir,
 * mirroring the subfolder structure (subfolders also kebab-cased).
 * Returns the number of files copied.
 */
function copyMdFilesRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`   ⚠  Source not found, skipping: ${srcDir}`)
    return 0
  }

  fs.mkdirSync(destDir, { recursive: true })

  let count = 0
  for (const entry of fs.readdirSync(srcDir)) {
    const srcEntry  = path.join(srcDir, entry)
    const stat      = fs.statSync(srcEntry)

    if (stat.isDirectory()) {
      const subDestDir = path.join(destDir, toKebabCase(entry + '.md').replace(/\.md$/, ''))
      console.log(`   📁  ${entry}/`)
      count += copyMdFilesRecursive(srcEntry, subDestDir)
    } else if (entry.endsWith('.md')) {
      const destName = toKebabCase(entry)
      fs.copyFileSync(srcEntry, path.join(destDir, destName))
      console.log(`   ✓  ${entry} → ${destName}`)
      count++
    }
  }
  return count
}

// ── Main ─────────────────────────────────────────────────────────────────────

const targetCategories = process.argv.slice(2)

let totalCopied = 0

for (const cat of CATEGORIES) {
  if (targetCategories.length > 0 && !targetCategories.includes(cat.site)) {
    continue
  }

  const destDir = path.join(SITE_CONTENT, cat.site)

  // Custom multi-source (flat)
  if (cat.sources) {
    console.log(`\n📂  [custom] → content/${cat.site}`)
    for (const src of cat.sources) {
      const srcDir = path.join(VAULT_ROOT, src)
      console.log(`   from: ${src}`)
      totalCopied += copyMdFiles(srcDir, destDir)
    }
    continue
  }

  const srcDir = path.join(VAULT_ROOT, cat.vault)
  console.log(`\n📂  ${cat.vault} → content/${cat.site}${cat.recursive ? ' (recursive)' : ''}`)

  if (cat.recursive) {
    totalCopied += copyMdFilesRecursive(srcDir, destDir)
  } else {
    totalCopied += copyMdFiles(srcDir, destDir)
  }
}

console.log(`\n✅  Done — ${totalCopied} file(s) copied.`)
