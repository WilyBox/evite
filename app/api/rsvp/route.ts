import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; time: number }>()
const WINDOW = 60_000 // 1 minute
const MAX = 5

function getClientIp(req: Request) {
  const xff = req.headers.get('x-forwarded-for')
  if (!xff) return 'unknown'
  return xff.split(',')[0].trim()
}

function normaliseName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

async function loadPlusOneNames() {
  const filePath = path.join(process.cwd(), 'data', 'plus-ones.txt')
  const file = await readFile(filePath, 'utf8')

  return new Set(
    file
      .split(/\r?\n/)
      .map((line) => normaliseName(line))
      .filter(Boolean)
  )
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
    const plusOneNames = await loadPlusOneNames()
    const hasPlusOne = plusOneNames.has(normaliseName(cleanName))

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

if (hasPlusOne) {
  if (!plusOneAttendance || !['yes', 'no'].includes(plusOneAttendance)) {
    return NextResponse.json(
      { error: 'Please confirm whether your plus one is attending.' },
      { status: 400 }
    )
  }

  if (plusOneAttendance === 'yes') {
    if (!plusOneName?.trim()) {
      return NextResponse.json(
        { error: 'Plus one name is required.' },
        { status: 400 }
      )
    }

    if (!plusOneDietary?.trim()) {
      return NextResponse.json(
        { error: 'Plus one dietary requirement is required.' },
        { status: 400 }
      )
    }

    if (plusOneDietary === 'other' && !plusOneDietaryNotes?.trim()) {
      return NextResponse.json(
        { error: 'Please specify your plus one dietary requirements.' },
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
        { error: 'Plus one dietary notes are too long.' },
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

      return NextResponse.json(
        { error: 'Missing email configuration.' },
        { status: 500 }
      )
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

const formattedPlusOneDietary =
  hasPlusOne && attendance === 'yes' && plusOneAttendance === 'yes'
    ? plusOneDietary === 'other'
      ? `Other - ${plusOneDietaryNotes?.trim() || ''}`
      : `${plusOneDietary?.charAt(0).toUpperCase() || ''}${plusOneDietary?.slice(1) || ''}`
    : 'N/A'

    const mailOptions = {
      from: `Wedding RSVP <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `RSVP Submission - ${cleanName}`,
      text: `New RSVP Submission

Name: ${cleanName}
Attendance: ${attendance}

Dietary requirement: ${formattedDietary}
Song recommendation: ${songRecommendation?.trim() || 'None provided'}

Plus one allowed: ${hasPlusOne ? 'Yes' : 'No'}
Plus one attendance: ${hasPlusOne && attendance === 'yes' ? plusOneAttendance || 'Not provided' : 'N/A'}
Plus one name: ${hasPlusOne && attendance === 'yes' && plusOneAttendance === 'yes' ? plusOneName?.trim() || 'Not provided' : 'N/A'}
Plus one dietary requirement: ${formattedPlusOneDietary}

IP: ${ip}
`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      hasPlusOne,
    })
  } catch (error) {
    console.error('RSVP email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send RSVP.' },
      { status: 500 }
    )
  }
}