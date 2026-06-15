import { useState } from 'react'

export function InputRow({
  placeholder,
  value,
  onChange,
  hint,
  type = 'text',
  autoFocus,
  inputMode,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  hint?: string
  type?: string
  autoFocus?: boolean
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search'
}) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0
  const float = filled || focused

  return (
    <div>
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
          autoFocus={autoFocus}
          type={type}
          inputMode={inputMode}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[58px] bg-transparent outline-none text-[15px] text-ink px-4 ${
            float ? 'pt-5 pb-1.5' : ''
          }`}
        />
      </label>
      {hint && <p className="text-[12px] text-ink-dim mt-1.5 ml-1">{hint}</p>}
    </div>
  )
}
