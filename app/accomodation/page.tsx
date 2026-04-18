const placesToStay = [
  {
    name: 'Allanton Inn',
    type: 'Inn',
    area: 'Allanton, Berwickshire',
    description:
      'A charming coaching inn in the village of Allanton, with en-suite rooms and a good option for guests who want a traditional inn stay.',
    href: 'https://www.allantoninn.co.uk/',
  },
  {
    name: 'The Plough Inn',
    type: 'Inn / B&B',
    area: 'Leitholm, near Coldstream',
    description:
      'Family-run inn offering en-suite rooms with B&B and dinner, bed & breakfast options.',
    href: 'http://www.theploughinnleitholm.co.uk/',
  },
  {
    name: 'Duns Castle Holiday Cottages',
    type: 'Self-catering cottages',
    area: 'Duns',
    description:
      'Cottages set within the Duns Castle estate, suited to couples, families, and guests wanting a more private stay.',
    href: 'https://dunscastleholidaycottages.co.uk/',
  },
  {
    name: 'The White House',
    type: 'Holiday home',
    area: 'Duns',
    description:
      'A period cottage on the outskirts of Duns, useful for guests wanting a house-style stay close to town.',
    href: 'https://www.crabtreeandcrabtree.com/properties/the-white-house/',
  },
  {
    name: 'Green Hope',
    type: 'Guest house / self-catering',
    area: 'Scottish Borders',
    description:
      'A modern, eco-friendly guest accommodation option with parking and family-friendly outdoor space.',
    href: 'https://greenhope.co.uk/',
  },
]

export default function AccommodationPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
            Accommodation
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Places to stay near Duns & Dunglass Estate
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