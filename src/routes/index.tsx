// import { createFileRoute, redirect } from '@tanstack/react-router'
// import { getSession } from '#/lib/auth-functions'
// import { Sparkles } from 'lucide-react'

// export const Route = createFileRoute('/')({
//   beforeLoad: async ({ location }) => {
//     const session = await getSession()
//     if (!session) {
//       throw redirect({
//         to: '/login',
//         search: { redirect: location.href },
//       })
//     }
//     return { user: session.user }
//   },
//   component: DashboardPlaceholder,
// })

// function DashboardPlaceholder() {
//   const { user } = Route.useRouteContext()

//   return (
//     <main className="min-h-screen pt-24 pb-12 px-4">
//       <div className="max-w-4xl mx-auto text-center">
//         <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
//           <Sparkles className="size-8 text-primary" />
//         </div>
//         <h1 className="text-4xl font-bold mb-3">
//           Welcome back,{' '}
//           <span className="text-gradient-peach">{user.name}</span>
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           Phase 1 complete! Dashboard coming in Phase 3.
//         </p>
//       </div>
//     </main>
//   )
// }


import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'

import { getSession } from '#/lib/auth-functions'
import { createPresentation } from '#/features/presentations/actions/presentation-mutations'
import { listPresentations } from '#/features/presentations/api/presentation-queries'
import { presentationQueryKeys } from '#/features/presentations/hooks/query-keys'

import { SLIDE_STYLES, TONE_OPTIONS, LAYOUT_OPTIONS, PRESENTATION_TEMPLATES } from '#/features/presentations/constants/presentation-options'
import { PresentationCard } from '#/features/presentations/components/presentation-card'

import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Slider } from '#/components/ui/slider'

import { Skeleton } from '#/components/ui/skeleton'
import { Presentation } from 'lucide-react'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login', search: { redirect: location.href } })
    return { user: session.user }
  },
  component: Dashboard,
})

function Dashboard() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    prompt: '',
    slideCount: 8,
    style: 'MINIMAL' as const,
    tone: 'PROFESSIONAL' as const,
    layout: 'BALANCED' as const,
  })

  // const { data: presentations = [] } = useQuery({
  //   queryKey: presentationQueryKeys.list(),
  //   queryFn: () => listPresentations(),
  // })

  const { data: presentations = [], isPending } = useQuery({
  queryKey: presentationQueryKeys.list(),
  queryFn: () => listPresentations(),
  })

  const createMut = useMutation({
    mutationFn: () => createPresentation({ data: form }),
    onSuccess: (p) => {
      toast.success('Generating your deck...')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      window.location.href = `/presentations/${p.id}`
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Failed to create'),
  })

  const handleGenerate = () => {
    if (!form.prompt.trim()) return toast.error('Please enter a topic')
    createMut.mutate()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      <header className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold">
          Make your story{" "}
          <span className="text-gradient-peach">impossible to ignore</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Enter your topic, notes, or outline. PitchGen's AI will write, design,
          and illustrate a complete presentation.
        </p>
      </header>

      <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
        <Textarea
          placeholder="e.g. 'A pitch deck for a B2B SaaS startup focusing on AI-driven customer support...'"
          value={form.prompt}
          // onChange={(e) => setForm((s) => ({ ...s, prompt: e.target.value }))}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setForm((s) => ({ ...s, prompt: e.target.value }))
          }
          className="min-h-[140px] text-base bg-background/50 border-border/50 rounded-xl resize-none focus-visible:ring-primary/30"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">
              Slides: {form.slideCount}
            </Label>
            <Slider
              value={[form.slideCount]}
              // onValueChange={([v]) => setForm((s) => ({ ...s, slideCount: v }))}
              onValueChange={([v]: [number]) =>
                setForm((s) => ({ ...s, slideCount: v }))
              }
              min={3}
              max={20}
              step={1}
            />
          </div>
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Style</Label>
            <Select
              value={form.style}
              // onValueChange={(v: any) => setForm((s) => ({ ...s, style: v }))}
              onValueChange={(v: string) =>
                setForm((s) => ({ ...s, style: v as any }))
              }
            >
              <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                {SLIDE_STYLES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Tone</Label>
            <Select
              value={form.tone}
              // onValueChange={(v: any) => setForm((s) => ({ ...s, tone: v }))}
              onValueChange={(v: string) =>
                setForm((s) => ({ ...s, tone: v as any }))
              }
            >
              <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                {TONE_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Layout</Label>
            <Select
              value={form.layout}
              // onValueChange={(v: any) => setForm((s) => ({ ...s, layout: v }))}
              onValueChange={(v: string) =>
                setForm((s) => ({ ...s, layout: v as any }))
              }
            >
              <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                {LAYOUT_OPTIONS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={createMut.isPending}
            className="rounded-xl px-8 gap-2 font-semibold"
          >
            {createMut.isPending ? (
              <>
                <Sparkles className="size-5 animate-pulse" /> Creating...
              </>
            ) : (
              <>
                <Wand2 className="size-5" /> Generate Pitch
              </>
            )}
          </Button>
        </div>
      </div>

      {presentations.length > 0 && (
        // <section className="space-y-4">
        //   <h2 className="text-2xl font-bold flex items-center gap-2">Your Decks</h2>
        //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        //     {presentations.map((p) => <PresentationCard key={p.id} p={p} />)}
        //   </div>
        // </section>

        // replace the presentations list section with:
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Your Decks
          </h2>
          {isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : presentations.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Presentation className="size-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No decks yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your generated presentations will appear here. Create your first
                pitch above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presentations.map((p) => (
                <PresentationCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}