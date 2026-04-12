import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { loadInvites, findPartyByName, normaliseName } from '@/lib/invites'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; time: number }>()
const WINDOW = 60_000 // 1 minute
const MAX = 5

function getClientIp(req: Request) {
  const xff = req.headers.get('x-forwarded-for')
  if (!xff) return 'unknown'
  return xff.split(',')[0].trim()
}

type RSVPBody = {
  name?: string
  dietary?: string
  dietaryNotes?: string
  songRecommendation?: string
  website?: string
  attendance?: 'yes' | 'no'
  plusOneAttendance?: 'yes' | 'no'
  plusOneName?: string
  plusOneDietary?: string
  plusOneDietaryNotes?: string
}

export async function POST(req: Request) {
  try {
    // Rate limit
    const ip = getClientIp(req)
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (record && now - record.time < WINDOW) {
      if (record.count >= MAX) {
        return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
      }
      record.count += 1
    } else {
      rateLimitMap.set(ip, { count: 1, time: now })
    }

    const {
      attendance,
      name,
      dietary,
      dietaryNotes,
      songRecommendation,
      website,
      plusOneAttendance,
      plusOneName,
      plusOneDietary,
      plusOneDietaryNotes,
    } = (await req.json()) as RSVPBody

    // Honeypot
    if (website) {
      return NextResponse.json({ success: true })
    }

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }

    if (!attendance || !['yes', 'no'].includes(attendance)) {
      return NextResponse.json({ error: 'Attendance is required.' }, { status: 400 })
    }

    const cleanName = name.trim()

    // Reusable invite lookup logic
    const invites = await loadInvites()
    const party = findPartyByName(invites, cleanName)

    if (!party) {
      return NextResponse.json(
        { error: 'We could not find your invitation details.' },
        { status: 400 }
      )
    }

    const linkedGuestName = party.guests.find(
  (guest) => normaliseName(guest) !== normaliseName(cleanName)
)

    const hasLinkedGuest = Boolean(linkedGuestName)

    if (attendance === 'yes') {
      if (!dietary?.trim()) {
        return NextResponse.json({ error: 'Dietary requirement is required.' }, { status: 400 })
      }

      if (dietary === 'other' && !dietaryNotes?.trim()) {
        return NextResponse.json(
          { error: 'Please specify your dietary requirements.' },
          { status: 400 }
        )
      }



      if (hasLinkedGuest) {
        if (!plusOneAttendance || !['yes', 'no'].includes(plusOneAttendance)) {
          return NextResponse.json(
            { error: 'Please confirm whether your linked guest is attending.' },
            { status: 400 }
          )
        }

    if (plusOneAttendance === 'yes') {
    if (!linkedGuestName) {
      return NextResponse.json(
        { error: 'No linked guest found for this invite.' },
        { status: 400 }
      )
    }

    if (!plusOneName?.trim()) {
      return NextResponse.json(
        { error: 'Linked guest name is required.' },
        { status: 400 }
      )
    }

    if (normaliseName(plusOneName) !== normaliseName(linkedGuestName)) {
      return NextResponse.json(
        { error: `The linked guest for ${cleanName} is ${linkedGuestName}.` },
        { status: 400 }
      )
    }

    if (!plusOneDietary?.trim()) {
      return NextResponse.json(
        { error: 'Linked guest dietary requirement is required.' },
        { status: 400 }
      )
    }

    if (plusOneDietary === 'other' && !plusOneDietaryNotes?.trim()) {
      return NextResponse.json(
        { error: 'Please specify your linked guest dietary requirements.' },
        { status: 400 }
      )
    }
  }
}


    }

    if (songRecommendation && songRecommendation.length > 500) {
      return NextResponse.json({ error: 'Song recommendation is too long.' }, { status: 400 })
    }

    if (dietaryNotes && dietaryNotes.length > 500) {
      return NextResponse.json({ error: 'Dietary notes are too long.' }, { status: 400 })
    }

    if (plusOneDietaryNotes && plusOneDietaryNotes.length > 500) {
      return NextResponse.json(
        { error: 'Linked guest dietary notes are too long.' },
        { status: 400 }
      )
    }

    // ENV CHECK
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.RECEIVER_EMAIL
    ) {
      console.error('Missing env vars:', {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'MISSING',
        RECEIVER_EMAIL: process.env.RECEIVER_EMAIL,
      })

      return NextResponse.json({ error: 'Missing email configuration.' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: parseInt(process.env.SMTP_PORT, 10) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const formattedDietary =
      attendance === 'yes'
        ? dietary === 'other'
          ? `Other - ${dietaryNotes?.trim() || ''}`
          : `${dietary?.charAt(0).toUpperCase() || ''}${dietary?.slice(1) || ''}`
        : 'N/A'

    const formattedLinkedGuestDietary =
      hasLinkedGuest && attendance === 'yes' && plusOneAttendance === 'yes'
        ? plusOneDietary === 'other'
          ? `Other - ${plusOneDietaryNotes?.trim() || ''}`
          : `${plusOneDietary?.charAt(0).toUpperCase() || ''}${plusOneDietary?.slice(1) || ''}`
        : 'N/A'

    const mailOptions = {
      from: `Wedding RSVP <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `RSVP Submission - ${cleanName}`,
      text: `New RSVP Submission

Party ID: ${party.partyId}
Wedding party: ${party.weddingParty ? 'Yes' : 'No'}
Name: ${cleanName}
Attendance: ${attendance}

Dietary requirement: ${formattedDietary}
Song recommendation: ${songRecommendation?.trim() || 'None provided'}

Linked guest exists: ${hasLinkedGuest ? 'Yes' : 'No'}
Linked guest name: ${hasLinkedGuest ? linkedGuestName : 'N/A'}
Linked guest attendance: ${hasLinkedGuest && attendance === 'yes' ? plusOneAttendance || 'Not provided' : 'N/A'}
Linked guest dietary requirement: ${formattedLinkedGuestDietary}

IP: ${ip}
`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      partyId: party.partyId,
      weddingParty: party.weddingParty,
      hasLinkedGuest,
      linkedGuestName,
    })
  } catch (error) {
    console.error('RSVP email sending error:', error)
    return NextResponse.json({ error: 'Failed to send RSVP.' }, { status: 500 })
  }
}