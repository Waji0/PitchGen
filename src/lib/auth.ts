// import { betterAuth } from 'better-auth'
// import { prismaAdapter } from 'better-auth/adapters/prisma'
// import { prisma } from '#/db'
// import { env } from '#/env'

// export const auth = betterAuth({
//   database: prismaAdapter(prisma),
//   socialProviders: {
//     google: {
//       clientId: env.GOOGLE_CLIENT_ID ?? '',
//       clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
//     },
//     github: {
//       clientId: env.GITHUB_CLIENT_ID ?? '',
//       clientSecret: env.GITHUB_CLIENT_SECRET ?? '',
//     },
//   },
//   secret: env.BETTER_AUTH_SECRET,
//   baseURL: env.BETTER_AUTH_URL,
// })





import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '#/db'
import { env } from '#/env'

export const auth = betterAuth({
  // FIX: Added the second argument with the provider
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID ?? '',
      clientSecret: env.GITHUB_CLIENT_SECRET ?? '',
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
})