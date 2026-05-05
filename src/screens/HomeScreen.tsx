import { useEffect, useRef, useState } from 'react'
import { Search, QrCode, Wand2, Plus, Radar, Gift, ChevronRight } from 'lucide-react'
import type { Tab, View } from '../nav'
import { contacts, ads, type Ad } from '../data'
import { SectionHeader } from '../components/SectionHeader'
import { useT } from '../i18n'

const SLIDE_INTERVAL_MS = 5000
const RESUME_DELAY_MS = 4000

export function HomeScreen({ go, setTab }: { go: (v: View) => void; setTab: (t: Tab) => void }) {
  const t = useT()
  const recent = contacts.slice(0, 3)
  const scrollRef = useRef<HTMLDivElement>(null)
  const resumeTimer = useRef<number | undefined>(undefined)
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const totalSlides = 1 + ads.length

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== slide && idx >= 0 && idx < totalSlides) setSlide(idx)
  }

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      const el = scrollRef.current
      if (!el) return
      const current = Math.round(el.scrollLeft / el.clientWidth)
      const next = (current + 1) % totalSlides
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [paused, totalSlides])

  const pause = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    setPaused(true)
  }
  const scheduleResume = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => setPaused(false), RESUME_DELAY_MS)
  }
  useEffect(() => () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
  }, [])

  return (
    <div className="px-5 pt-2 animate-fade-in">
      {/* Hero + Sponsored carousel */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onPointerCancel={scheduleResume}
        onMouseLeave={scheduleResume}
        className="-mx-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        <div className="flex">
          {/* Hero slide */}
          <div className="snap-center shrink-0 min-w-full px-5">
            <div className="relative overflow-hidden rounded-[24px] border border-line/60 bg-hero-card p-5">
              <div className="mb-12">
                <p className="text-[12px] font-semibold text-brand mb-2">{t('home.hero.kicker')}</p>
                <h1 className="text-[26px] font-bold tracking-tight leading-[1.1] text-balance">
                  {t('home.hero.title.1')}<br/>{t('home.hero.title.2')}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => go({ kind: 'my-card' })} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-canvas text-[13px] font-semibold whitespace-nowrap">
                  <QrCode size={15} strokeWidth={2.4} /> {t('home.share')}
                </button>
                <button onClick={() => go({ kind: 'register' })} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-line bg-surface/60 text-[13px] font-medium whitespace-nowrap">
                  <Plus size={15} strokeWidth={2.4} /> {t('home.add')}
                </button>
              </div>
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
            </div>
          </div>

          {/* Sponsored slides */}
          {ads.map((ad) => (
            <div key={ad.id} className="snap-center shrink-0 min-w-full px-5">
              <AdSlide ad={ad} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3 mb-7">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === slide ? 'w-5 bg-ink' : 'w-1.5 bg-ink-dim/40'
            }`}
          />
        ))}
      </div>

      {/* Search */}
      <SectionHeader title={t('home.find')} size="sm" />
      <div className="mb-7">
        <button
          onClick={() => go({ kind: 'search' })}
          className="w-full flex items-center gap-2.5 px-4 h-12 rounded-2xl border border-line/70 bg-surface text-left"
        >
          <Search size={17} className="text-ink-dim" strokeWidth={1.8} />
          <span className="flex-1 text-[14px] text-ink-dim">{t('home.searchPlaceholder')}</span>
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2.5 mb-7">
        <QuickAction icon={<QrCode size={18} />} label={t('home.scanQr')}   onClick={() => go({ kind: 'qr-scan' })} />
        <QuickAction icon={<Wand2 size={18} />}  label={t('home.generate')} onClick={() => setTab('ai')} />
        <QuickAction icon={<Radar size={18} />}  label={t('home.nearby')}   onClick={() => go({ kind: 'nearby' })} />
      </div>

      {/* Recently saved */}
      <SectionHeader
        title={t('home.recent')}
        size="sm"
        action={<button onClick={() => setTab('cardo')} className="text-[12.5px] text-ink-muted font-medium">{t('home.seeAll')}</button>}
      />
      <div className="space-y-2.5 mb-7">
        {recent.map((c) => (
          <button
            key={c.id}
            onClick={() => go({ kind: 'card-detail', contact: c })}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-line/60 bg-surface/60 hover:bg-surface-elevated transition-colors"
          >
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.accent} grid place-items-center text-[13px] font-bold text-white`}>
              {c.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[14.5px] font-semibold leading-tight truncate">{c.name}</p>
              <p className="text-[12px] text-ink-dim mt-0.5 truncate">{c.role} · {c.company}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated border border-line/60 text-[10.5px] font-semibold text-ink-muted">{c.city}</span>
          </button>
        ))}
      </div>

      {/* Referral */}
      <button onClick={() => go({ kind: 'invite' })} className="relative w-full p-4 rounded-[20px] border border-brand/25 bg-brand/8 flex items-center gap-3.5 mb-4 overflow-hidden">
        <div className="h-11 w-11 rounded-xl border border-brand/30 bg-brand/15 grid place-items-center">
          <Gift size={17} className="text-brand" strokeWidth={1.8} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[14.5px] font-semibold">{t('home.referral.title')}</p>
          <p className="text-[12px] text-ink-dim mt-0.5">{t('home.referral.sub')}</p>
        </div>
        <ChevronRight size={18} className="text-ink-dim" strokeWidth={1.8} />
      </button>
    </div>
  )
}

function AdSlide({ ad }: { ad: Ad }) {
  const t = useT()
  const handleClick = () => {
    if (ad.href) window.open(ad.href, '_blank', 'noopener,noreferrer')
  }
  return (
    <button
      onClick={handleClick}
      className="relative w-full overflow-hidden rounded-[24px] border border-line/60 p-5 text-left"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${ad.accent} pointer-events-none`} />
      {ad.image && (
        <img src={ad.image} alt="" className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      )}
      <div className="relative">
        <div className="mb-12">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-canvas/60 backdrop-blur text-[9.5px] font-semibold tracking-wider uppercase text-ink-muted mb-3">
            {t('home.sponsored')} · {ad.sponsor}
          </span>
          <h2 className="text-[22px] font-bold tracking-tight leading-[1.15] text-balance">
            {ad.title}
          </h2>
          <p className="text-[12.5px] text-ink-dim mt-2 max-w-[88%]">{ad.subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-ink text-canvas text-[13px] font-semibold">
          {t('home.learnMore')} <ChevronRight size={15} strokeWidth={2.4} />
        </span>
      </div>
      <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
    </button>
  )
}

function QuickAction({ icon, label, highlight, onClick }: { icon: React.ReactNode; label: string; highlight?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all
        ${highlight
          ? 'border-brand/40 bg-gradient-to-b from-brand/15 to-transparent'
          : 'border-line/70 bg-surface'
        }`}
    >
      <span className={highlight ? 'text-brand' : 'text-ink'}>{icon}</span>
      <span className={`text-[12px] font-medium ${highlight ? 'text-white' : 'text-ink-muted'}`}>{label}</span>
    </button>
  )
}
