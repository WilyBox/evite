import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

const events = [
  {
    id: 1,
    title: 'Ceremony',
    venue: 'Our Lady Immaculate and St Margaret Catholic Church, Dunss',
    location: '48 Bridgend, Duns TD11 3EX',
    time: '1:00 PM',
  },
  {
    id: 2,
    title: 'Reception',
    venue: 'Dunglass Estate',
    location: 'Dunglass, Cockburnspath TD13 5XF',
    time: '3:00 PM',
  },
]

export default function TimelineSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        
        {/* Heading */}
        <h2 className={`${inter.className} text-center text-sm font-semibold uppercase tracking-[0.35em] text-gray-500`}>
          Order of the Day
        </h2>

        {/* Timeline */}
        <ul role="list" className="mt-16 divide-y divide-gray-200">
          {events.map((event) => (
            <li key={event.id} className="py-10">
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                
                {/* Left: Title + Location */}
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {event.title}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 max-w-md">
                    {event.venue}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {event.location}
                  </p>
                </div>

                {/* Right: Time */}
                <div className="text-sm uppercase tracking-[0.25em] text-gray-500 sm:text-right">
                  {event.time}
                </div>

              </div>

            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}