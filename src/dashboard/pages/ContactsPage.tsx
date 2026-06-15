import { useMemo, useState } from 'react'
import { Search, Filter, Plus, Star, MoreHorizontal, Mail, Phone, MapPin, Tag, ArrowUpDown } from 'lucide-react'
import { SAVED_CONTACTS, ALL_TAGS, ALL_CITIES, type SavedContact, type ContactSource } from '../data'

const ACCENT_BG: Record<SavedContact['accent'], string> = {
  blue: 'from-[#5B8DEF] to-[#4A7AD9]',
  violet: 'from-[#8B5CF6] to-[#7C3AED]',
  emerald: 'from-[#10B981] to-[#059669]',
  amber: 'from-[#F59E0B] to-[#D97706]',
  rose: 'from-[#F43F5E] to-[#E11D48]',
  slate: 'from-[#64748B] to-[#475569]',
  teal: 'from-[#14B8A6] to-[#0D9488]',
}

const SOURCE_LABEL: Record<ContactSource, string> = {
  scan: 'QR scan',
  manual: 'Manual',
  exchange: 'Exchange',
  ai: 'AI',
  nearby: 'Nearby',
}

export function ContactsPage() {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<typeof ALL_TAGS[number]>('All')
  const [city, setCity] = useState<typeof ALL_CITIES[number]>('All cities')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SAVED_CONTACTS.filter((c) => {
      if (tag !== 'All' && c.tag !== tag) return false
      if (city !== 'All cities' && c.city !== city) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      )
    })
  }, [query, tag, city])

  const active = filtered.find((c) => c.id === selected) ?? filtered[0] ?? null

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">Saved Contacts</h1>
          <p className="text-[13.5px] text-[#616161] mt-1">
            {SAVED_CONTACTS.length} contacts collected across Myanmar.
          </p>
        </div>
        <button className="h-11 px-5 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] text-sand-0 text-[13.5px] font-semibold rounded-xl hover:opacity-95 transition shadow-sm">
          <Plus className="w-4 h-4" /> Add contact
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center mb-5">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#616161]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, role…"
            className="w-full h-11 pl-11 pr-4 bg-sand-0 border border-[#EBEBEB] rounded-2xl text-[13.5px] text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#5B8DEF] transition"
          />
        </div>
        <Pill items={[...ALL_TAGS]} value={tag} onChange={(v) => setTag(v as any)} icon={Tag} />
        <Pill items={[...ALL_CITIES]} value={city} onChange={(v) => setCity(v as any)} icon={MapPin} />
        <button className="h-11 px-4 inline-flex items-center gap-1.5 bg-sand-0 border border-[#EBEBEB] hover:bg-[#FAFAFA] rounded-2xl text-[12.5px] font-medium text-[#1A1A1A] transition">
          <ArrowUpDown className="w-3.5 h-3.5" /> Sort
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pb-8">
        {/* List */}
        <div className="lg:col-span-2 bg-sand-0 border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-[#F3F3F3] flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#616161]">
              {filtered.length} {filtered.length === 1 ? 'contact' : 'contacts'}
            </span>
            <button className="text-[12px] font-medium text-[#5B8DEF] hover:text-[#4A7AD9] transition flex items-center gap-1">
              <Filter className="w-3 h-3" /> Bulk actions
            </button>
          </div>
          <ul className="divide-y divide-[#F3F3F3] max-h-[640px] overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelected(c.id)}
                  className={`w-full flex items-center gap-3 px-5 sm:px-6 py-3.5 text-left transition ${
                    active?.id === c.id ? 'bg-[#F8F8FF]' : 'hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${ACCENT_BG[c.accent]} text-sand-0 grid place-items-center text-[13px] font-semibold shrink-0`}>
                    {initials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-semibold text-[#1A1A1A] truncate">{c.name}</span>
                      {c.starred && <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />}
                    </div>
                    <div className="text-[11.5px] text-[#616161] truncate">
                      {c.role} · {c.company}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-lg bg-[#EEF2FF] text-[#5B8DEF]">
                      {c.tag}
                    </span>
                    <span className="text-[10.5px] text-[#616161]">{c.city}</span>
                  </div>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-5 py-12 text-center text-[12.5px] text-[#616161]">
                No contacts match those filters.
              </li>
            )}
          </ul>
        </div>

        {/* Detail */}
        {active ? <ContactDetail c={active} /> : null}
      </div>
    </div>
  )
}

function ContactDetail({ c }: { c: SavedContact }) {
  return (
    <div className="bg-sand-0 border border-[#EBEBEB] rounded-2xl sticky top-0 overflow-hidden">
      <div className={`h-28 bg-gradient-to-br ${ACCENT_BG[c.accent]} relative`}>
        <button className="absolute top-3 right-3 p-1.5 rounded-xl text-sand-0/80 hover:bg-sand-0/15 transition">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <div className="px-6 -mt-8 pb-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ACCENT_BG[c.accent]} text-sand-0 grid place-items-center text-[18px] font-semibold ring-4 ring-sand-0 shadow`}>
          {initials(c.name)}
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-[17px] font-semibold text-[#1A1A1A]">{c.name}</span>
          {c.starred && <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />}
        </div>
        <div className="text-[12px] text-[#616161]">{c.role} · {c.company}</div>
      </div>
      <div className="px-6 pb-4 space-y-2.5 border-b border-[#F3F3F3]">
        {c.email && <DetailRow icon={Mail} label={c.email} />}
        {c.phone && <DetailRow icon={Phone} label={c.phone} />}
        <DetailRow icon={MapPin} label={c.city} />
        <DetailRow icon={Tag} label={`${c.tag} · ${SOURCE_LABEL[c.source]}`} />
      </div>
      <div className="px-6 py-4 text-[11.5px] text-[#616161] flex items-center justify-between">
        <span>Saved {formatDate(c.savedAt)}</span>
        <span>Last seen {c.lastSeen}</span>
      </div>
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <button className="h-10 rounded-xl bg-[#F8F8F8] hover:bg-[#F3F3F3] text-[12.5px] font-medium text-[#1A1A1A] transition">Message</button>
        <button className="h-10 rounded-xl bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] hover:opacity-95 text-[12.5px] font-semibold text-sand-0 transition">Open card</button>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[12.5px]">
      <Icon className="w-3.5 h-3.5 text-[#616161] shrink-0" />
      <span className="text-[#1A1A1A] truncate">{label}</span>
    </div>
  )
}

function Pill({ items, value, onChange, icon: Icon }: { items: string[]; value: string; onChange: (v: string) => void; icon: React.ElementType }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-11 px-4 inline-flex items-center gap-1.5 bg-sand-0 border border-[#EBEBEB] hover:bg-[#FAFAFA] rounded-2xl text-[12.5px] font-medium text-[#1A1A1A] transition"
      >
        <Icon className="w-3.5 h-3.5 text-[#616161]" />
        {value}
      </button>
      {open && (
        <>
          <button onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" aria-hidden />
          <div className="absolute top-full mt-1.5 z-20 w-44 bg-sand-0 border border-[#EBEBEB] rounded-xl shadow-lg p-1.5">
            {items.map((it) => (
              <button
                key={it}
                onClick={() => { onChange(it); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-[12.5px] rounded-lg transition ${value === it ? 'bg-[#EEF2FF] text-[#5B8DEF] font-semibold' : 'text-[#303030] hover:bg-[#F3F3F3]'}`}
              >
                {it}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
