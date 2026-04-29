import { Bell, ScanLine } from 'lucide-react'

export function TopBar({
  onBellClick,
  onScanClick,
  hasUnread = true,
}: {
  onBellClick?: () => void
  onScanClick?: () => void
  hasUnread?: boolean
}) {
  return (
    <header className="relative z-30 flex items-center justify-between px-5 pt-12 pb-4">
      <div className="flex items-center gap-2.5">
        <CardoMark />
        <span className="text-[19px] font-bold tracking-tight">
          CARDO<span className="text-brand">.</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onBellClick}
          className="relative h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/60 backdrop-blur hover:border-brand/50 transition"
          aria-label="Notifications"
        >
          <Bell size={17} className="text-ink/90" strokeWidth={1.8} />
          {hasUnread && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand ring-2 ring-canvas" />}
        </button>
        {onScanClick && (
          <button
            onClick={onScanClick}
            className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/60 backdrop-blur hover:border-brand/50 transition"
            aria-label="Scan card"
          >
            <ScanLine size={18} className="text-ink/90" strokeWidth={1.8} />
          </button>
        )}
      </div>
    </header>
  )
}

function CardoMark() {
  return (
    <div className="relative h-9 w-9 rounded-[10px] bg-gradient-to-br from-white to-white/85 grid place-items-center shadow-glow">
      <span className="font-black text-[18px] -tracking-[0.04em] text-canvas leading-none">C</span>
      <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-brand" />
    </div>
  )
}
