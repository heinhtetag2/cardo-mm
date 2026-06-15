import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const base =
    'w-full h-[52px] rounded-full text-[15px] font-semibold flex items-center justify-center active:scale-[0.99] transition disabled:opacity-40 disabled:active:scale-100'
  const styles =
    variant === 'primary'
      ? 'bg-sand-0 text-black'
      : 'bg-surface-elevated text-ink border border-line/30'

  return (
    <button {...rest} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  )
}
