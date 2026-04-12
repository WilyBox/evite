import { loadInvites } from '@/lib/invites'
import { notFound } from 'next/navigation'

type Props = {
  searchParams: Promise<{
    partyId?: string
  }>
}

export default async function WeddingPartyPage({ searchParams }: Props) {
  const { partyId } = await searchParams

  if (!partyId) {
    notFound()
  }

  const invites = await loadInvites()
  const party = invites.find((p) => p.partyId === partyId)

  // 🔒 hard gate
  if (!party || !party.weddingParty) {
    notFound()
  }

  return (

    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-stone-900">
        Wedding Party
      </h1>

      <p className="mt-4 text-sm text-gray-600">
        Party ID: {party.partyId}
      </p>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-stone-900">Guests</h2>
        <ul className="mt-3 space-y-2">
          {party.guests.map((guest) => (
            <li key={guest} className="text-gray-700">
              {guest}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}