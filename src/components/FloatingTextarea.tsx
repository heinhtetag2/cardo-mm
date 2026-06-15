import { useState } from 'react'

export function FloatingTextarea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  rows = 4,
  maxLength,
  showCount = false,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  rows?: number
  maxLength?: number
  showCount?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0
  const float = filled || focused

  return (
    <label
      className={`relative block rounded-2xl bg-surface-elevated border border-transparent transition ${
        focused ? 'bg-surface-higher ring-2 ring-ink/10' : ''
      }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute left-4 transition-all duration-150 ${
          float
            ? 'top-2.5 text-[11px] text-ink-dim leading-none'
            : 'top-4 text-[15px] text-ink-dim'
        }`}
      >
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          onBlur?.()
        }}
        onChange={(e) => onChange(e.target.value)}
        placeholder={float ? placeholder ?? '' : ''}
        className={`w-full resize-none bg-transparent outline-none text-[15px] leading-relaxed text-ink placeholder:text-ink-dim/60 px-4 pb-3 ${
          float ? 'pt-7' : 'pt-4 opacity-0 focus:opacity-100'
        }`}
        style={{ minHeight: `${rows * 24 + 32}px` }}
      />
      {showCount && maxLength && (
        <span className="absolute bottom-2 right-3 text-[11px] tabular-nums text-ink-dim/70">
          {value.length}/{maxLength}
        </span>
      )}
    </label>
  )
}
