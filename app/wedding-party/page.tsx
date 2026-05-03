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
    'Tobryn Prior': 'Seaview House',
    'Eoghann Robinson': 'Seaview House',
    'Lukasz Lesnik': 'Seaview House',
    'Maebh Baker': 'Seaview House',
    'Gavin Baker': 'Seaview House',
    'Christopher Sweeney': 'Seaview House',
    'Roisin Sweeney': 'Seaview House',
    'Aleksandra Omiecinska': 'Treehouse',
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
    'Tobryn Prior': 'Seaview House',
    'Eoghann Robinson': 'Seaview House',
    'Lukasz Lesnik': 'Seaview House',
    'Maebh Baker': 'Seaview House',
    'Gavin Baker': 'Seaview House',
    'Christopher Sweeney': 'Seaview House',
    'Roisin Sweeney': 'Seaview House',
    'Aleksandra Omiecinska': 'Seaview House',
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
    <main className="relative min-h-screen w-full selection:bg-stone-800 selection:text-white">
      
      {/* 1. Full-Page Fixed Background Image */}
      <div className="fixed inset-0 z-0">
        {/* Note: If you want Next.js image optimization, swap <img> for <Image src="..." fill className="object-cover" /> */}
        <img
          src="/images/location/courtyard2.webp"
          alt="Church near the wedding venue"
          className="h-full w-full object-cover object-center"
        />
        {/* Dark overlay to ensure text/cards pop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* 2. Scrolling Content Wrapper */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16 md:py-24">
        
        {/* Header / Info Card (Glassmorphism effect) */}
        <section className="mb-12 md:mb-16 rounded-3xl border border-white/20 bg-black/30 p-8 text-center shadow-2xl backdrop-blur-md md:p-12">
          <h1 className="text-4xl font-light tracking-wide text-white md:text-5xl lg:text-6xl">
            Wedding Party
          </h1>
          <div className="mx-auto mt-6 h-px w-16 bg-white/40" />
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base lg:text-lg">
            Your accommodation is at the wedding venue (<span className="font-bold">Dunglass Estate</span>). 
            Travel is provided between the ceremony and venue. 
            Access to the accomodation from 4pm, checkout on Saturday is at 11am.
            There will be food available, and each apartment includes its own kitchen and facilities.
          </p>
        </section>

        {/* Guest Cards Grid */}
        <section>
          <div className="mb-6 flex items-center justify-between border-b border-white/20 pb-2">
            <h2 className="text-xl font-medium tracking-wide text-white">Guest Locations</h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {party.guests.map((guest: string) => {
              const key = normaliseKey(guest)
              const day1House = day1Lookup[key] ?? 'TBC'
              const day2House = day2Lookup[key] ?? 'TBC'

              return (
<li
  key={guest}
  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
>
  {/* --- The Foliage Full-Card Background --- */}
  {/* inset-0, h-full, w-full, and object-cover make it fill the whole card */}
  <img
    src="/images/location/foliage.png"
    alt=""
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-105"
  />

  {/* Card Header */}
  {/* Removed the background and blur so the image shows through cleanly */}
  <div className="relative z-10 border-b border-stone-200/50 px-6 py-4">
    <p className="text-lg font-medium text-stone-900 text-center">{guest}</p>
  </div>

  {/* Card Body: Accommodation Details */}
  <div className="relative z-10 flex flex-col gap-3 p-6">
    
    {/* Inner detail pills */}
    {/* Changed to a very light, glassy background (white/40) so they sit nicely on top of the foliage */}
    <div className="flex items-center justify-between rounded-xl border border-white/50 bg-white/40 p-3 px-4 backdrop-blur-[2px]">
      <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
        Friday 19th March
      </span>
      <span className="text-sm font-medium text-stone-900">
        {day1House}
      </span>
    </div>

    <div className="flex items-center justify-between rounded-xl border border-white/50 bg-white/40 p-3 px-4 backdrop-blur-[2px]">
      <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
        Saturday 20th March
      </span>
      <span className="text-sm font-medium text-stone-900">
        {day2House}
      </span>
    </div>

  </div>
</li>
              )
            })}
          </ul>
        </section>

      </div>
    </main>
  )
}