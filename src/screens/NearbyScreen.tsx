import { Radio, MapPin } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'
import type { View } from '../nav'

const nearby = [
  { name: 'Kyaw Min',  role: 'Engineer · TechBM',     distance: '12 m', accent: 'from-cyan-400 to-blue-500',      top: '22%', left: '38%', phone: '+95 9 551 322 778', email: 'kyaw.min@techbm.io',     website: 'techbm.io',     city: 'Yangon' },
  { name: 'Thida Aye', role: 'PM · CleverApp',        distance: '34 m', accent: 'from-rose-400 to-pink-500',      top: '40%', left: '78%', phone: '+95 9 884 217 003', email: 'thida@cleverapp.mm',     website: 'cleverapp.mm',  city: 'Yangon' },
  { name: 'Zaw Lin',   role: 'Founder · GreenStart',  distance: '58 m', accent: 'from-emerald-400 to-teal-500',   top: '58%', left: '68%', phone: '+95 9 712 446 158', email: 'zaw@greenstart.mm',      website: 'greenstart.mm', city: 'Yangon' },
  { name: 'May Nyein', role: 'Designer · Studio Co.', distance: '90 m', accent: 'from-violet-400 to-fuchsia-500', top: '72%', left: '32%', phone: '+95 9 369 528 411', email: 'may@studio.co',                                    city: 'Yangon' },
]

export function NearbyScreen({ onBack, go }: { onBack: () => void; go: (v: View) => void }) {
  const toast = useToast()
  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader title="Nearby Cards" onBack={onBack} right={
        <button onClick={() => toast.show('Live discovery is on', 'info')} className="px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10.5px] font-semibold flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </button>
      } />

      {/* Radar */}
      <div className="relative px-5 mb-5">
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 grid place-items-center">
            {/* Pulsing rings */}
            <div className="relative h-full w-full">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/30"
                  style={{
                    height: `${(i + 1) * 25}%`,
                    width: `${(i + 1) * 25}%`,
                    opacity: 1 - i * 0.18,
                  }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-brand-gradient grid place-items-center shadow-glow">
                <Radio size={18} className="text-white" />
              </div>
              {/* Avatar pins */}
              {nearby.map((p) => (
                <AvatarPin key={p.name} name={p.name} accent={p.accent} top={p.top} left={p.left} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mb-3 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[16px] font-semibold leading-tight">Nearby users</p>
          <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-line/60 text-[11px] font-semibold text-ink-muted tabular-nums">
            {nearby.length}
          </span>
        </div>
        <p className="text-[11.5px] text-ink-dim pb-0.5">Within 100 m</p>
      </div>

      <div className="px-5 space-y-2.5 pb-8">
        {nearby.map((p) => {
          const initials = p.name.split(' ').map((x) => x[0]).join('')
          return (
            <button
              key={p.name}
              onClick={() => go({ kind: 'exchange', name: p.name, role: p.role, accent: p.accent, phone: p.phone, email: p.email, website: p.website, city: p.city })}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-line/60 bg-surface/60 hover:bg-surface-elevated transition"
            >
              <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${p.accent} grid place-items-center text-[14px] font-bold text-white`}>
                {initials}
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-canvas grid place-items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[14.5px] font-semibold leading-tight truncate">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[12px] text-ink-dim">
                  <span className="truncate">{p.role}</span>
                  <span className="text-line-strong flex-shrink-0">·</span>
                  <span className="inline-flex items-center gap-0.5 flex-shrink-0">
                    <MapPin size={10} strokeWidth={1.8} />
                    {p.distance}
                  </span>
                </div>
              </div>
              <span className="h-7 px-3 inline-flex items-center justify-center rounded-full bg-brand text-canvas text-[11px] font-semibold flex-shrink-0">Exchange</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AvatarPin({ name, accent, top, left }: { name: string; accent: string; top: string; left: string }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="absolute" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
      <span className="absolute -inset-1 rounded-full bg-brand/20 animate-ping [animation-duration:1.8s]" />
      <div className={`relative h-9 w-9 rounded-full bg-gradient-to-br ${accent} grid place-items-center text-[11px] font-bold text-white border-2 border-surface-elevated`}>
        {initials}
      </div>
    </div>
  )
}
