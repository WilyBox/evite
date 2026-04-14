'use client'

import { useEffect, useMemo, useState } from 'react'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'

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

function normaliseName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

type PartyLookupResponse =
  | {
      found: true
      partyId: string
      guests: string[]
      weddingParty: boolean
    }
  | {
      found: false
    }

type RSVPSubmitResponse =
  | {
      success: true
      partyId: string
      weddingParty: boolean
      hasLinkedGuest: boolean
      linkedGuestName?: string
    }
  | {
      error?: string
    }

export default function RSVPSection() {
  const router = useRouter()

  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
  const [name, setName] = useState('')
  const [partyId, setPartyId] = useState('')
  const [partyGuests, setPartyGuests] = useState<string[]>([])
  const [isCheckingParty, setIsCheckingParty] = useState(false)
  const [isWeddingParty, setIsWeddingParty] = useState(false)

  const [dietary, setDietary] = useState('nil')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [songRecommendation, setSongRecommendation] = useState('')
  const [website, setWebsite] = useState('')

  const [plusOneAttendance, setPlusOneAttendance] = useState<'yes' | 'no'>('yes')
  const [plusOneDietary, setPlusOneDietary] = useState('nil')
  const [plusOneDietaryNotes, setPlusOneDietaryNotes] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const linkedGuestName = useMemo(() => {
    const cleanName = normaliseName(name)
    return partyGuests.find((guest) => normaliseName(guest) !== cleanName) ?? ''
  }, [partyGuests, name])

  const hasLinkedGuest = Boolean(linkedGuestName)

  useEffect(() => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setPartyId('')
      setPartyGuests([])
      setIsWeddingParty(false)
      return
    }

    const timeout = setTimeout(async () => {
      try {
        setIsCheckingParty(true)

        const res = await fetch('/api/rsvp/check-plus-one', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: trimmedName }),
        })

        if (!res.ok) {
          setPartyId('')
          setPartyGuests([])
          setIsWeddingParty(false)
          return
        }

        const data = (await res.json()) as PartyLookupResponse

        if (data.found) {
          setPartyId(data.partyId)
          setPartyGuests(data.guests)
          setIsWeddingParty(data.weddingParty)
        } else {
          setPartyId('')
          setPartyGuests([])
          setIsWeddingParty(false)
        }
      } catch (error) {
        console.error(error)
        setPartyId('')
        setPartyGuests([])
        setIsWeddingParty(false)
      } finally {
        setIsCheckingParty(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [name])

  useEffect(() => {
    if (!hasLinkedGuest) {
      setPlusOneAttendance('yes')
      setPlusOneDietary('nil')
      setPlusOneDietaryNotes('')
    }
  }, [hasLinkedGuest])

  useEffect(() => {
    if (plusOneAttendance === 'no') {
      setPlusOneDietary('nil')
      setPlusOneDietaryNotes('')
    }
  }, [plusOneAttendance])

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
        plusOneName: hasLinkedGuest ? linkedGuestName : '',
        plusOneAttendance: hasLinkedGuest ? plusOneAttendance : undefined,
        plusOneDietary: hasLinkedGuest ? plusOneDietary : 'nil',
        plusOneDietaryNotes: hasLinkedGuest ? plusOneDietaryNotes : '',
      }),
    })

    const data = (await res.json()) as RSVPSubmitResponse

    if (!res.ok) {
      throw new Error(
        'error' in data ? data.error || 'Something went wrong.' : 'Something went wrong.'
      )
    }

    if ('success' in data) {
      if (data.weddingParty) {
        router.push(`/wedding-party?partyId=${encodeURIComponent(data.partyId)}`)
        return
      }

      router.push('/accommodation')
      return
    }
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
              {attendance === 'yes' && name.trim() && isCheckingParty && (
                <p className="mt-2 text-sm text-gray-500">Checking invitation details...</p>
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

                {hasLinkedGuest && (
                  <div className="space-y-8 rounded-xl border border-stone-200 bg-white/70 p-6">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Linked guest</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        We found another guest on your invitation.
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">Guest</p>
                      <p className="mt-1 text-sm text-gray-700">{linkedGuestName}</p>
                    </div>

                    <fieldset>
                      <legend className="text-center text-sm font-medium text-gray-900">
                        Will {linkedGuestName} attend?
                      </legend>

                      <div className="mt-4 flex items-center justify-center gap-8">
                        {[
                          { id: 'yes', label: "Yes, they'll be there" },
                          { id: 'no', label: "No, they can't make it" },
                        ].map((option) => (
                          <div key={option.id} className="flex items-center gap-2">
                            <input
                              id={`linkedguest-attendance-${option.id}`}
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
                              htmlFor={`linkedguest-attendance-${option.id}`}
                              className="text-sm text-gray-700"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>

                    {plusOneAttendance === 'yes' && (
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {linkedGuestName}&apos;s dietary requirements
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