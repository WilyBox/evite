export const dynamic = 'force-dynamic'

const placesToStay = [
  {
    name: 'Bayswell Park Hotel',
    type: 'Hotel',
    area: 'Dunbar',
    description:
      '',
    href: 'https://bayswellparkhotel.com/',
  },
  {
    name: 'Hillcrest Bed & Breakfast',
    type: 'B&B',
    area: 'Cockburnspath',
    description:
      '',
    href: 'https://www.booking.com/Share-S0l8UWk',
  },
  {
    name: 'The Ships Quarters',
    type: 'Hotel',
    area: 'Eyemouth',
    description:
      '',
    href: 'http://www.theshipsquarters.com/',
  },
  {
    name: 'The Eyesleepover',
    type: 'Hotel',
    area: 'Eyemouth',
    description:
      '',
    href: 'https://www.eyesleep.co.uk/reviews',
  },
  {
    name: 'Hideaway Cottage',
    type: 'Airbnb',
    area: 'Cockburnspath',
    description:
      '',
    href: 'https://www.airbnb.co.uk/rooms/40721945?check_in=2024-03-05&check_out=2024-03-10&guests=1&adults=1&s=67&unique_share_id=a1693629-dff4-47f8-b3cc-6032a99d0ff6',
  },
  {
    name: 'Ferneylea Loft Lodge',
    type: 'B&B',
    area: 'Cockburnspath',
    description:
      '',
    href: 'https://www.airbnb.co.uk/rooms/27229648?check_in=2024-02-16&check_out=2024-02-21&guests=1&adults=1&s=67&unique_share_id=e7b0c133-ce8c-4c0d-a90d-1aa6a2a49030',
  },
  {
    name: 'Dene House',
    type: 'Holiday home',
    area: 'Cockburnspath',
    description:
      '',
    href: 'https://www.airbnb.co.uk/rooms/851280439007737362?check_in=2024-02-23&check_out=2024-02-26&guests=1&adults=1&s=67&unique_share_id=e7ae0bdf-d744-402d-b6b3-b8a0ca3e00d2',
  },
  {
    name: 'Culzean Cottage',
    type: 'Guest house / self-catering',
    area: 'Cockburnspath',
    description:
      'A modern, eco-friendly guest accommodation option with parking and family-friendly outdoor space.',
    href: 'https://www.airbnb.co.uk/rooms/8116331?check_in=2024-02-26&check_out=2024-03-01&guests=1&adults=1&s=67&unique_share_id=5d71241e-8ba3-4cd7-acfc-4cd5188a2007',
  },
  {
    name: 'Farm Cottage',
    type: 'Airbnb',
    area: 'Cockburnspath',
    description:
      '',
    href: 'https://www.airbnb.co.uk/rooms/550689617915666640?check_in=2024-06-10&check_out=2024-06-15&guests=1&adults=1&s=67&unique_share_id=b925c716-5ff7-42c8-a879-6a4ca0bcc659',
  },
]

export default function AccommodationPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
            Excited to see you there! 🎉
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Recommended Accommodation
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-600 sm:text-lg">
            For guests travelling to our wedding in Duns, with the reception at
            Dunglass Estate, here are some nearby hotels, inns, cottages and
            guest accommodation options to consider.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            We recommend booking early, especially if you are planning to stay
            over the wedding weekend.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {placesToStay.map((place) => (
            <article
              key={place.name}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
                    {place.type}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                    {place.name}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">{place.area}</p>
                </div>

                <p className="text-sm leading-6 text-stone-600">
                  {place.description}
                </p>

                <div className="pt-2">
                  <a
                    href={place.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white"
                  >
                    View accommodation
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}