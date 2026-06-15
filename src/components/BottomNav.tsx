import { Home, IdCard, Wand2, User, ScanLine } from 'lucide-react'
import { useT } from '../i18n'

export type Tab = 'home' | 'cardo' | 'ai' | 'me'

const leftItems: { key: Tab; tKey: string; Icon: typeof Home }[] = [
  { key: 'home',  tKey: 'tab.home',  Icon: Home },
  { key: 'cardo', tKey: 'tab.cards', Icon: IdCard },
]
const rightItems: { key: Tab; tKey: string; Icon: typeof Home }[] = [
  { key: 'ai', tKey: 'tab.ai', Icon: Wand2 },
  { key: 'me', tKey: 'tab.me', Icon: User },
]

export function BottomNav({
  active,
  onChange,
  onScan,
}: {
  active: Tab
  onChange: (t: Tab) => void
  onScan: () => void
}) {
  const t = useT()

  const TabButton = ({ item }: { item: (typeof leftItems)[number] }) => {
    const isActive = active === item.key
    const { Icon } = item
    return (
      <button
        onClick={() => onChange(item.key)}
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
          {t(item.tKey)}
        </span>
      </button>
    )
  }

  return (
    <nav className="absolute bottom-0 inset-x-0 z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-canvas via-canvas to-canvas/0">
      <div className="relative">
        {/* Raised center Scan action */}
        <button
          onClick={onScan}
          aria-label={t('register.title')}
          className="group absolute left-1/2 -translate-x-1/2 -top-4 z-10 flex items-center justify-center"
        >
          <span className="relative h-14 w-14 rounded-full bg-brand-gradient grid place-items-center shadow-glow ring-4 ring-canvas transition-transform duration-200 group-active:scale-90">
            <span className="absolute inset-0 rounded-full bg-brand/40 animate-soft-pulse" />
            <ScanLine size={25} strokeWidth={2.2} className="relative text-sand-0" />
          </span>
        </button>

        <div className="flex items-center gap-1 bg-surface-elevated/95 backdrop-blur-xl rounded-full border border-line/60 shadow-soft px-2 py-2">
          {leftItems.map((item) => <TabButton key={item.key} item={item} />)}
          <span className="w-16 shrink-0" aria-hidden />
          {rightItems.map((item) => <TabButton key={item.key} item={item} />)}
        </div>
      </div>
    </nav>
  )
}
