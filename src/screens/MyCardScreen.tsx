import { Pencil } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { MyCardShare } from '../components/MyCardShare'
import { useT } from '../i18n'
import type { View } from '../nav'

export function MyCardScreen({ onBack, go }: { onBack: () => void; go: (v: View) => void }) {
  const t = useT()

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-glow-radial pointer-events-none" />
      <SubScreenHeader title={t('myCard.title')} onBack={onBack} right={
        <button onClick={() => go({ kind: 'edit-card' })} className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80">
          <Pencil size={16} strokeWidth={1.8} />
        </button>
      } />

      <div className="relative px-5 pt-2 pb-8">
        <MyCardShare />
      </div>
    </div>
  )
}
