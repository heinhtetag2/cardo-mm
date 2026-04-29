import type { ReactNode } from 'react'

export function InputRow({
  icon, placeholder, value, onChange, type = 'text', autoFocus, inputMode,
}: {
  icon: ReactNode
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoFocus?: boolean
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search'
}) {
  return (
    <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-line/70 bg-surface focus-within:border-brand/60 transition">
      <span className="text-ink-dim">{icon}</span>
      <input
        autoFocus={autoFocus}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-ink-dim"
      />
    </div>
  )
}
