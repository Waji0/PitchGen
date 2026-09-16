// import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
// import { useState } from 'react'
// import { ArrowLeft, RefreshCw, Trash2, Play } from 'lucide-react'
// import { toast } from 'sonner'

// import { getSession } from '#/lib/auth-functions'
// import { usePresentationDetail } from '#/features/presentations/hooks/use-presentation-detail'
// import { GenerationStatus } from '#/features/presentations/components/generation-status'
// import { SlideshowModal } from '#/features/presentations/components/slideshow-modal'
// import { Button } from '#/components/ui/button'

// export const Route = createFileRoute('/presentations/$presentationId')({
//   beforeLoad: async () => {
//     const session = await getSession()
//     if (!session) throw redirect({ to: '/login' })
//   },
//   component: PresentationDetail,
// })

// function PresentationDetail() {
//   const { presentationId } = Route.useParams()
//   const navigate = useNavigate()
//   const [showSlideshow, setShowSlideshow] = useState(false)

//   const {
//     query,
//     slides,
//     isGenerating,
//     isFailed,
//     regenerateMut,
//     deleteMut,
//   } = usePresentationDetail(presentationId, {
//     onDeleted: () => navigate({ to: '/' }),
//   })

//   if (query.isLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//       </div>
//     )
//   }

//   return (
//     <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
//       <header className="flex items-center justify-between">
//         <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
//           <ArrowLeft className="size-4 mr-2" /> Back to Dashboard
//         </Button>
        
//         {!isGenerating && (
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => regenerateMut.mutate()} disabled={regenerateMut.isPending}>
//               <RefreshCw className={`size-4 mr-2 ${regenerateMut.isPending ? 'animate-spin' : ''}`} /> Regenerate
//             </Button>
//             <Button variant="destructive" onClick={() => {
//               if (confirm('Delete this deck?')) deleteMut.mutate()
//             }} disabled={deleteMut.isPending}>
//               <Trash2 className="size-4 mr-2" /> Delete
//             </Button>
//           </div>
//         )}
//       </header>

//       {(isGenerating || isFailed) ? (
//         <GenerationStatus 
//           isFailed={isFailed} 
//           onRetry={() => regenerateMut.mutate()} 
//         />
//       ) : (
//         <>
//           <div className="flex justify-end">
//             <Button size="lg" onClick={() => setShowSlideshow(true)} className="rounded-xl px-8 gap-2 font-semibold">
//               <Play className="size-5" /> Present
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {slides.map((slide, i) => (
//               <div key={slide.id} className="aspect-video glass rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all">
//                 {slide.imageUrl && (
//                   <img src={slide.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" />
//                 )}
//                 <div className="relative z-10 flex flex-col h-full">
//                   <div className="text-xs text-primary font-bold mb-2">SLIDE {i + 1}</div>
//                   <h3 className="text-xl font-bold mb-3 line-clamp-2">{slide.title}</h3>
//                   <div className="text-sm text-muted-foreground space-y-1 flex-1 overflow-hidden">
//                     {slide.content.split('\n').slice(0, 3).map((line, j) => (
//                       <p key={j} className="line-clamp-1">{line}</p>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {showSlideshow && (
//         <SlideshowModal slides={slides} onClose={() => setShowSlideshow(false)} />
//       )}
//     </main>
//   )
// }






// import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
// import { useState } from 'react'
// import { ArrowLeft, RefreshCw, Trash2, Play, Download } from 'lucide-react'
// import { toast } from 'sonner'

// import { getSession } from '#/lib/auth-functions'
// import { usePresentationDetail } from '#/features/presentations/hooks/use-presentation-detail'
// import { GenerationStatus } from '#/features/presentations/components/generation-status'
// import { SlideshowModal } from '#/features/presentations/components/slideshow-modal'
// import { exportToPptx } from '#/features/presentations/lib/export-pptx'
// import { Button } from '#/components/ui/button'

// export const Route = createFileRoute('/presentations/$presentationId')({
//   beforeLoad: async () => {
//     const session = await getSession()
//     if (!session) throw redirect({ to: '/login' })
//   },
//   component: PresentationDetail,
// })

// function PresentationDetail() {
//   const { presentationId } = Route.useParams()
//   const navigate = useNavigate()
//   const [showSlideshow, setShowSlideshow] = useState(false)

//   const {
//     query,
//     slides,
//     isGenerating,
//     isFailed,
//     regenerateMut,
//     deleteMut,
//   } = usePresentationDetail(presentationId, {
//     onDeleted: () => navigate({ to: '/' }),
//   })

//   const handleExport = async () => {
//     if (!query.data) return
//     toast.promise(
//       exportToPptx(query.data.title, slides, query.data.style),
//       {
//         loading: 'Generating PowerPoint file...',
//         success: 'Download started!',
//         error: 'Failed to export presentation',
//       }
//     )
//   }

//   if (query.isLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//       </div>
//     )
//   }

//   return (
//     <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
//       <header className="flex items-center justify-between">
//         <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
//           <ArrowLeft className="size-4 mr-2" /> Back
//         </Button>
        
//         {!isGenerating && (
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => regenerateMut.mutate()} disabled={regenerateMut.isPending}>
//               <RefreshCw className={`size-4 mr-2 ${regenerateMut.isPending ? 'animate-spin' : ''}`} /> Regenerate
//             </Button>
//             <Button variant="destructive" onClick={() => {
//               if (confirm('Delete this deck?')) deleteMut.mutate()
//             }} disabled={deleteMut.isPending}>
//               <Trash2 className="size-4 mr-2" /> Delete
//             </Button>
//           </div>
//         )}
//       </header>

//       {(isGenerating || isFailed) ? (
//         <GenerationStatus 
//           isFailed={isFailed} 
//           onRetry={() => regenerateMut.mutate()} 
//         />
//       ) : (
//         <>
//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" size="lg" onClick={handleExport} className="rounded-xl px-6 gap-2">
//               <Download className="size-5" /> Export PPTX
//             </Button>
//             <Button size="lg" onClick={() => setShowSlideshow(true)} className="rounded-xl px-6 gap-2 font-semibold">
//               <Play className="size-5" /> Present
//             </Button>
//           </div>

//           {/* Slide Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {slides.map((slide, i) => (
//               <div key={slide.id} className="aspect-video glass rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all">
//                 {slide.imageUrl && (
//                   <img src={slide.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" />
//                 )}
//                 <div className="relative z-10 flex flex-col h-full">
//                   <div className="text-xs text-primary font-bold mb-2">SLIDE {i + 1}</div>
//                   <h3 className="text-xl font-bold mb-3 line-clamp-2">{slide.title}</h3>
//                   <div className="text-sm text-muted-foreground space-y-1 flex-1 overflow-hidden">
//                     {slide.content.split('\n').slice(0, 3).map((line, j) => (
//                       <p key={j} className="line-clamp-1">{line}</p>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {showSlideshow && (
//         <SlideshowModal slides={slides} onClose={() => setShowSlideshow(false)} />
//       )}
//     </main>
//   )
// }








import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, RefreshCw, Trash2, Play, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

import { getSession } from '#/lib/auth-functions'
import { usePresentationDetail } from '#/features/presentations/hooks/use-presentation-detail'
import { GenerationStatus } from '#/features/presentations/components/generation-status'
import { SlideshowModal } from '#/features/presentations/components/slideshow-modal'
import { SortableSlideCard } from '#/features/presentations/components/slide-card'
import { exportToPptx } from '#/features/presentations/lib/export-pptx'
import { reorderSlides } from '#/features/presentations/actions/presentation-mutations'
import { presentationQueryKeys } from '#/features/presentations/hooks/query-keys'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/presentations/$presentationId')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
  },
  component: PresentationDetail,
})

