import { Playfair_Display, Italianno, Inter } from 'next/font/google'

const italianno = Italianno({
  subsets: ['latin'],
  weight: '400',
})

const inter = Inter({
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
})

export default function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-stone-950">
      <img
        src="/images/location/centered-courtyard.webp"
        alt="Dunglass Estate courtyard"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center brightness-[0.8]"
      />

      <div className="absolute inset-0 -z-10 bg-stone-950/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="-mt-8 text-center text-white sm:-mt-12">
          <div className="mx-auto my-5 h-px w-20 bg-white/50" />

          <p
            className={`${inter.className} mb-5 text-xs font-bold uppercase tracking-[0.38em] text-white/75 sm:text-sm`}
          >
            You are invited to the wedding of
          </p>

          <h1 className={`${italianno.className} text-6xl leading-none sm:text-8xl md:text-[9rem]`}>
            <span>Libby</span>

            <span
              className={`${playfair.className} mx-3 inline-block text-[0.5em] align-middle opacity-90`}
            >
              &
            </span>

            <span>Briain</span>
          </h1>

          <div className="mx-auto my-5 h-px w-20 bg-white/50" />

          <p
            className={`${inter.className} mb-5 text-xs font-bold uppercase tracking-[0.38em] text-white/75 sm:text-sm`}
          >
            Dunglass Estate
          </p>

          <p
            className={`${inter.className} mt-5 text-xs uppercase tracking-[0.34em] text-white/80 sm:text-sm`}
          >
            20th of March, 2027
          </p>
        </div>
      </div>
    </section>
  )
}