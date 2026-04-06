import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

function normaliseName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

async function loadPlusOneNames() {
  const filePath = path.join(process.cwd(), 'data', 'plus-ones.txt')
  const file = await readFile(filePath, 'utf8')

  return new Set(
    file
      .split(/\r?\n/)
      .map((line) => normaliseName(line))
      .filter(Boolean)
  )
}

export async function POST(req: Request) {
  try {
    const { name } = (await req.json()) as { name?: string }

    if (!name?.trim()) {
      return NextResponse.json({ hasPlusOne: false })
    }

    const plusOneNames = await loadPlusOneNames()
    const hasPlusOne = plusOneNames.has(normaliseName(name))

    return NextResponse.json({ hasPlusOne })
  } catch (error) {
    console.error('Plus-one check error:', error)
    return NextResponse.json(
      { error: 'Failed to check plus-one status.' },
      { status: 500 }
    )
  }
}