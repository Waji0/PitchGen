// import { getRequestHeaders } from '@tanstack/react-start/server'
// import { auth } from './auth'

// export async function getSession() {
//   const headers = getRequestHeaders()
//   const session = await auth.api.getSession({ headers })
//   return session
// }

// export async function requireAuth() {
//   const headers = getRequestHeaders()
//   const session = await auth.api.getSession({ headers })
//   if (!session?.user?.id) {
//     throw new Error('Unauthorized')
//   }
//   return session.user
// }



import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'

// By wrapping in createServerFn, the server imports are safely hidden from the client bundle
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  return session
})

export const requireAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user
})