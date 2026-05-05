import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, MapPin, Navigation, Plus, Search, X } from 'lucide-react'
import { searchLocations, type LocationOption } from '../locations'

export function LocationPickerRow({
  value, placeholder = 'City', onTap,
}: {
  value: string
  placeholder?: string
  onTap: () => void
}) {
  const empty = !value || value === placeholder
  return (
    <button
      type="button"
      onClick={onTap}
      className="w-full flex items-center gap-3 h-12 px-4 rounded-2xl border border-line/70 bg-surface text-left active:bg-surface-elevated transition"
    >
      <span className="text-ink-dim"><MapPin size={15} /></span>
      <span className={`flex-1 text-[14px] truncate ${empty ? 'text-ink-dim' : 'text-ink'}`}>
        {value || placeholder}
      </span>
      <ChevronDown size={15} className="text-ink-dim" />
    </button>
  )
}

export function LocationPicker({
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
              No matching cities. Use what you typed above.
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
  loc, active, onSelect,
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
