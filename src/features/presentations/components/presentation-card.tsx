import { Link } from '@tanstack/react-router'
import { FileText, Clock } from 'lucide-react'

type Presentation = {
  id: string
  title: string
  slideCount: number
  updatedAt: string | Date
  status: string
}

export function PresentationCard({ p }: { p: Presentation }) {
  return (
    <Link
      to="/presentations/$presentationId"
      params={{ presentationId: p.id }}
      className="group block glass rounded-xl p-5 hover:bg-card/80 transition-all hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between mb-3">
        <FileText className="size-5 text-primary" />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          p.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
          p.status === 'GENERATING' ? 'bg-blue-500/20 text-blue-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {p.status}
        </span>
      </div>
      <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
        {p.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{p.slideCount} slides</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {new Date(p.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  )
}