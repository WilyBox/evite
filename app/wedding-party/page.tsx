import { loadInvites } from '@/lib/invites'
import { notFound } from 'next/navigation'

type Props = {
  searchParams: Promise<{
    partyId?: string
  }>
}


const accommodationMap = {
  day1: {
    'Jaine MacLean': 'Willow Cottage',
    'Paul MacLean': 'Willow Cottage',
    'Eamon Doohan': 'Willow Cottage',
    'Eileen Doohan': 'Willow Cottage',
    'David Riley': 'Willow Cottage',
    'Lynn Riley': 'Willow Cottage',
    'Hashim Rafiq': 'Birch Cottage',
    'Hugh Doohan': 'Birch Cottage',
    'Jack Duddy': 'Birch Cottage',
    'Stephanie Duddy': 'Birch Cottage',
    'Calum MacLean': 'Birch Cottage',
    'John-Paul Doohan': 'Laurel Cottage',
    'Una McConnellogue': 'Laurel Cottage',
    'Aoife Doohan': 'Laurel Cottage',
    'Freya': 'Laurel Cottage',
    'Kevin Harkin': 'Laurel Cottage',
    'Sara Harkin': 'Laurel Cottage',
    'Victoria Cowan': 'Seaview House',
    'Tobryn': 'Seaview House',
    'Eoghann Robinson': 'Seaview House',
    'Lukasz Lesnik': 'Seaview House',
    'Maebh Baker': 'Seaview House',
    'Gavin Baker': 'Seaview House',
    'Christopher Sweeney': 'Seaview House',
    'Roisin Sweeney': 'Seaview House',
  },
  day2: {
    'Jaine MacLean': 'Willow Cottage',
    'Paul MacLean': 'Willow Cottage',
    'Eamon Doohan': 'Willow Cottage',
    'Eileen Doohan': 'Willow Cottage',
    'David Riley': 'Willow Cottage',
    'Lynn Riley': 'Willow Cottage',
    'Hashim Rafiq': 'Birch Cottage',
    'Hugh Doohan': 'Birch Cottage',
    'Jack Duddy': 'Birch Cottage',
    'Stephanie Duddy': 'Birch Cottage',
    'Calum MacLean': 'Birch Cottage',
    'Victoria Cowan': 'Birch Cottage',
    'John-Paul Doohan': 'Laurel Cottage',
    'Una McConnellogue': 'Laurel Cottage',
    'Aoife Doohan': 'Laurel Cottage',
    'Freya': 'Laurel Cottage',
    'Kevin Harkin': 'Laurel Cottage',
    'Sara Harkin': 'Laurel Cottage',
    'Tobryn': 'Seaview House',
    'Eoghann Robinson': 'Seaview House',
    'Lukasz Lesnik': 'Seaview House',
    'Maebh Baker': 'Seaview House',
    'Gavin Baker': 'Seaview House',
    'Christopher Sweeney': 'Seaview House',
    'Roisin Sweeney': 'Seaview House',
    'Aleks': 'Seaview House',
  },
} as const


function normaliseKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function buildLookup(map: Record<string, string>) {
  const lookup: Record<string, string> = {}

  for (const [key, value] of Object.entries(map)) {
    lookup[normaliseKey(key)] = value
  }

  return lookup
}


const day1Lookup = buildLookup(accommodationMap.day1)
const day2Lookup = buildLookup(accommodationMap.day2)


export default async function WeddingPartyPage({ searchParams }: Props) {
  const { partyId } = await searchParams

  if (!partyId) {
    notFound()
  }

  const invites = await loadInvites()
  const party = invites.find((p) => p.partyId === partyId)

  if (!party || !party.weddingParty) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-stone-900">
        Wedding Party
      </h1>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-stone-900">Guests</h2>

        <ul className="mt-4 space-y-4">
          {party.guests.map((guest) => {
            const key = normaliseKey(guest)

            const day1House = day1Lookup[key] ?? 'TBC'
            const day2House = day2Lookup[key] ?? 'TBC'

            return (
              <li key={guest} className="rounded-xl border border-stone-200 p-4">
                <p className="font-medium text-stone-900">{guest}</p>
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-medium">Day 1:</span> {day1House}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Day 2:</span> {day2House}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}