import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; time: number }>()
const WINDOW = 60_000 // 1 minute
const MAX = 5 // max submissions per IP per window

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
  website?: string // honeypot
}

export async function POST(req: Request) {
  try {
    // Rate limit early
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

    const { name, dietary, dietaryNotes, songRecommendation, website } =
      (await req.json()) as RSVPBody

      console.log('RSVP payload received:', {
  name,
  dietary,
  dietaryNotes,
  songRecommendation,
  website,
})

    // Honeypot
    if (website) {
      return NextResponse.json({ success: true })
    }

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }

    if (!dietary?.trim()) {
      return NextResponse.json({ error: 'Dietary requirement is required.' }, { status: 400 })
    }

    if (dietary === 'other' && !dietaryNotes?.trim()) {
      return NextResponse.json(
        { error: 'Please specify your dietary requirements.' },
        { status: 400 }
      )
    }

    if (songRecommendation && songRecommendation.length > 500) {
      return NextResponse.json({ error: 'Song recommendation is too long.' }, { status: 400 })
    }

    if (dietaryNotes && dietaryNotes.length > 500) {
      return NextResponse.json({ error: 'Dietary notes are too long.' }, { status: 400 })
    }

    if (
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.EMAIL_RECEIVER
) {
  return NextResponse.json(
    { error: 'Missing email configuration.' },
    { status: 500 }
  )
}

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })


    const formattedDietary =
      dietary === 'other'
        ? `Other - ${dietaryNotes?.trim() || ''}`
        : dietary.charAt(0).toUpperCase() + dietary.slice(1)

    const mailOptions = {
      from: `Wedding RSVP <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `RSVP Submission - ${name.trim()}`,
      text: `New RSVP Submission

Name: ${name.trim()}
Dietary requirement: ${formattedDietary}
Song recommendation: ${songRecommendation?.trim() || 'None provided'}
IP: ${ip}
`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('RSVP email sending error:', error)
    return NextResponse.json({ error: 'Failed to send RSVP.' }, { status: 500 })
  }
}