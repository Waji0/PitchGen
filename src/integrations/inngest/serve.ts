import { serve } from 'inngest/edge' // fetch-based adapter (works with TanStack Start)
import { inngest } from './client'
import { functions } from './functions'

export const inngestHandler = serve({ client: inngest, functions })