function PresentationDetail() {
  const { presentationId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showSlideshow, setShowSlideshow] = useState(false)

  const {
    query,
    slides,
    isGenerating,
    isFailed,
    regenerateMut,
    deleteMut,
  } = usePresentationDetail(presentationId, {
    onDeleted: () => navigate({ to: '/' }),
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const reorderMut = useMutation({
    mutationFn: (slideIds: string[]) => reorderSlides({ data: { presentationId, slideIds } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: presentationQueryKeys.detail(presentationId) }),
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id)
      const newIndex = slides.findIndex((s) => s.id === over.id)
      const newOrder = arrayMove(slides, oldIndex, newIndex)
      
      // Optimistic UI update & DB save
      reorderMut.mutate(newOrder.map(s => s.id))
    }
  }

  const handleExport = async () => {
    if (!query.data) return
    toast.promise(exportToPptx(query.data.title, slides, query.data.style), {
      loading: 'Generating PowerPoint file...',
      success: 'Download started!',
      error: 'Failed to export presentation',
    })
  }

  if (query.isLoading) {
    return <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <header className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}><ArrowLeft className="size-4 mr-2" /> Back</Button>
        {!isGenerating && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => regenerateMut.mutate()} disabled={regenerateMut.isPending}>
              <RefreshCw className={`size-4 mr-2 ${regenerateMut.isPending ? 'animate-spin' : ''}`} /> Regenerate
            </Button>
            <Button variant="destructive" onClick={() => { if (confirm('Delete this deck?')) deleteMut.mutate() }} disabled={deleteMut.isPending}>
              <Trash2 className="size-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </header>

      {(isGenerating || isFailed) ? (
        <GenerationStatus isFailed={isFailed} onRetry={() => regenerateMut.mutate()} />
      ) : (
        <>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="lg" onClick={handleExport} className="rounded-xl px-6 gap-2">
              <Download className="size-5" /> Export PPTX
            </Button>
            <Button size="lg" onClick={() => setShowSlideshow(true)} className="rounded-xl px-6 gap-2 font-semibold">
              <Play className="size-5" /> Present
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">Drag slides to reorder • Hover to edit • Use AI to rewrite</p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={slides.map(s => s.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide) => (
                  <SortableSlideCard key={slide.id} slide={slide} presentationId={presentationId} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {showSlideshow && <SlideshowModal slides={slides} onClose={() => setShowSlideshow(false)} />}
    </main>
  )
}