import Link from 'next/link'
import { getAllLoreEntries } from '@/lib/lore'

export default function LorePage() {
    const entries = getAllLoreEntries()

    const grouped = entries.reduce((acc, entry) => {
        if (!acc[entry.category])
            acc[entry.category] = []

        acc[entry.category].push(entry)
        return acc
    }, {} as Record<string, typeof entries>)

    return (
        <main style={{ padding: '2rem' }}>
            <h1>LoreWiki</h1>
            {Object.entries(grouped).map(([category, entries]) => (
                <section key={category} style={{ marginBottom: '2rem' }}>
                    <h2 style={{ textTransform: 'capitalize' }}>
                        {category.replace(/-/g, ' ')}
                    </h2>
                    <ul>
                        {entries.map((entry) => (
                            <li key={entry.slug}>
                                <Link href={`/lore/${entry.category}/${entry.slug}`}>
                                    {entry.frontmatter.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </main>
    )
}