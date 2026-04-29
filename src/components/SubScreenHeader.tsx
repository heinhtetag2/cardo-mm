import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export function SubScreenHeader({
  title,
  onBack,
  right,
  variant = 'default',
}: {
  title?: string
  onBack: () => void
  right?: ReactNode
  variant?: 'default' | 'overlay'
}) {
  return (
    <header className={`relative z-30 flex items-center justify-between px-3 pt-12 pb-3
      ${variant === 'overlay' ? 'bg-transparent' : 'bg-canvas/80 backdrop-blur'}`}>
      <button
        onClick={onBack}
        className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80 backdrop-blur"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
      {title && <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold tracking-tight">{title}</h1>}
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}
