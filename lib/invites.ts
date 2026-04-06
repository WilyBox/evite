import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type InviteParty = {
  partyId: string
  guests: string[]
}

export function normaliseName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export async function loadInvites(): Promise<InviteParty[]> {
  const filePath = path.join(process.cwd(), 'data', 'invites.json')
  const file = await readFile(filePath, 'utf8')
  return JSON.parse(file) as InviteParty[]
}

export function findPartyByName(invites: InviteParty[], name: string) {
  const target = normaliseName(name)

  return invites.find((party) =>
    party.guests.some((guest) => normaliseName(guest) === target)
  )
}