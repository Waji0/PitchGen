import { TriangleAlert } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function RouteError({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <TriangleAlert className="size-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">{error.message}</p>
      {reset && <Button onClick={reset}>Try again</Button>}
    </div>
  )
}