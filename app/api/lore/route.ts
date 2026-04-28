import { NextResponse } from 'next/server'
import { getAllLoreEntries } from '@/lib/lore'

export async function GET() {
  const entries = getAllLoreEntries()
  // Strip raw content from the API response — only send metadata
  const lightweight = entries.map(({ content: _content, ...rest }) => rest)
  return NextResponse.json(lightweight)
}