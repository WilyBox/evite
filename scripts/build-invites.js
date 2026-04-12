import fs from 'node:fs'
import path from 'node:path'

const weddingPath = path.join(process.cwd(), 'data', 'invites.txt')
const guestsPath = path.join(process.cwd(), 'data', 'guests.txt')
const outputPath = path.join(process.cwd(), 'data', 'invites.json')

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function extractSurname(fullName) {
  if (!fullName) return 'guest'
  const parts = fullName.trim().split(/\s+/)
  return parts.length ? parts[parts.length - 1].toLowerCase() : 'guest'
}

function parseFile(text, weddingParty, counter, seenPartyIds) {
  return text
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(({ line }) => line.length > 0)
    .map(({ line, index }) => {
      // Split + clean names
      let guests = line
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean)

      // Deduplicate names within same party
      guests = [...new Set(guests)]

      if (guests.length === 0) {
        console.warn(`⚠️ Skipping empty line at ${index + 1}`)
        return null
      }

      const surname = extractSurname(guests[0])

      counter[surname] = (counter[surname] || 0) + 1

      let partyId = `${slugify(surname)}-${counter[surname]}`

      // Ensure global uniqueness (extra safety)
      let suffix = 1
      while (seenPartyIds.has(partyId)) {
        suffix += 1
        partyId = `${slugify(surname)}-${counter[surname]}-${suffix}`
      }
      seenPartyIds.add(partyId)

      return {
        partyId,
        weddingParty,
        guests,
      }
    })
    .filter(Boolean)
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    console.error(`❌ Failed to read ${filePath}`)
    process.exit(1)
  }
}

const counter = {}
const seenPartyIds = new Set()

const weddingText = safeRead(weddingPath)
const guestsText = safeRead(guestsPath)

const weddingInvites = parseFile(weddingText, true, counter, seenPartyIds)
const guestInvites = parseFile(guestsText, false, counter, seenPartyIds)

const invites = [...weddingInvites, ...guestInvites]

fs.writeFileSync(outputPath, JSON.stringify(invites, null, 2))

console.log(`✅ invites.json generated (${invites.length} parties)`)