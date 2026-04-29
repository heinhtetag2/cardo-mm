import type { ReactNode } from 'react'

export function SectionHeader({
  title,
  action,
  size = 'md',
}: {
  title: string
  action?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'text-[15px]',
    md: 'text-[17px]',
    lg: 'text-[20px]',
  }
  return (
    <div className="flex items-center justify-between mb-3.5">
      <h2 className={`${sizes[size]} font-semibold tracking-tight text-ink`}>{title}</h2>
      {action}
    </div>
  )
}
