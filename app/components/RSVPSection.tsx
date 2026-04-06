'use client'

import { useEffect, useState } from 'react'
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
  const [hasPlusOne, setHasPlusOne] = useState(false)
  const [isCheckingPlusOne, setIsCheckingPlusOne] = useState(false)

  const [dietary, setDietary] = useState('nil')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [songRecommendation, setSongRecommendation] = useState('')
  const [website, setWebsite] = useState('')

  const [plusOneName, setPlusOneName] = useState('')
  const [plusOneAttendance, setPlusOneAttendance] = useState<'yes' | 'no' >('yes')
  const [plusOneDietary, setPlusOneDietary] = useState('nil')
  const [plusOneDietaryNotes, setPlusOneDietaryNotes] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setHasPlusOne(false)
      return
    }

    const timeout = setTimeout(async () => {
      try {
        setIsCheckingPlusOne(true)

        const res = await fetch('/api/rsvp/check-plus-one', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: trimmedName }),
        })

        if (!res.ok) {
          throw new Error('Failed to check plus-one status.')
        }

        const data = (await res.json()) as { hasPlusOne: boolean }
        setHasPlusOne(Boolean(data.hasPlusOne))
      } catch (error) {
        console.error(error)
        setHasPlusOne(false)
      } finally {
        setIsCheckingPlusOne(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [name])

  useEffect(() => {
    if (!hasPlusOne) {
      setPlusOneName('')
      setPlusOneDietary('nil')
      setPlusOneDietaryNotes('')
    }
  }, [hasPlusOne])

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
          attendance,
          dietary,
          dietaryNotes,
          songRecommendation,
          website,
          plusOneName: hasPlusOne ? plusOneName : '',
          plusOneAttendance: hasPlusOne ? plusOneAttendance : undefined,
          plusOneDietary: hasPlusOne ? plusOneDietary : 'nil',
          plusOneDietaryNotes: hasPlusOne ? plusOneDietaryNotes : '',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
      setName('')
      setHasPlusOne(false)
      setDietary('nil')
      setDietaryNotes('')
      setSongRecommendation('')
      setWebsite('')
      setPlusOneName('')
      setPlusOneDietary('nil')
      setPlusOneDietaryNotes('')
      setAttendance('yes')
      setPlusOneAttendance('yes')
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

          <form onSubmit={handleSubmit} className="mt-14 space-y-10">
            <fieldset>
              <legend className="text-center text-sm font-medium text-gray-900">
                Attendance
              </legend>

              <div className="mt-4 flex items-center justify-center gap-8">
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
              {attendance === 'yes' && name.trim() && isCheckingPlusOne && (
                <p className="mt-2 text-sm text-gray-500">Checking guest details...</p>
              )}
            </div>

            {attendance === 'yes' && (
              <>
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-900">
                    Dietary requirements
                  </legend>

                  <div className="mt-4 space-y-4">
                    {dietaryOptions.map((option) => (
                      <div key={option.id} className="flex items-center gap-3">
                        <input
                          id={`dietary-${option.id}`}
                          name="dietary"
                          type="radio"
                          value={option.id}
                          checked={dietary === option.id}
                          onChange={(e) => setDietary(e.target.value)}
                          className="h-4 w-4 border-gray-300 text-stone-900 focus:ring-stone-900"
                        />
                        <label htmlFor={`dietary-${option.id}`} className="text-sm text-gray-700">
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

              {hasPlusOne && (
  <div className="space-y-8 rounded-xl border border-stone-200 bg-white/70 p-6">
    
    <div>
      <h3 className="text-base font-semibold text-gray-900">Plus one</h3>
      <p className="mt-1 text-sm text-gray-600">
        We have a plus one reserved for you.
      </p>
    </div>

    {/* ALWAYS SHOW THIS */}
    <fieldset>
      <legend className="text-center text-sm font-medium text-gray-900">
        Will your plus one attend?
      </legend>

      <div className="mt-4 flex items-center justify-center gap-8">
        {[
          { id: 'yes', label: "Yes, they'll be there" },
          { id: 'no', label: "No, they can't make it" },
        ].map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <input
              id={`plusone-attendance-${option.id}`}
              name="plusOneAttendance"
              type="radio"
              value={option.id}
              checked={plusOneAttendance === option.id}
              onChange={(e) =>
                setPlusOneAttendance(e.target.value as 'yes' | 'no')
              }
              className="h-4 w-4 border-gray-300 text-stone-900 focus:ring-stone-900"
            />
            <label
              htmlFor={`plusone-attendance-${option.id}`}
              className="text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>

    {/* ONLY SHOW THIS IF THEY ARE ATTENDING */}
    {plusOneAttendance === 'yes' && (
      <>
        <div>
          <label
            htmlFor="plusOneName"
            className="block text-sm font-medium text-gray-900"
          >
            Plus one name
          </label>
          <input
            id="plusOneName"
            name="plusOneName"
            type="text"
            value={plusOneName}
            onChange={(e) => setPlusOneName(e.target.value)}
            className="mt-3 block w-full rounded-md bg-white px-4 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-900"
            placeholder="Your guest's full name"
            required={attendance === 'yes' && hasPlusOne && plusOneAttendance === 'yes'}
          />
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-gray-900">
            Plus one dietary requirements
          </legend>

          <div className="mt-4 space-y-4">
            {dietaryOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-3">
                <input
                  id={`plusone-dietary-${option.id}`}
                  name="plusOneDietary"
                  type="radio"
                  value={option.id}
                  checked={plusOneDietary === option.id}
                  onChange={(e) => setPlusOneDietary(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-stone-900 focus:ring-stone-900"
                />
                <label
                  htmlFor={`plusone-dietary-${option.id}`}
                  className="text-sm text-gray-700"
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>

          {plusOneDietary === 'other' && (
            <div className="mt-6">
              <label
                htmlFor="plusOneDietaryNotes"
                className="block text-sm font-medium text-gray-900"
              >
                Please specify
              </label>
              <textarea
                id="plusOneDietaryNotes"
                name="plusOneDietaryNotes"
                rows={3}
                value={plusOneDietaryNotes}
                onChange={(e) => setPlusOneDietaryNotes(e.target.value)}
                className="mt-3 block w-full rounded-md bg-white px-4 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-900"
                placeholder="Any allergies, religious requirements, or other dietary notes"
                required={plusOneAttendance === 'yes' && plusOneDietary === 'other'}
              />
            </div>
          )}
        </fieldset>
      </>
    )}
  </div>
)}

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