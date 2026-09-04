import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth'

export function deriveTitle(prompt: string) {
  const line =
    prompt
      .split('\n')
      .map((l) => l.trim())
      .find(Boolean) ?? ''
  return line.slice(0, 80).trim() || 'Untitled presentation'
}

export async function requireUserId() {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session?.user.id) throw new Error('Unauthorized')
  return session.user.id
}