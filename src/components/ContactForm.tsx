import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Briefcase, Building2, Camera, ChevronDown, ExternalLink, Globe, Mail, MapPin,
  Navigation, Phone, Plus, Save, Search, User, X,
} from 'lucide-react'
import { searchLocations, type LocationOption } from '../locations'

export type ContactDraft = {
  name: string
  role: string
  company: string
  phone: string
  email: string
  website: string
  city: string
  tags: string[]
  notes: string
}

export const EMPTY_CONTACT: ContactDraft = {
  name: '', role: '', company: '', phone: '', email: '', website: '', city: '', tags: [], notes: '',
}

const TAG_OPTIONS = ['Lead', 'Client', 'Partner', 'Friend', 'Mentor']

export function ContactForm({
  header,
  initial,
  saveLabel = 'Save contact',
  saveIcon,
  topBanner,
  onSave,
}: {
  header: ReactNode
  initial?: Partial<ContactDraft>
  saveLabel?: string
  saveIcon?: ReactNode
  topBanner?: ReactNode
  onSave: (draft: ContactDraft) => void
}) {
  const [data, setData] = useState<ContactDraft>({ ...EMPTY_CONTACT, ...initial })
  const [pickerOpen, setPickerOpen] = useState(false)
  const setStr = (k: 'name' | 'role' | 'company' | 'phone' | 'email' | 'website' | 'city' | 'notes') => (v: string) =>
    setData((d) => ({ ...d, [k]: v }))
  const toggleTag = (t: string) =>
    setData((d) => ({ ...d, tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t] }))

  return (
    <div className="absolute inset-0 bg-canvas flex flex-col animate-fade-in">
      <div className="sticky top-0 z-30 bg-canvas/95 backdrop-blur">{header}</div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-32">
        <div className="flex justify-center mb-7">
          <button className="relative h-24 w-24 rounded-full border-2 border-dashed border-line-strong bg-surface grid place-items-center">
            <Camera size={20} className="text-ink-dim" strokeWidth={1.8} />
            <span className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-surface-elevated border border-line/70 text-[10px] font-semibold text-ink-muted">Add photo</span>
          </button>
        </div>

        {topBanner && <div className="mb-5">{topBanner}</div>}

        <SectionLabel>Identity</SectionLabel>
        <div className="space-y-3 mb-6">
          <InputRow icon={<User size={15} />} placeholder="Full name" value={data.name} onChange={setStr('name')} />
          <InputRow icon={<Briefcase size={15} />} placeholder="Role / Title" value={data.role} onChange={setStr('role')} />
          <InputRow icon={<Building2 size={15} />} placeholder="Company" value={data.company} onChange={setStr('company')} />
        </div>

        <SectionLabel>Contact</SectionLabel>
        <div className="space-y-3 mb-6">
          <InputRow icon={<Phone size={15} />} placeholder="+95 9 …" value={data.phone} onChange={setStr('phone')} type="tel" />
          <InputRow icon={<Mail size={15} />} placeholder="email@company.mm" value={data.email} onChange={setStr('email')} type="email" />
          <WebsiteRow value={data.website} onChange={setStr('website')} />
          <LocationPickerRow value={data.city} onTap={() => setPickerOpen(true)} />
        </div>

        <SectionLabel>Tags</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {TAG_OPTIONS.map((t) => {
            const active = data.tags.includes(t)
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`px-3.5 h-9 rounded-full text-[12px] font-medium border transition inline-flex items-center justify-center leading-none ${
                  active ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'
                }`}
              >
                {active ? t : `+ ${t}`}
              </button>
            )
          })}
        </div>

        <SectionLabel>Notes</SectionLabel>
        <textarea
          placeholder="Where you met, what you discussed, follow-up reminders…"
          rows={4}
          value={data.notes}
          onChange={(e) => setStr('notes')(e.target.value)}
          className="w-full p-4 rounded-2xl border border-line/70 bg-surface text-[14px] outline-none focus:border-brand/60 resize-none placeholder:text-ink-dim"
        />
      </div>

      <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-gradient-to-t from-canvas via-canvas to-canvas/0">
        <button onClick={() => onSave(data)} className="w-full py-3.5 rounded-2xl bg-ink text-canvas font-semibold text-[15px] flex items-center justify-center gap-2">
          {saveIcon ?? <Save size={15} strokeWidth={2.4} />}
          <span>{saveLabel}</span>
        </button>
      </div>

      {pickerOpen && (
        <LocationPicker
          current={data.city}
          onClose={() => setPickerOpen(false)}
          onSelect={(loc) => {
            setStr('city')(loc.name)
            setPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}

function InputRow({ icon, placeholder, value, onChange, type = 'text' }: { icon: ReactNode; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-line/70 bg-surface focus-within:border-brand/60 transition">
      <span className="text-ink-dim">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-dim"
      />
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-medium text-ink-dim mt-1 mb-2.5 ml-1">{children}</p>
}

function WebsiteRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const trimmed = value.trim()
  const looksLikeUrl = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(trimmed)
  const href = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  return (
    <div className="flex items-center gap-3 h-12 pl-4 pr-2 rounded-2xl border border-line/70 bg-surface focus-within:border-brand/60 transition">
      <span className="text-ink-dim"><Globe size={15} /></span>
      <input
        type="url"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        placeholder="website.mm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-dim min-w-0"
      />
      {looksLikeUrl ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${trimmed}`}
          className="h-8 w-8 grid place-items-center rounded-full text-ink-muted hover:text-ink hover:bg-surface-elevated transition flex-shrink-0"
        >
          <ExternalLink size={15} strokeWidth={1.8} />
        </a>
      ) : (
        <span
          aria-hidden
          title="Type a website to enable"
          className="h-8 w-8 grid place-items-center text-ink-dim/40 flex-shrink-0"
        >
          <ExternalLink size={15} strokeWidth={1.8} />
        </span>
      )}
    </div>
  )
}

function LocationPickerRow({ value, onTap }: { value: string; onTap: () => void }) {
  const empty = !value
  return (
    <button
      type="button"
      onClick={onTap}
      className="w-full flex items-center gap-3 h-12 px-4 rounded-2xl border border-line/70 bg-surface text-left active:bg-surface-elevated transition"
    >
      <span className="text-ink-dim"><MapPin size={15} /></span>
      <span className={`flex-1 text-[14px] truncate ${empty ? 'text-ink-dim' : 'text-ink'}`}>
        {empty ? 'City' : value}
      </span>
      <ChevronDown size={15} className="text-ink-dim" />
    </button>
  )
}

function LocationPicker({
  current,
  onSelect,
  onClose,
}: {
  current: string
  onSelect: (loc: LocationOption) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 240)
    return () => window.clearTimeout(id)
  }, [])

  const results = useMemo(() => searchLocations(query), [query])
  const hasQuery = query.trim() !== ''

  return (
    <div className="absolute inset-0 z-40 flex flex-col">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-fade-in"
      />

      <div className="relative mt-auto bg-canvas rounded-t-3xl border-t border-line/70 max-h-[78%] flex flex-col animate-slide-up">
        <div className="pt-2 pb-1 flex justify-center">
          <span className="h-1 w-10 rounded-full bg-line-strong/70" />
        </div>

        <div className="px-5 pt-2 pb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-ink">Choose location</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full bg-surface text-ink-muted">
            <X size={15} />
          </button>
        </div>

        <div className="px-5">
          <div className="flex items-center gap-3 h-11 px-4 rounded-2xl border border-line/70 bg-surface focus-within:border-brand/60 transition">
            <Search size={15} className="text-ink-dim" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cities, townships…"
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-dim"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-ink-dim">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => onSelect({ id: 'current', name: 'Current location', region: 'GPS' })}
          className="mx-5 mt-3 mb-1 flex items-center gap-3 px-4 h-11 rounded-2xl bg-brand/10 border border-brand/30 text-brand text-[13px] font-medium"
        >
          <Navigation size={14} />
          <span>Use current location</span>
        </button>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pt-2 pb-6">
          {hasQuery && (
            <CustomAddressRow
              query={query}
              onSelect={() =>
                onSelect({ id: `custom-${query}`, name: query.trim(), region: 'Custom address' })
              }
            />
          )}

          <ul>
            {results.map((loc) => (
              <LocationRow key={loc.id} loc={loc} active={loc.name === current} onSelect={onSelect} />
            ))}
          </ul>

          {hasQuery && results.length === 0 && (
            <p className="px-3 pt-3 pb-1 text-center text-[12px] text-ink-dim">
              No matching cities — use what you typed above.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function CustomAddressRow({ query, onSelect }: { query: string; onSelect: () => void }) {
  const trimmed = query.trim()
  if (!trimmed) return null
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left active:bg-surface transition"
    >
      <span className="h-9 w-9 grid place-items-center rounded-full bg-brand/10 border border-brand/30 text-brand">
        <Plus size={14} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] truncate text-ink">Use “{trimmed}”</span>
        <span className="block text-[12px] text-ink-dim truncate">Save as custom address</span>
      </span>
    </button>
  )
}

function LocationRow({
  loc,
  active,
  onSelect,
}: {
  loc: LocationOption
  active: boolean
  onSelect: (loc: LocationOption) => void
}) {
  return (
    <li>
      <button
        onClick={() => onSelect(loc)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
          active ? 'bg-surface-elevated' : 'active:bg-surface'
        }`}
      >
        <span className="h-9 w-9 grid place-items-center rounded-full bg-surface border border-line/60 text-ink-muted">
          <MapPin size={14} />
        </span>
        <span className="flex-1 min-w-0">
          <span className={`block text-[14px] truncate ${active ? 'text-ink font-medium' : 'text-ink'}`}>{loc.name}</span>
          <span className="block text-[12px] text-ink-dim truncate">{loc.region}</span>
        </span>
        {active && <span className="text-[11px] font-medium text-brand">Selected</span>}
      </button>
    </li>
  )
}
