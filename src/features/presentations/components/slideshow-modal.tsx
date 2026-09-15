import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type Slide = {
  id: string
  order: number
  title: string
  content: string
  notes?: string | null
  imageUrl?: string | null
}

export function SlideshowModal({
  slides,
  onClose,
}: {
  slides: Slide[]
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, slides.length - 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [slides, onClose])

  const slide = slides[index]
  if (!slide) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-10">
        <X className="size-8" />
      </button>
      
      <button 
        onClick={() => setIndex((i) => Math.max(i - 1, 0))} 
        disabled={index === 0}
        className="absolute left-6 text-white/70 hover:text-white disabled:opacity-30 z-10"
      >
        <ChevronLeft className="size-12" />
      </button>
      
      <div className="w-full max-w-5xl aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-12 flex flex-col justify-center items-center text-center relative overflow-hidden border border-white/10">
        {slide.imageUrl && (
          <img src={slide.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white">{slide.title}</h2>
          <div className="text-xl md:text-2xl text-white/80 max-w-3xl space-y-3">
            {slide.content.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('•') ? '' : ''}>{line}</p>
            ))}
          </div>
          {slide.notes && (
            <div className="mt-8 pt-6 border-t border-white/20 text-white/50 text-sm max-w-2xl italic">
              Speaker Notes: {slide.notes}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))} 
        disabled={index === slides.length - 1}
        className="absolute right-6 text-white/70 hover:text-white disabled:opacity-30 z-10"
      >
        <ChevronRight className="size-12" />
      </button>

      <div className="absolute bottom-6 text-white/50 text-sm font-mono">
        {index + 1} / {slides.length}
      </div>
    </div>
  )
}