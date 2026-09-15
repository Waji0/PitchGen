import { Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function GenerationStatus({
  isFailed,
  onRetry,
}: {
  isFailed: boolean
  onRetry?: () => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
      {isFailed ? (
        <>
          <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Generation Failed</h2>
            <p className="text-muted-foreground max-w-md">
              We couldn't generate your slides. The AI might be overloaded or your prompt was too vague.
            </p>
          </div>
          {onRetry && (
            <Button onClick={onRetry}>Try Again</Button>
          )}
        </>
      ) : (
        <>
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="size-10 text-primary" />
            </div>
            <Loader2 className="absolute -bottom-2 -right-2 size-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Crafting your story...</h2>
            <p className="text-muted-foreground">
              Our AI is writing, designing, and generating images. This usually takes 10-20 seconds.
            </p>
          </div>
        </>
      )}
    </div>
  )
}