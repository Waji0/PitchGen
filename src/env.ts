// import { createEnv } from '@t3-oss/env-core'
// import { z } from 'zod'

// export const env = createEnv({
//   server: {
//     DATABASE_URL: z.string().url(),
//     BETTER_AUTH_SECRET: z.string().min(1),
//     BETTER_AUTH_URL: z.string().url(),
//     GOOGLE_CLIENT_ID: z.string().optional(),
//     GOOGLE_CLIENT_SECRET: z.string().optional(),
//     GITHUB_CLIENT_ID: z.string().optional(),
//     GITHUB_CLIENT_SECRET: z.string().optional(),
//     GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
//     INNGEST_EVENT_KEY: z.string().optional(),
//     INNGEST_SIGNING_KEY: z.string().optional(),
//     IMAGEKIT_PUBLIC_KEY: z.string().optional(),
//     IMAGEKIT_PRIVATE_KEY: z.string().optional(),
//     IMAGEKIT_URL_ENDPOINT: z.string().optional(),
//   },
//   client: {
//     VITE_APP_TITLE: z.string().min(1).default('PitchGen'),
//     VITE_APP_URL: z.string().url().default('http://localhost:3000'),
//   },
//   clientPrefix: 'VITE_',
//   runtimeEnv: import.meta.env,
//   emptyStringAsUndefined: true,
// })


import 'dotenv/config'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    
    // ADDED: OAuth variables
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_TITLE: z.string().min(1).default('PitchGen'),
    VITE_APP_URL: z.string().url().default('http://localhost:3000'),
  },
  runtimeEnv: {
    // Server variables (from process.env)
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    
    // Client variables (from import.meta.env)
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})