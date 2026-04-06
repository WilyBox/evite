import fs from 'node:fs'
import path from 'node:path'

const inputPath = path.join(process.cwd(), 'data', 'invites.txt')
const outputPath = path.join(process.cwd(), 'data', 'invites.json')

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const text = fs.readFileSync(inputPath, 'utf8')

const lines = text
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean)

const counter = {}

const invites = lines.map((line) => {
  const guests = line.split(',').map((n) => n.trim())

  // Use surname of first guest for partyId
  const surname = guests[0].split(' ').slice(-1)[0].toLowerCase()

  counter[surname] = (counter[surname] || 0) + 1

  return {
    partyId: `${slugify(surname)}-${counter[surname]}`,
    guests,
  }
})

fs.writeFileSync(outputPath, JSON.stringify(invites, null, 2))

console.log('✅ invites.json generated')