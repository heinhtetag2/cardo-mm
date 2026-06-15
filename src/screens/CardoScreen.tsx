import { useMemo, useState } from 'react'
import { Search, Share2, MapPin, Star, ChevronDown, X, Check } from 'lucide-react'
import type { View } from '../nav'
import { contacts, type Contact } from '../data'
import { useT } from '../i18n'

type CardView = 'all' | 'fav' | 'recent'

export function CardoScreen({
  go,
  favorites,
}: {
  go: (v: View) => void
  favorites: Set<string>
}) {
  const t = useT()
  const [view, setView] = useState<CardView>('all')
  const [city, setCity] = useState<string | null>(null)
  const [showCityPicker, setShowCityPicker] = useState(false)

  const views: { id: CardView; label: string }[] = [
    { id: 'all',    label: t('cards.tag.all') },
    { id: 'fav',    label: t('cards.tag.favorites') },
    { id: 'recent', label: t('cards.tag.recentAdded') },
  ]

  const cities = useMemo(
    () => Array.from(new Set(contacts.map((c) => c.city))).sort(),
    []
  )

  let visibleContacts = contacts
  if (view === 'fav') visibleContacts = visibleContacts.filter((c) => favorites.has(c.id))
  if (city) visibleContacts = visibleContacts.filter((c) => c.city === city)

  return (
    <div className="px-5 pt-2 animate-fade-in">
      <div className="mb-1">
        <h1 className="text-[26px] font-bold tracking-tight">{t('cards.titleMy')}</h1>
        <p className="text-[13px] text-ink-dim mt-0.5">{t('cards.subtitle', { n: contacts.length })}</p>
      </div>

      <div className="mt-5 mb-4">
        <button onClick={() => go({ kind: 'search' })} className="w-full flex items-center gap-2 px-3.5 h-11 rounded-2xl border border-line/70 bg-surface text-left">
          <Search size={16} className="text-ink-dim" strokeWidth={1.8} />
          <span className="flex-1 text-[13.5px] text-ink-dim">{t('cards.searchPlaceholder')}</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto scrollbar-hide -mx-5 px-5">
        {views.map((c) => (
          <button
            key={c.id}
            onClick={() => setView(c.id)}
            className={`flex-shrink-0 inline-flex items-center gap-1 px-3 h-8 rounded-full text-[12px] font-medium border transition ${
              view === c.id ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'
            }`}
          >
            {c.id === 'fav' && (
              <Star size={11} strokeWidth={2} className={view === c.id ? 'fill-canvas' : 'fill-brand text-brand'} />
            )}
            {c.label}
          </button>
        ))}

        <span className="flex-shrink-0 h-5 w-px bg-line/70 mx-1" />

        {city ? (
          <button
            onClick={() => setCity(null)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 pl-3 pr-2 h-8 rounded-full text-[12px] font-medium border bg-brand/10 text-brand border-brand/30 transition"
          >
            <MapPin size={11} strokeWidth={2.2} />
            {city}
            <X size={12} strokeWidth={2.4} className="opacity-80" />
          </button>
        ) : (
          <button
            onClick={() => setShowCityPicker(true)}
            className="flex-shrink-0 inline-flex items-center gap-1 pl-3 pr-2.5 h-8 rounded-full text-[12px] font-medium border bg-surface text-ink-muted border-line/70 transition"
          >
            <MapPin size={11} strokeWidth={2} />
            {t('cards.tag.location')}
            <ChevronDown size={12} strokeWidth={2} className="opacity-70" />
          </button>
        )}
      </div>

      {visibleContacts.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-surface-elevated border border-line/60 grid place-items-center mb-3">
            <Star size={20} className="text-ink-dim" strokeWidth={1.6} />
          </div>
          <p className="text-[14.5px] font-semibold">{t('cards.empty.fav.title')}</p>
          <p className="text-[12.5px] text-ink-dim mt-1">{t('cards.empty.fav.sub')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleContacts.map((c) => (
            <CardFeatureItem key={c.id} contact={c} onClick={() => go({ kind: 'card-detail', contact: c })} />
          ))}
        </div>
      )}

      {showCityPicker && (
        <CityPicker
          cities={cities}
          selected={city}
          onSelect={(c) => { setCity(c); setShowCityPicker(false) }}
          onClose={() => setShowCityPicker(false)}
        />
      )}
    </div>
  )
}


