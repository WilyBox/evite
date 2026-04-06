import { NextResponse } from 'next/server'
import { loadInvites, findPartyByName } from '@/lib/invites'

export async function POST(req: Request) {
  try {
    const { name } = (await req.json()) as { name?: string }

    if (!name?.trim()) {
      return NextResponse.json({ found: false })
    }

    const invites = await loadInvites()
    const party = findPartyByName(invites, name)

    if (!party) {
      return NextResponse.json({ found: false })
    }

    return NextResponse.json({
      found: true,
      partyId: party.partyId,
      guests: party.guests,
    })
  } catch (error) {
    console.error('Party lookup error:', error)
    return NextResponse.json({ found: false }, { status: 500 })
  }
}