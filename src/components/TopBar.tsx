import { Bell, ScanLine, User } from 'lucide-react'
import { me } from '../data'

export function TopBar({
  onBellClick,
  onScanClick,
  onProfileClick,
  hasUnread = true,
}: {
  onBellClick?: () => void
  onScanClick?: () => void
  onProfileClick?: () => void
  hasUnread?: boolean
}) {
  return (
    <header className="relative z-30 flex items-center justify-between px-5 pt-12 pb-4">
      <button
        onClick={onProfileClick}
        aria-label="Profile"
        className="flex items-center gap-2.5 -ml-1 pl-1 pr-3 py-1 rounded-full active:bg-surface-elevated transition min-w-0"
      >
        <span className="h-10 w-10 grid place-items-center rounded-full bg-surface-elevated border border-line/60 flex-shrink-0">
          <User size={17} className="text-ink/90" strokeWidth={1.8} />
        </span>
        <span className="text-left leading-tight min-w-0">
          <span className="block text-[14px] font-semibold text-ink truncate">{me.name}</span>
          <span className="block text-[11.5px] text-ink-dim truncate -mt-0.5">{me.role}</span>
        </span>
      </button>
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
