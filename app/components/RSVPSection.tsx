'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

const dietaryOptions = [
  { id: 'nil', name: 'Nil' },
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'halal', name: 'Halal' },
  { id: 'other', name: 'Other' },
]

export default function RSVPSection() {
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
  const [name, setName] = useState('')
  const [dietary, setDietary] = useState('nil')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [songRecommendation, setSongRecommendation] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          dietary,
          dietaryNotes,
          attendance,
          songRecommendation,
          website,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
      setName('')
      setDietary('nil')
      setDietaryNotes('')
      setSongRecommendation('')
      setWebsite('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.')
    }
  }

  return (
    <section className="bg-stone-50 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-auto max-w-2xl">
          <h2
            className={`${inter.className} text-center text-lg font-semibold uppercase tracking-[0.35em] text-gray-500`}
          >
            RSVP
          </h2>



          <fieldset>
 
  <div className="mt-4 flex justify-center items-center gap-8">
    {[
      { id: 'yes', label: "Yes, I'll be there" },
      { id: 'no', label: "Sorry, I can't make it" },
    ].map((option) => (
      <div key={option.id} className="flex items-center gap-2">
        <input
          id={option.id}
          name="attendance"
          type="radio"
          value={option.id}
          checked={attendance === option.id}
          onChange={(e) => setAttendance(e.target.value as 'yes' | 'no')}
          className="h-4 w-4 border-gray-300 text-stone-900 focus:ring-stone-900"
        />
        <label htmlFor={option.id} className="text-sm text-gray-700">
          {option.label}
        </label>
      </div>
    ))}
  </div>
</fieldset>

          <form onSubmit={handleSubmit} className="mt-14 space-y-10">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-3 block w-full rounded-md bg-white px-4 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-900"
                placeholder="Your full name"
                required
              />
            </div>

            {attendance === 'yes' && (
  <>
    {/* Dietary fieldset */
               <fieldset>
              <legend className="block text-sm font-medium text-gray-900">
                Dietary requirements
              </legend>

              <div className="mt-4 space-y-4">
                {dietaryOptions.map((option) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <input
                      id={option.id}
                      name="dietary"
                      type="radio"
                      value={option.id}
                      checked={dietary === option.id}
                      onChange={(e) => setDietary(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-stone-900 focus:ring-stone-900"
                    />
                    <label htmlFor={option.id} className="text-sm text-gray-700">
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>

              {dietary === 'other' && (
                <div className="mt-6">
                  <label htmlFor="dietaryNotes" className="block text-sm font-medium text-gray-900">
                    Please specify
                  </label>
                  <textarea
                    id="dietaryNotes"
                    name="dietaryNotes"
                    rows={3}
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="mt-3 block w-full rounded-md bg-white px-4 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-900"
                    placeholder="Any allergies, religious requirements, or other dietary notes"
                    required={dietary === 'other'}
                  />
                </div>
              )}
            </fieldset>
    
    }
    
    
    {/* Song recommendation */
                <div>
              <label
                htmlFor="songRecommendation"
                className="block text-sm font-medium text-gray-900"
              >
                Song recommendation
              </label>
              <textarea
                id="songRecommendation"
                name="songRecommendation"
                rows={4}
                value={songRecommendation}
                onChange={(e) => setSongRecommendation(e.target.value)}
                className="mt-3 block w-full rounded-md bg-white px-4 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-900"
                placeholder="Any song you'd love to hear on the night"
              />
            </div>
    
    }
  </>
)}

 



            <div className="hidden">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-md bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending...' : 'Submit'}
              </button>
            </div>

            {status === 'success' && (
              <p className="text-center text-sm text-green-700">
                Thank you — your RSVP has been sent.
              </p>
            )}

            {status === 'error' && (
              <p className="text-center text-sm text-red-700">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}