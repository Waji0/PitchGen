import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GripVertical, Edit3, Check, X, Sparkles, Loader2 } from 'lucide-react'
import { updateSlide, refineSlide } from '../actions/presentation-mutations'
import { presentationQueryKeys } from '../hooks/query-keys'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'

type Slide = {
  id: string
  order: number
  title: string
  content: string
  imageUrl?: string | null
}

export function SortableSlideCard({ slide, presentationId }: { slide: Slide; presentationId: string }) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [editTitle, setEditTitle] = useState(slide.title)
  const [editContent, setEditContent] = useState(slide.content)
  const [refinePrompt, setRefinePrompt] = useState('')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const invalidate = () => queryClient.invalidateQueries({ queryKey: presentationQueryKeys.detail(presentationId) })

  const saveMut = useMutation({
    mutationFn: () => updateSlide({ data: { id: slide.id, title: editTitle, content: editContent } }),
    onSuccess: () => { setIsEditing(false); invalidate(); toast.success('Slide updated') },
    onError: () => toast.error('Failed to save'),
  })

  const refineMut = useMutation({
    mutationFn: () => refineSlide({ data: { slideId: slide.id, instruction: refinePrompt } }),
    onSuccess: () => { setIsRefining(false); setRefinePrompt(''); invalidate(); toast.success('Slide rewritten by AI') },
    onError: () => toast.error('AI refinement failed'),
  })

  return (
    <div ref={setNodeRef} style={style} className="aspect-video glass rounded-xl flex flex-col relative overflow-hidden group border border-border/50">
      {/* Background Image */}
      {slide.imageUrl && (
        <img src={slide.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      )}

      {/* Drag Handle & Controls */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-1.5 hover:bg-white/10 rounded cursor-grab active:cursor-grabbing">
          <GripVertical className="size-4 text-muted-foreground" />
        </button>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-white/10 rounded">
            <Edit3 className="size-4 text-muted-foreground" />
          </button>
        ) : (
          <>
            <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="p-1.5 hover:bg-green-500/20 rounded text-green-400">
              {saveMut.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            </button>
            <button onClick={() => { setIsEditing(false); setEditTitle(slide.title); setEditContent(slide.content) }} className="p-1.5 hover:bg-red-500/20 rounded text-red-400">
              <X className="size-4" />
            </button>
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="text-xs text-primary font-bold mb-2">SLIDE {slide.order + 1}</div>
        
        {isEditing ? (
          <div className="flex flex-col gap-2 flex-1">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-black/40 text-foreground font-bold text-lg rounded px-2 py-1 border border-border"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-black/40 text-foreground text-sm flex-1 border border-border resize-none"
            />
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{slide.title}</h3>
            <div className="text-sm text-muted-foreground space-y-1 flex-1 overflow-hidden">
              {slide.content.split('\n').slice(0, 4).map((line, j) => (
                <p key={j} className="line-clamp-1">{line}</p>
              ))}
            </div>
          </>
        )}

        {/* AI Refine Section */}
        {isRefining ? (
          <div className="mt-3 flex gap-2">
            <input
              autoFocus
              placeholder="e.g. Make it punchier, add a joke..."
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              className="flex-1 bg-black/60 text-xs rounded px-2 py-1 border border-primary/50 text-foreground"
              onKeyDown={(e) => e.key === 'Enter' && refineMut.mutate()}
            />
            <button onClick={() => refineMut.mutate()} disabled={refineMut.isPending || !refinePrompt} className="text-primary">
              {refineMut.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsRefining(true)} 
            className="mt-3 text-xs text-primary/70 hover:text-primary flex items-center gap-1 w-fit"
          >
            <Sparkles className="size-3" /> AI Rewrite
          </button>
        )}
      </div>
    </div>
  )
}