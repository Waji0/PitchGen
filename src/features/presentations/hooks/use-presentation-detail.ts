// import { useEffect, useState } from 'react'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'sonner'
// import { presentationQueryKeys } from './query-keys'
// import { getPresentationWithSlides } from '../api/presentation-queries'
// import {
//   deletePresentation,
//   regeneratePresentation,
//   updatePresentation,
// } from '../actions/presentation-mutations'
// import type { PresentationStyle, PresentationTone, PresentationLayout } from 

// type SettingsForm = {
//   title: string
//   prompt: string
//   slideCount: number
//   style: PresentationStyle
//   tone: PresentationTone
//   layout: PresentationLayout
// }


import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { presentationQueryKeys } from './query-keys'
import { getPresentationWithSlides } from '../api/presentation-queries'
import {
  deletePresentation,
  regeneratePresentation,
  updatePresentation,
} from '../actions/presentation-mutations'

// Bypass Prisma import issues by using literal string types
type SettingsForm = {
  title: string
  prompt: string
  slideCount: number
  style: 'MINIMAL' | 'BOLD' | 'CORPORATE' | 'CREATIVE' | 'ACADEMIC' | 'DARK'
  tone: 'PROFESSIONAL' | 'CASUAL' | 'INSPIRATIONAL' | 'TECHNICAL' | 'PERSUASIVE' | 'STORYTELLING'
  layout: 'BALANCED' | 'IMAGE_HEAVY' | 'TEXT_HEAVY' | 'MINIMAL' | 'SPLIT'
}



export function usePresentationDetail(
  presentationId: string,
  opts?: { onDeleted?: () => void }
) {
  const queryClient = useQueryClient()

  // IMPROVEMENT: Smart polling. Only polls every 3s while status is GENERATING
  const query = useQuery({
    queryKey: presentationQueryKeys.detail(presentationId),
    queryFn: () => getPresentationWithSlides({ data: { id: presentationId } }),
    refetchInterval: (q) =>
      q.state.data?.status === 'GENERATING' ? 3000 : false,
  })

  const [form, setForm] = useState<SettingsForm>({
    title: '',
    prompt: '',
    slideCount: 8,
    style: 'MINIMAL',
    tone: 'PROFESSIONAL',
    layout: 'BALANCED',
  })

//   useEffect(() => {
//     if (!query.data) return
//     setForm({
//       title: query.data.title,
//       prompt: query.data.prompt,
//       slideCount: query.data.slideCount,
//       style: query.data.style,
//       tone: query.data.tone,
//       layout: query.data.layout,
//     })
//   }, [query.data])

  useEffect(() => {
    if (!query.data) return
    setForm({
      title: query.data.title,
      prompt: query.data.prompt,
      slideCount: query.data.slideCount,
      style: query.data.style as SettingsForm['style'],
      tone: query.data.tone as SettingsForm['tone'],
      layout: query.data.layout as SettingsForm['layout'],
    })
  }, [query.data])

  const updateMut = useMutation({
    mutationFn: () =>
      updatePresentation({ data: { id: presentationId, ...form } }),
    onSuccess: () => {
      toast.success('Saved')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.detail(presentationId) })
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Failed to save'),
  })

  const regenerateMut = useMutation({
    mutationFn: () => regeneratePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success('Regenerating...')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.detail(presentationId) })
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Failed to regenerate'),
  })

  const deleteMut = useMutation({
    mutationFn: () => deletePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success('Deleted')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      queryClient.removeQueries({ queryKey: presentationQueryKeys.detail(presentationId) })
      opts?.onDeleted?.()
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Failed to delete'),
  })

  return {
    query,
    slides: query.data?.slides ?? [],
    isGenerating: query.data?.status === 'GENERATING',
    isFailed: query.data?.status === 'FAILED',
    form,
    setForm,
    updateMut,
    regenerateMut,
    deleteMut,
  }
}