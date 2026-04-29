import { Camera, Pencil, QrCode, ChevronRight } from 'lucide-react'
import type { View } from '../nav'
import { SubScreenHeader } from '../components/SubScreenHeader'

export function RegisterScreen({ go, onBack }: { go: (v: View) => void; onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-20 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in flex flex-col">
      <SubScreenHeader onBack={onBack} />
      <div className="px-5 pt-2 pb-8">
      <div className="mb-6">
        <h1 className="text-[26px] font-bold tracking-tight">Add a card</h1>
        <p className="text-[13px] text-ink-dim mt-1">Choose how you'd like to capture this contact.</p>
      </div>

      <div className="space-y-3 mb-7">
        <ActionCard
          onClick={() => go({ kind: 'scan' })}
          icon={<Camera size={22} strokeWidth={1.8} />}
          title="Scan paper card"
          desc="Snap a photo. We'll extract every detail with AI in seconds."
          badge="Fastest"
        />
        <ActionCard
          onClick={() => go({ kind: 'qr-scan' })}
          icon={<QrCode size={22} strokeWidth={1.8} />}
          title="Scan QR code"
          desc="Trade cards instantly with another Cardo user."
        />
        <ActionCard
          onClick={() => go({ kind: 'manual' })}
          icon={<Pencil size={22} strokeWidth={1.8} />}
          title="Enter manually"
          desc="Type in the details for cards without a paper version."
        />
      </div>

      <div className="px-1">
        <p className="text-[12px] font-medium text-ink-dim mb-1.5">Tip</p>
        <p className="text-[12.5px] text-ink-muted leading-relaxed">
          For best results, lay the card on a flat, dark surface and fill the frame. Cardo auto-detects edges and works in low light.
        </p>
      </div>
      </div>
    </div>
  )
}

function ActionCard({
  icon, title, desc, badge, onClick,
}: {
  icon: React.ReactNode; title: string; desc: string; badge?: string; onClick?: () => void
}) {
  return (
    <button onClick={onClick} className="w-full text-left p-4 rounded-[20px] border border-line/70 bg-surface transition-all">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl grid place-items-center flex-shrink-0 bg-surface-higher border border-line-strong text-ink/90">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold leading-tight">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-brand/20 text-brand text-[10px] font-semibold border border-brand/30">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-ink-dim mt-1.5 leading-snug">{desc}</p>
        </div>
        <ChevronRight size={18} className="text-ink-dim mt-1" strokeWidth={1.8} />
      </div>
    </button>
  )
}
