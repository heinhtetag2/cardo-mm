import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { me } from '../data'
import { useToast } from './Toast'
import { useT } from '../i18n'

export function MyCardShare({
  showPreview = true,
  bare = false,
}: {
  showPreview?: boolean
  bare?: boolean
}) {
  const t = useT()
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  const qrSection = (
    <>
      <p className="text-center text-[12.5px] text-sand-0 mb-4 max-w-[230px] mx-auto leading-snug">{t('myCard.scanSave')}</p>
      <div className="mx-auto w-[200px] aspect-square bg-sand-0 rounded-2xl p-3 grid place-items-center">
        <FauxQR />
      </div>
      <p className="text-center text-[13px] text-ink mt-4 font-semibold">{me.website}</p>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(me.website)
          setCopied(true)
          toast.show(t('myCard.toast.copied'))
          setTimeout(() => setCopied(false), 1500)
        }}
        className="mx-auto mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated border border-line/70 text-[12px] text-ink-muted"
      >
        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        {copied ? t('myCard.copied') : t('myCard.copy')}
      </button>
    </>
  )

  return (
    <div className="w-full">
      {showPreview && (
        /* Card preview */
        <div className="relative rounded-[24px] aspect-[1.7/1] bg-hero-card border border-line/70 p-5 mb-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-brand-violet/15 blur-3xl" />
          <div className="relative flex items-start justify-between mb-8">
            <div>
              <p className="text-[10.5px] tracking-[0.22em] font-bold text-brand">SWAPO·</p>
              <p className="text-[10.5px] font-medium text-ink-dim mt-1">{t('myCard.kicker')}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-sand-0/95 grid place-items-center text-zinc-950 font-black text-[14px]">S</div>
          </div>
          <div className="relative">
            <p className="text-[20px] font-bold tracking-tight leading-tight">{me.name}</p>
            <p className="text-[12.5px] text-ink-muted mt-0.5">{me.role} · {me.city}</p>
          </div>
        </div>
      )}

      {bare ? (
        qrSection
      ) : (
        <div className="rounded-[24px] border border-line/70 bg-surface p-5">{qrSection}</div>
      )}
    </div>
  )
}

function FauxQR() {
  const cells: boolean[][] = []
  let seed = 11
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  for (let r = 0; r < 17; r++) {
    const row: boolean[] = []
    for (let c = 0; c < 17; c++) row.push(rnd() > 0.55)
    cells.push(row)
  }
  const finders: [number, number][] = [[0, 0], [0, 12], [12, 0]]
  for (const [fr, fc] of finders) {
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 5; c++) {
        const isOuter = r === 0 || r === 4 || c === 0 || c === 4
        const isInner = r >= 1 && r <= 3 && c >= 1 && c <= 3
        cells[fr + r][fc + c] = isOuter || (isInner && r === 2 && c === 2)
      }
  }
  return (
    <div className="grid grid-cols-[repeat(17,1fr)] gap-[2px] w-full h-full">
      {cells.flatMap((row, r) => row.map((on, c) => (
        <div key={`${r}-${c}`} className={`aspect-square rounded-[1px] ${on ? 'bg-zinc-950' : 'bg-sand-0'}`} />
      )))}
    </div>
  )
}
