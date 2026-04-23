import { NextResponse } from 'next/server'
import { getAllLoreEntries } from '@/lib/lore'

export async function GET() {
  const entries = getAllLoreEntries()
  return NextResponse.json(entries)
}