function CardFeatureItem({ contact, onClick }: { contact: Contact; onClick: () => void }) {
  const initials = contact.name.split(' ').map((p) => p[0]).slice(0, 2).join('')
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[24px] overflow-hidden border border-line/60 bg-surface shadow-soft transition hover:border-line-strong"
    >
      <div className={`relative aspect-[16/9] bg-gradient-to-br ${contact.accent} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-canvas/10 to-canvas/50" />
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-sand-0/10 blur-2xl" />
        <div className="absolute right-4 bottom-4 text-[44px] font-black tracking-tight text-sand-0/15 leading-none select-none">
          {initials}
        </div>
        <div className="absolute top-4 left-4 h-11 w-11 rounded-full bg-canvas/90 backdrop-blur grid place-items-center border border-line/70 shadow-soft">
          <span className="text-[13px] font-bold text-ink">{initials}</span>
        </div>
        {contact.tags?.[0] && (
          <span className="absolute top-5 right-4 px-2.5 py-1 rounded-full bg-canvas/70 backdrop-blur border border-line/60 text-[10.5px] font-semibold tracking-wide text-ink-muted">
            {contact.tags[0]}
          </span>
        )}
      </div>

      <div className="px-4 pt-4 pb-4">
        <h3 className="text-[17px] font-semibold tracking-tight leading-tight">{contact.name}</h3>
        <p className="text-[13px] text-ink-muted mt-1 leading-snug">
          {contact.role} <span className="text-ink-dim">·</span> {contact.company}
        </p>
        <div className="flex items-center justify-between mt-3.5">
          <div className="flex items-center gap-1.5 text-[11.5px] text-ink-dim">
            <MapPin size={12} strokeWidth={1.8} />
            <span>{contact.city}</span>
            {contact.metAt && (
              <>
                <span className="text-line-strong">•</span>
                <span className="truncate max-w-[140px]">{contact.metAt.split('·')[0].trim()}</span>
              </>
            )}
          </div>
          <span className="h-8 w-8 grid place-items-center rounded-full border border-line/60 bg-surface-elevated">
            <Share2 size={13} strokeWidth={1.8} className="text-ink-muted" />
          </span>
        </div>
      </div>
    </button>
  )
}

function CityPicker({
  cities,
  selected,
  onSelect,
  onClose,
}: {
  cities: string[]
  selected: string | null
  onSelect: (city: string | null) => void
  onClose: () => void
}) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full rounded-t-[28px] border-t border-x border-line/70 bg-canvas animate-slide-up overflow-hidden">
        <div className="pt-2.5 pb-2 flex justify-center">
          <div className="h-[3px] w-9 rounded-full bg-line-strong" />
        </div>
        <div className="px-5 pt-1 pb-4 flex items-center justify-between border-b border-line/40">
          <h2 className="text-[16px] font-semibold tracking-tight">{t('cards.location.title')}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded-full border border-line/70 bg-surface/80"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
        <div className="px-3 pt-2 pb-4 max-h-[60vh] overflow-y-auto">
          <CityRow label={t('cards.location.all')} active={selected === null} onClick={() => onSelect(null)} />
          {cities.map((c) => (
            <CityRow key={c} label={c} active={selected === c} onClick={() => onSelect(c)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CityRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition ${active ? 'bg-brand/10 text-brand' : 'hover:bg-surface/80 text-ink'}`}
    >
      <MapPin size={15} strokeWidth={1.8} className={active ? 'text-brand' : 'text-ink-muted'} />
      <span className="flex-1 text-[14.5px] font-medium">{label}</span>
      {active && <Check size={15} strokeWidth={2.4} className="text-brand" />}
    </button>
  )
}
