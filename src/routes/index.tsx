import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/lib/auth-functions'
import { Sparkles } from 'lucide-react'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    return { user: session.user }
  },
  component: DashboardPlaceholder,
})

function DashboardPlaceholder() {
  const { user } = Route.useRouteContext()

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="size-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">
          Welcome back,{' '}
          <span className="text-gradient-peach">{user.name}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Phase 1 complete! Dashboard coming in Phase 3.
        </p>
      </div>
    </main>
  )
}