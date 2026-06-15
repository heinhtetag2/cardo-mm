import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

export function WebsiteRow({
  value, onChange, placeholder = 'Website',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0
  const float = filled || focused
  const trimmed = value.trim()
  const looksLikeUrl = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(trimmed)
  const href = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`

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
            ? 'top-2 text-[11px] text-ink-dim leading-none'
            : 'top-1/2 -translate-y-1/2 text-[15px] text-ink-dim'
        }`}
      >
        {placeholder}
      </span>
      <input
        type="url"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-[58px] bg-transparent outline-none text-[15px] text-ink pl-4 pr-12 ${
          float ? 'pt-5 pb-1.5' : ''
        }`}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2">
        {looksLikeUrl ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${trimmed}`}
            className="h-9 w-9 grid place-items-center rounded-full text-ink-muted hover:text-ink hover:bg-surface-higher transition"
          >
            <ExternalLink size={15} strokeWidth={1.8} />
          </a>
        ) : (
          <span aria-hidden className="h-9 w-9 grid place-items-center text-ink-dim/40">
            <ExternalLink size={15} strokeWidth={1.8} />
          </span>
        )}
      </span>
    </label>
  )
}
