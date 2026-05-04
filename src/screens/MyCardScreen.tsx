import { Pencil, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'
import { me } from '../data'
import type { View } from '../nav'

export function MyCardScreen({ onBack, go }: { onBack: () => void; go: (v: View) => void }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-glow-radial pointer-events-none" />
      <SubScreenHeader title="My Card" onBack={onBack} right={
        <button onClick={() => go({ kind: 'edit-card' })} className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80">
          <Pencil size={16} strokeWidth={1.8} />
        </button>
      } />

      <div className="relative px-5 pt-2 pb-8">
        {/* Card preview */}
        <div className="relative rounded-[24px] aspect-[1.7/1] bg-hero-card border border-line/70 p-5 mb-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-brand-violet/15 blur-3xl" />
          <div className="relative flex items-start justify-between mb-8">
            <div>
              <p className="text-[10.5px] tracking-[0.22em] font-bold text-brand">CARDO·</p>
              <p className="text-[10.5px] font-medium text-ink-dim mt-1">Connect smarter</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/95 grid place-items-center text-canvas font-black text-[14px]">C</div>
          </div>
          <div className="relative">
            <p className="text-[20px] font-bold tracking-tight leading-tight">{me.name}</p>
            <p className="text-[12.5px] text-ink-muted mt-0.5">{me.role} · {me.city}</p>
          </div>
        </div>

        {/* QR */}
        <div className="rounded-[24px] border border-line/70 bg-surface p-5 mb-5">
          <p className="text-center text-[12px] text-ink-dim mb-4">Scan to save my contact</p>
          <div className="mx-auto w-[200px] aspect-square bg-white rounded-2xl p-3 grid place-items-center">
            <FauxQR />
          </div>
          <p className="text-center text-[13px] text-ink mt-4 font-semibold">{me.website}</p>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(me.website)
              setCopied(true)
              toast.show('Link copied')
              setTimeout(() => setCopied(false), 1500)
            }}
            className="mx-auto mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated border border-line/70 text-[12px] text-ink-muted"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>

      </div>
    </div>
  )
}

function FauxQR() {
  // simple faux QR — 17×17 grid with random looking modules
  const cells: boolean[][] = []
  let seed = 11
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  for (let r = 0; r < 17; r++) {
    const row: boolean[] = []
    for (let c = 0; c < 17; c++) row.push(rnd() > 0.55)
    cells.push(row)
  }
  // place finder squares (3 corners)
  const finders: [number, number][] = [[0, 0], [0, 12], [12, 0]]
  for (const [fr, fc] of finders) {
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 5; c++) {
        const isOuter = r === 0 || r === 4 || c === 0 || c === 4
        const isInner = r >= 1 && r <= 3 && c >= 1 && c <= 3
        const isCenter = r >= 2 && r <= 2 && c >= 2 && c <= 2
        cells[fr + r][fc + c] = isOuter || isCenter || (isInner && r === 2 && c === 2) ? true : (isInner ? false : false)
      }
  }
  return (
    <div className="grid grid-cols-[repeat(17,1fr)] gap-[2px] w-full h-full">
      {cells.flatMap((row, r) => row.map((on, c) => (
        <div key={`${r}-${c}`} className={`aspect-square rounded-[1px] ${on ? 'bg-canvas' : 'bg-white'}`} />
      )))}
    </div>
  )
}
