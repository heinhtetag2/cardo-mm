import { useMemo, useState } from 'react'
import {
  ArrowUpRight, ArrowDownRight, Calendar, ArrowRight, Users, Sparkles, IdCard, Trophy,
  CheckCircle2, Eye, Wand2, Radio, Star, ChevronDown, Bell,
} from 'lucide-react'
import { Sidebar, type DashPage } from './Sidebar'
import { AreaChart } from './AreaChart'
import {
  DASH_USER, DASH_STATS, TAG_BREAKDOWN, RECENT_ACTIVITY, RANGE_OPTIONS, getRangeData,
  DASH_NOTIFICATIONS, type DashRange, type ActivityKind,
} from './data'
import { MyCardsPage } from './pages/MyCardsPage'
import { ContactsPage } from './pages/ContactsPage'
import { AIStudioPage } from './pages/AIStudioPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { SettingsPage } from './pages/SettingsPage'
import { HelpPage } from './pages/HelpPage'

export function DashboardApp({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<DashPage>('home')

  return (
    <div className="fixed inset-0 z-50 flex bg-white text-[#1A1A1A] font-sans overflow-hidden animate-fade-in">
      <Sidebar page={page} onNavigate={setPage} onExit={onExit} />
      <main className="flex-1 overflow-hidden flex flex-col relative min-w-0 bg-[#FAFAFA]">
        {page === 'home' && <HomePage onNavigate={setPage} />}
        {page === 'my-cards' && <MyCardsPage />}
        {page === 'contacts' && <ContactsPage />}
        {page === 'ai-studio' && <AIStudioPage />}
        {page === 'analytics' && <AnalyticsPage />}
        {page === 'wallet' && <SubscriptionPage />}
        {page === 'settings' && <SettingsPage />}
        {page === 'help' && <HelpPage />}
      </main>
    </div>
  )
}

function HomePage({ onNavigate }: { onNavigate: (p: DashPage) => void }) {
  const [range, setRange] = useState<DashRange>('30d')
  const data = useMemo(() => getRangeData(range), [range])

  const stats = [
    {
      title: 'Saved contacts',
      value: DASH_STATS.savedContacts.toString(),
      Icon: Users,
      subtitle: 'Lifetime collection',
      accent: true,
      onClick: () => onNavigate('contacts'),
    },
    {
      title: 'This month',
      value: `+${DASH_STATS.thisMonthAdded}`,
      Icon: IdCard,
      subtitle: 'New contacts in April',
      onClick: () => onNavigate('contacts'),
    },
    {
      title: 'My card scans',
      value: DASH_STATS.myCardScans.toLocaleString(),
      Icon: Eye,
      subtitle: `${DASH_STATS.myCardScansThisMonth} this month`,
      onClick: () => onNavigate('analytics'),
    },
    {
      title: 'AI credits',
      value: `${DASH_STATS.aiCreditsLeft}/${DASH_STATS.aiCreditsCap}`,
      Icon: Sparkles,
      subtitle: 'Left this month',
      progress: (DASH_STATS.aiCreditsLeft / DASH_STATS.aiCreditsCap) * 100,
      onClick: () => onNavigate('ai-studio'),
    },
  ]

  const tagMax = Math.max(...TAG_BREAKDOWN.map((t) => t.count), 1)
  const unread = DASH_NOTIFICATIONS.filter((n) => n.unread).length

  return (
    <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">
            Welcome back, {DASH_USER.firstName}
          </h1>
          <p className="text-[13.5px] text-[#616161] mt-1">
            Your network, AI usage, and engagement at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative h-11 w-11 inline-flex items-center justify-center bg-white border border-[#EBEBEB] rounded-2xl hover:bg-[#FAFAFA] transition">
            <Bell className="w-4 h-4 text-[#1A1A1A]" />
            {unread > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF3C21] ring-2 ring-white" />
            )}
          </button>
          <button
            onClick={() => onNavigate('my-cards')}
            className="h-11 px-5 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] hover:opacity-95 text-white text-[13.5px] font-semibold rounded-xl transition shadow-sm"
          >
            Share my card
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust level banner */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 sm:p-6 mb-6 flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FEFCE8] to-[#FCD34D] grid place-items-center shrink-0">
          <Trophy className="w-6 h-6 text-[#A16207]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-[#1A1A1A]">
            Trust Level {DASH_STATS.trustLevel} · {DASH_STATS.trustLevelLabel}
          </div>
          <div className="text-[11.5px] text-[#616161] mt-0.5">
            {DASH_STATS.savedContacts} of {DASH_STATS.trustNextThreshold} saves until next level
          </div>
          <div className="h-1.5 w-full bg-[#F3F3F3] rounded-full overflow-hidden mt-2.5">
            <div className="h-full bg-gradient-to-r from-[#FCD34D] to-[#F59E0B]" style={{ width: `${(DASH_STATS.savedContacts / DASH_STATS.trustNextThreshold) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <button
            key={s.title}
            onClick={s.onClick}
            className="text-left bg-white border border-[#EBEBEB] rounded-2xl p-6 flex flex-col justify-center hover:border-[#5B8DEF]/40 transition group"
          >
            <div className="flex justify-between items-start mb-5">
              <span className="text-[12.5px] font-medium text-[#616161]">{s.title}</span>
              <div className={`p-2 rounded-xl transition ${s.accent ? 'bg-[#EEF2FF] text-[#5B8DEF] group-hover:bg-[#5B8DEF] group-hover:text-white' : 'bg-[#F3F3F3] text-[#4A4A4A] group-hover:bg-[#5B8DEF] group-hover:text-white'}`}>
                <s.Icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-[34px] font-bold tabular-nums truncate leading-none ${s.accent ? 'text-[#5B8DEF]' : 'text-[#1A1A1A]'}`}>
              {s.value}
            </div>
            <div className="text-[11.5px] text-[#4A4A4A] mt-2.5">{s.subtitle}</div>
            {s.progress !== undefined && (
              <div className="h-1 w-full bg-[#F3F3F3] rounded-full overflow-hidden mt-3">
                <div className="h-full bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] transition-all" style={{ width: `${s.progress}%` }} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Network growth chart */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 sm:p-7 mb-6">
        <div className="flex justify-between items-start mb-6 gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Network growth</h2>
            <p className="text-[11.5px] text-[#616161] mt-0.5 mb-3">
              New contacts added {RANGE_OPTIONS.find((o) => o.value === range)?.label.toLowerCase()}
            </p>
            <div className="flex items-baseline gap-2">
              <div className="text-[34px] font-bold text-[#1A1A1A] tabular-nums leading-none">+{data.total}</div>
              <div className={`text-[11.5px] font-medium flex items-center gap-0.5 ${data.trend >= 0 ? 'text-[#047857]' : 'text-[#DC2626]'}`}>
                {data.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(data.trend).toFixed(1)}%
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-[#616161] mt-2 tabular-nums flex-wrap">
              <span>{data.surveys} contacts</span>
              <span className="text-[#D4D4D4]">·</span>
              <span>Avg {data.avg} {data.bucket === 'day' ? '/ day' : '/ week'}</span>
            </div>
          </div>
          <RangeSelect value={range} onChange={setRange} />
        </div>
        <AreaChart points={data.points} height={240} />
      </div>

      {/* Two-up: tag breakdown + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pb-8">
        <div className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 pb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Contacts by tag</h2>
              <p className="text-[11.5px] text-[#616161] mt-0.5">How your network breaks down</p>
            </div>
            <button onClick={() => onNavigate('contacts')} className="flex items-center gap-1 text-[11.5px] font-medium text-[#5B8DEF] hover:text-[#4A7AD9] transition shrink-0">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="border-t border-[#F3F3F3] px-5 sm:px-6 py-4 space-y-3.5">
            {TAG_BREAKDOWN.map((row) => {
              const pct = (row.count / tagMax) * 100
              return (
                <li key={row.tag}>
                  <div className="flex items-center justify-between mb-1.5 text-[11.5px]">
                    <span className="font-medium text-[#1A1A1A]">{row.tag}</span>
                    <span className="flex items-center gap-2 text-[#616161] tabular-nums">
                      <span>{row.count} contacts</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F3F3F3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 pb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Recent activity</h2>
              <p className="text-[11.5px] text-[#616161] mt-0.5">Latest cards, scans, and AI runs</p>
            </div>
            <button className="flex items-center gap-1 text-[11.5px] font-medium text-[#5B8DEF] hover:text-[#4A7AD9] transition shrink-0">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ol className="divide-y divide-[#F3F3F3] border-t border-[#F3F3F3]">
            {RECENT_ACTIVITY.map((ev, i) => {
              const { Icon, tone } = activityIcon(ev.kind)
              const pill = activityPill(ev.kind)
              return (
                <li key={i}>
                  <button className="w-full flex items-center gap-3 px-5 sm:px-6 py-3.5 text-left hover:bg-[#FAFAFA] transition">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13.5px] font-medium text-[#1A1A1A] truncate">{ev.primary}</span>
                        {pill && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${pill.tone}`}>
                            {pill.label}
                          </span>
                        )}
                      </div>
                      <div className="text-[11.5px] text-[#616161] mt-0.5">{ev.secondary} · {formatShortDate(ev.date)}</div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

function RangeSelect({ value, onChange }: { value: DashRange; onChange: (v: DashRange) => void }) {
  const [open, setOpen] = useState(false)
  const current = RANGE_OPTIONS.find((o) => o.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-10 px-3.5 inline-flex items-center gap-2 bg-white border border-[#EBEBEB] rounded-xl text-[12.5px] font-medium text-[#1A1A1A] hover:bg-[#FAFAFA] transition"
      >
        <Calendar className="w-3.5 h-3.5 text-[#616161]" />
        {current?.label}
        <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
      </button>
      {open && (
        <>
          <button onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" aria-hidden />
          <div className="absolute right-0 top-full mt-1.5 z-20 w-44 bg-white border border-[#EBEBEB] rounded-xl shadow-lg p-1.5">
            {RANGE_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-[12.5px] rounded-lg transition ${value === o.value ? 'bg-[#EEF2FF] text-[#5B8DEF] font-semibold' : 'text-[#303030] hover:bg-[#F3F3F3]'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function activityIcon(kind: ActivityKind) {
  const tone = 'bg-[#F3F3F3] text-[#4A4A4A]'
  switch (kind) {
    case 'saved': return { Icon: CheckCircle2, tone: 'bg-[#ECFDF5] text-[#047857]' }
    case 'scanned': return { Icon: Eye, tone: 'bg-[#EEF2FF] text-[#5B8DEF]' }
    case 'ai-gen': return { Icon: Wand2, tone: 'bg-[#F5F3FF] text-[#8B5CF6]' }
    case 'exchanged': return { Icon: Radio, tone: 'bg-[#FFF7ED] text-[#C2410C]' }
    case 'level-up': return { Icon: Trophy, tone: 'bg-[#FEFCE8] text-[#A16207]' }
    case 'pro-upgrade': return { Icon: Star, tone: 'bg-[#FFF1EE] text-[#FF3C21]' }
    default: return { Icon: CheckCircle2, tone }
  }
}

function activityPill(kind: ActivityKind): { tone: string; label: string } | null {
  switch (kind) {
    case 'ai-gen': return { tone: 'text-[#8B5CF6] bg-[#F5F3FF]', label: 'AI' }
    case 'level-up': return { tone: 'text-[#A16207] bg-[#FEFCE8]', label: 'Level up' }
    case 'pro-upgrade': return { tone: 'text-[#FF3C21] bg-[#FFF1EE]', label: 'Pro' }
    default: return null
  }
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}`
}
