import { ExternalLink, Globe } from 'lucide-react'

export function WebsiteRow({
  value, onChange, placeholder = 'website.mm',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
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
        placeholder={placeholder}
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
