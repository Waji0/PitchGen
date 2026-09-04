import { createFileRoute } from '@tanstack/react-router'
import { inngestHandler } from '#/integrations/inngest/serve'

export const Route = createFileRoute('/api/inngest/$')({
  server: {
    handlers: {
      GET: ({ request }) => inngestHandler(request),
      POST: ({ request }) => inngestHandler(request),
      PUT: ({ request }) => inngestHandler(request),
    },
  },
})