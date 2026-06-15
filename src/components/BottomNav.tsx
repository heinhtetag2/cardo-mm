import { Home, IdCard, Wand2 } from 'lucide-react'
import { useT } from '../i18n'

export type Tab = 'home' | 'cardo' | 'ai' | 'me'

const items: { key: Tab; tKey: string; Icon: typeof Home }[] = [
  { key: 'home',  tKey: 'tab.home',  Icon: Home },
  { key: 'cardo', tKey: 'tab.cards', Icon: IdCard },
  { key: 'ai',    tKey: 'tab.ai',    Icon: Wand2 },
]

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const t = useT()
  return (
    <nav className="absolute bottom-0 inset-x-0 z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-canvas via-canvas to-canvas/0">
      <div className="flex items-center justify-between gap-1 bg-surface-elevated/95 backdrop-blur-xl rounded-full border border-line/60 shadow-soft px-2 py-2">
        {items.map(({ key, tKey, Icon }) => {
          const label = t(tKey)
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-full transition-all
                ${isActive
                  ? 'bg-active/80 shadow-inner border border-line/40'
                  : 'bg-transparent border border-transparent'
                }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={isActive ? 'text-ink' : 'text-ink-muted'}
              />
              <span className={`text-[10.5px] leading-none ${isActive ? 'text-ink font-semibold' : 'text-ink-muted font-medium'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
