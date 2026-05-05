import { useState } from 'react'
import { Sparkles, MapPin, Crown, Bell, ChevronLeft, CheckCheck } from 'lucide-react'
import type { View } from '../nav'

type NotifKind = 'scan' | 'follow' | 'ai' | 'nearby' | 'system' | 'message'

type Notif = {
  id: string
  kind: NotifKind
  who?: string
  title: string
  body: string
  time: string
  unread: boolean
  group: 'today' | 'earlier'
}

const seed: Notif[] = [
  { id: '1', kind: 'scan',    who: 'Aung Kyaw', title: 'Aung Kyaw scanned your card',  body: 'At Yangon Tech Mixer',                       time: '2m',        unread: true,  group: 'today' },
  { id: '2', kind: 'follow',  who: 'Su Su',     title: 'Su Su started following you',   body: 'Product Designer · Frontiir',                time: '14m',       unread: true,  group: 'today' },
  { id: '3', kind: 'ai',                        title: 'Your AI card is ready',         body: 'Minimal Mono · view & share',                time: '1h',        unread: true,  group: 'today' },
  { id: '4', kind: 'nearby',                    title: '3 people nearby',               body: 'Open Nearby to swap cards',                  time: '3h',        unread: false, group: 'today' },
  { id: '5', kind: 'system',                    title: 'Welcome to Cardo Pro',          body: '7-day trial active',                         time: 'Yesterday', unread: false, group: 'earlier' },
  { id: '6', kind: 'message', who: 'Hla Min',   title: 'Hla Min sent you a message',    body: '"Great meeting you yesterday, let\'s..."',  time: '2d',        unread: false, group: 'earlier' },
  { id: '7', kind: 'scan',    who: 'Kyaw Soe',  title: 'Kyaw Soe saved your card',      body: 'Added to Designers',                         time: '3d',        unread: false, group: 'earlier' },
]

export function NotificationsScreen({ onBack, go: _go }: { onBack: () => void; go: (v: View) => void }) {
  const [items, setItems] = useState<Notif[]>(seed)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const visible = filter === 'unread' ? items.filter((n) => n.unread) : items
  const today = visible.filter((n) => n.group === 'today')
  const earlier = visible.filter((n) => n.group === 'earlier')
  const unreadCount = items.filter((n) => n.unread).length

  const markAllRead = () => setItems((xs) => xs.map((n) => ({ ...n, unread: false })))

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      {/* Minimal header — just a back button */}
      <header className="relative z-30 flex items-center px-3 pt-12 pb-2">
        <button
          onClick={onBack}
          className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80 backdrop-blur"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      </header>

      {/* Editorial title block */}
      <div className="px-5 pt-3 pb-6">
        <p className="text-[12px] font-medium text-ink-dim mb-2">Inbox</p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-[34px] font-bold tracking-tight leading-[1.05]">
            Activity
          </h1>
          {unreadCount > 0 && (
            <span className="text-[12px] font-medium text-ink-dim pb-1.5">
              <span className="text-ink font-semibold">{unreadCount}</span> unread
            </span>
          )}
        </div>
      </div>

      {/* Tabs + mark all read */}
      <div className="px-5 flex items-center justify-between mb-2">
        <div className="flex items-center gap-5">
          <Tab active={filter === 'all'} onClick={() => setFilter('all')}>All</Tab>
          <Tab active={filter === 'unread'} onClick={() => setFilter('unread')}>Unread</Tab>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-[12px] font-medium text-ink-muted hover:text-ink transition">
            <CheckCheck size={13} strokeWidth={2} />
            Mark all read
          </button>
        )}
      </div>

      <div className="px-5 pb-10">
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {today.length > 0 && (
              <Section label="Today">
                {today.map((n) => <NotifRow key={n.id} n={n} />)}
              </Section>
            )}
            {earlier.length > 0 && (
              <Section label="Earlier">
                {earlier.map((n) => <NotifRow key={n.id} n={n} />)}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-2.5 text-[13px] font-semibold transition
        ${active ? 'text-ink' : 'text-ink-dim hover:text-ink-muted'}`}
    >
      {children}
      {active && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ink rounded-full" />}
    </button>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line/50 pt-4 mt-2">
      <p className="text-[12px] font-medium text-ink-dim mb-1">{label}</p>
      <div>{children}</div>
    </div>
  )
}

function NotifRow({ n }: { n: Notif }) {
  return (
    <button className="group relative w-full flex items-start gap-3.5 py-4 border-b border-line/40 last:border-0 text-left">
      {/* Unread accent bar */}
      {n.unread && (
        <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 h-7 w-[2.5px] rounded-r-full bg-brand" />
      )}

      <Leading n={n} />

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-baseline gap-3">
          <p className={`flex-1 text-[14px] leading-snug truncate ${n.unread ? 'font-semibold text-ink' : 'font-medium text-ink/90'}`}>
            {n.title}
          </p>
          <span className="text-[11px] text-ink-dim flex-shrink-0 tabular-nums">{n.time}</span>
        </div>
        <p className="text-[12.5px] text-ink-dim mt-1 leading-relaxed line-clamp-1">{n.body}</p>
      </div>
    </button>
  )
}

function Leading({ n }: { n: Notif }) {
  // People-related notifications get an avatar — feels human, not stock.
  if (n.who && (n.kind === 'scan' || n.kind === 'follow' || n.kind === 'message')) {
    return <Avatar name={n.who} />
  }
  // System notifications get a quiet mono icon.
  const map: Record<NotifKind, React.ReactNode> = {
    scan:    null,
    follow:  null,
    message: null,
    ai:      <Sparkles size={14} strokeWidth={1.8} />,
    nearby:  <MapPin size={14} strokeWidth={1.8} />,
    system:  <Crown size={14} strokeWidth={1.8} />,
  }
  return (
    <div className="h-10 w-10 rounded-full border border-line/70 bg-surface/60 grid place-items-center text-ink-muted flex-shrink-0">
      {map[n.kind]}
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="h-10 w-10 rounded-full bg-surface-elevated border border-line/60 grid place-items-center flex-shrink-0">
      <span className="text-[12px] font-semibold tracking-tight text-ink">{initials}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center pt-20">
      <div className="h-14 w-14 rounded-full border border-line/60 grid place-items-center mb-4">
        <Bell size={20} className="text-ink-dim" strokeWidth={1.6} />
      </div>
      <p className="text-[15px] font-semibold">All caught up</p>
      <p className="text-[12.5px] text-ink-dim mt-1">Nothing new here.</p>
    </div>
  )
}
