import { useState } from 'react'
import { Search, Share2, MapPin, Plus, Star } from 'lucide-react'
import type { View } from '../nav'
import { contacts, type Contact } from '../data'
import { useT } from '../i18n'

export function CardoScreen({
  go,
  favorites,
}: {
  go: (v: View) => void
  favorites: Set<string>
}) {
  const t = useT()
  const [activeChip, setActiveChip] = useState('all')

  const chips: { id: string; label: string }[] = [
    { id: 'all',      label: t('cards.tag.all') },
    { id: 'fav',      label: t('cards.tag.favorites') },
    { id: 'recent',   label: t('cards.tag.recentAdded') },
    { id: 'Yangon',   label: 'Yangon' },
    { id: 'Mandalay', label: 'Mandalay' },
    { id: 'Tech',     label: 'Tech' },
    { id: 'Sales',    label: 'Sales' },
  ]

  const favoriteContacts = contacts.filter((c) => favorites.has(c.id))
  const visibleContacts = activeChip === 'fav' ? favoriteContacts : contacts

  return (
    <div className="px-5 pt-2 animate-fade-in">
      <div className="flex items-end justify-between mb-1">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight">{t('cards.titleMy')}</h1>
          <p className="text-[13px] text-ink-dim mt-0.5">{t('cards.subtitle', { n: contacts.length })}</p>
        </div>
        <button
          onClick={() => go({ kind: 'register' })}
          aria-label={t('cards.add')}
          className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-brand/12 border border-brand/30 text-brand text-[13px] font-semibold hover:bg-brand/20 transition"
        >
          <Plus size={15} strokeWidth={2.4} />
          <span>{t('cards.add')}</span>
        </button>
      </div>

      <div className="mt-5 mb-4">
        <button onClick={() => go({ kind: 'search' })} className="w-full flex items-center gap-2 px-3.5 h-11 rounded-2xl border border-line/70 bg-surface text-left">
          <Search size={16} className="text-ink-dim" strokeWidth={1.8} />
          <span className="flex-1 text-[13.5px] text-ink-dim">{t('cards.searchPlaceholder')}</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto scrollbar-hide -mx-5 px-5">
        {chips.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveChip(c.id)}
            className={`flex-shrink-0 inline-flex items-center gap-1 px-3 h-8 rounded-full text-[12px] font-medium border transition ${
              activeChip === c.id ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'
            }`}
          >
            {c.id === 'fav' && (
              <Star size={11} strokeWidth={2} className={activeChip === c.id ? 'fill-canvas' : 'fill-brand text-brand'} />
            )}
            {c.label}
          </button>
        ))}
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
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-4 bottom-4 text-[44px] font-black tracking-tight text-white/15 leading-none select-none">
          {initials}
        </div>
        <div className="absolute top-4 left-4 h-11 w-11 rounded-full bg-canvas/90 backdrop-blur grid place-items-center border border-line/70 shadow-soft">
          <span className="text-[13px] font-bold text-white">{initials}</span>
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
