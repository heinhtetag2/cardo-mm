import { useState } from 'react'
import { X, Zap, ZapOff, Image as ImageIcon, PenLine, Check, Loader2 } from 'lucide-react'
import { useToast } from './Toast'
import { useT } from '../i18n'

type Side = 'front' | 'back'
type Phase = 'idle' | 'capturing' | 'flip' | 'reading'

/**
 * Full-screen scanner for capturing the user's OWN paper card. Mirrors the
 * contact scanner's look (flash, Front/Back stepper, sweep beam) but without a
 * Share tab. On finish it calls onFill() with the extracted details; the user
 * can also tap "Type details manually" to skip scanning and edit by hand.
 */
export function CardScanOverlay({
  onClose,
  onFill,
  onManual,
}: {
  onClose: () => void
  onFill: () => void
  onManual?: () => void
}) {
  const t = useT()
  const toast = useToast()
  const [phase, setPhase] = useState<Phase>('idle')
  const [side, setSide] = useState<Side>('front')
  const [flash, setFlash] = useState(false)
  const [shutter, setShutter] = useState(0)

  const capture = () => {
    setShutter((s) => s + 1)
    if (side === 'front') {
      setPhase('capturing')
      setTimeout(() => setPhase('flip'), 1100)
    } else {
      setPhase('reading')
      setTimeout(onFill, 2300)
    }
  }

  const continueToBack = () => {
    setSide('back')
    setPhase('idle')
  }

  const skipBack = () => {
    setPhase('reading')
    setTimeout(onFill, 2300)
  }

  const manual = onManual ?? onClose

  return (
    <div className="absolute inset-0 z-50 bg-black overflow-hidden animate-fade-in">
      {/* Camera backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 16px)',
          }}
        />
      </div>

      {/* Shutter flash */}
      {shutter > 0 && (
        <div
          key={shutter}
          className="absolute inset-0 z-40 bg-white pointer-events-none"
          style={{ animation: 'cardScanFlash 360ms ease-out forwards' }}
        />
      )}

      {/* Top bar */}
      <header className="relative z-30 flex items-center justify-between px-5 pt-12 pb-3">
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-10 w-10 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-sand-0/10"
        >
          <X size={20} className="text-sand-0" strokeWidth={2.2} />
        </button>
        <button
          onClick={() => setFlash((f) => !f)}
          aria-label="Toggle flash"
          className="h-10 w-10 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-sand-0/10"
        >
          {flash ? (
            <Zap size={16} className="text-amber-300" fill="currentColor" />
          ) : (
            <ZapOff size={16} className="text-sand-0/80" />
          )}
        </button>
      </header>

      {/* Front/Back stepper */}
      {phase !== 'flip' && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 top-[88px] flex items-center gap-2">
          <SideDot active={side === 'front'} done={side === 'back'} label={t('scan.flip.front')} />
          <span className="h-px w-4 bg-sand-0/25" />
          <SideDot active={side === 'back'} done={false} label={t('scan.flip.back')} />
        </div>
      )}

      {/* Viewfinder frame + sweep */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="relative w-[82%] aspect-[1.7/1]">
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <div className="absolute inset-[6px] overflow-hidden rounded-[20px]">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgba(99,71,255,0.05) 0px, rgba(99,71,255,0.05) 1px, transparent 1px, transparent 4px)',
              }}
            />
            <div className="absolute inset-x-0" style={{ animation: 'cardScanSweep 2.6s ease-in-out infinite' }}>
              <div
                className="absolute inset-x-0 -top-12 h-24"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(99,71,255,0.32), transparent)' }}
              />
              <div
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent"
                style={{ filter: 'drop-shadow(0 0 7px rgba(99,71,255,0.95))' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute inset-x-0 z-20 grid place-items-center pointer-events-none" style={{ bottom: '34%' }}>
        <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur border border-sand-0/10">
          <p className="text-[13px] text-sand-0">{side === 'front' ? t('scan.hint.front') : t('scan.hint.back')}</p>
        </div>
      </div>

      {/* Capturing-front overlay */}
      {phase === 'capturing' && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="text-center px-8">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-sand-0"
                  style={{ animation: 'cardDotsBounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-[15px] font-semibold text-sand-0">{t('scan.proc.front')}</p>
            <p className="text-[12.5px] text-sand-0/55 mt-1.5">{t('scan.proc.holdSteady')}</p>
          </div>
        </div>
      )}

      {/* Reading / extraction overlay */}
      {phase === 'reading' && <Reading t={t} />}

      {/* Flip overlay */}
      {phase === 'flip' && <FlipOverlay t={t} onContinue={continueToBack} onSkip={skipBack} />}

      {/* Bottom controls */}
      <div className="absolute bottom-0 inset-x-0 z-30 px-6 pb-9 pt-3 flex flex-col items-center gap-4">
        {phase === 'idle' && (
          <div className="flex items-center justify-between w-full max-w-[280px]">
            <button
              onClick={() => toast.show(t('scanShare.library'), 'info')}
              aria-label="Choose photo"
              className="h-11 w-11 grid place-items-center rounded-full bg-sand-0/10 backdrop-blur border border-sand-0/15"
            >
              <ImageIcon size={17} className="text-sand-0" strokeWidth={1.8} />
            </button>
            <button
              onClick={capture}
              aria-label="Capture"
              className="h-[68px] w-[68px] rounded-full bg-sand-0 grid place-items-center active:scale-[0.96] transition"
            >
              <span className="h-[56px] w-[56px] rounded-full border-[3px] border-black" />
            </button>
            <span className="w-11" />
          </div>
        )}

        <button
          onClick={manual}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-sand-0/10 backdrop-blur border border-sand-0/15 text-[13px] font-medium text-sand-0/90 active:scale-[0.97] active:bg-sand-0/15 transition"
        >
          <PenLine size={14} strokeWidth={1.9} className="text-sand-0/80" />
          {t('scanShare.manual')}
        </button>
      </div>

      <style>{`
        @keyframes cardScanSweep {
          0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; }
        }
        @keyframes cardScanFlash {
          0% { opacity: 0.85; } 100% { opacity: 0; }
        }
        @keyframes cardDotsBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4 }
          30% { transform: translateY(-4px); opacity: 1 }
        }
        @keyframes cardFieldIn {
          0% { opacity: 0; transform: translateX(-6px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardProgressFill {
          0% { width: 0%; } 70% { width: 82%; } 100% { width: 100%; }
        }
        @keyframes cardFlip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  )
}

function Reading({ t }: { t: (k: string) => string }) {
  const fields = [
    t('scan.detect.name'),
    t('scan.detect.role'),
    t('scan.detect.company'),
    t('scan.detect.phone'),
    t('scan.detect.email'),
    t('scan.detect.address'),
  ]
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/80 backdrop-blur-md animate-fade-in px-8">
      <div className="w-full max-w-[300px] flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <Loader2 size={15} className="text-brand animate-spin" strokeWidth={2.4} />
          <p className="text-[15px] font-semibold text-sand-0">{t('scan.detect.reading')}</p>
        </div>
        <p className="text-[12px] text-sand-0/55 mt-1">{t('scan.detect.extracting')}</p>

        <div className="mt-4 flex flex-col gap-0.5 w-[176px]">
          {fields.map((f, i) => (
            <div
              key={f}
              className="flex items-center gap-2.5 py-1 opacity-0"
              style={{ animation: 'cardFieldIn 0.4s ease-out forwards', animationDelay: `${0.15 + i * 0.16}s` }}
            >
              <span className="h-[18px] w-[18px] rounded-full bg-emerald-400/12 grid place-items-center flex-shrink-0">
                <Check size={11} className="text-emerald-400" strokeWidth={3} />
              </span>
              <span className="text-[13px] text-sand-0/80">{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 h-1 w-44 rounded-full bg-sand-0/12 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand/70 to-brand"
            style={{ animation: 'cardProgressFill 2.3s ease-out forwards' }}
          />
        </div>
      </div>
    </div>
  )
}

function FlipOverlay({
  t,
  onContinue,
  onSkip,
}: {
  t: (k: string) => string
  onContinue: () => void
  onSkip: () => void
}) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/85 backdrop-blur-md animate-fade-in px-7">
      <div className="text-center max-w-[320px]">
        <div className="relative mx-auto mb-6 w-44 aspect-[1.7/1]" style={{ perspective: '900px' }}>
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sand-0/95 to-sand-0/85 shadow-2xl"
            style={{ transformStyle: 'preserve-3d', animation: 'cardFlip 1.8s ease-in-out infinite' }}
          >
            <div className="absolute top-3 left-4 right-4 flex items-start justify-between">
              <div>
                <div className="h-2 w-12 rounded bg-zinc-800 mb-1" />
                <div className="h-1.5 w-16 rounded bg-zinc-400" />
              </div>
              <div className="h-5 w-5 rounded bg-zinc-800" />
            </div>
            <div className="absolute bottom-3 left-4 right-4 space-y-1">
              <div className="h-1 w-20 rounded bg-zinc-500" />
              <div className="h-1 w-16 rounded bg-zinc-500" />
            </div>
          </div>
        </div>

        <h2 className="text-[20px] font-bold text-sand-0 tracking-tight">{t('scan.flip.title')}</h2>
        <p className="text-[12.5px] text-sand-0/60 mt-2 leading-relaxed">{t('scan.flip.body')}</p>

        <div className="flex flex-col gap-2.5 mt-6">
          <button
            onClick={onContinue}
            className="w-full h-12 rounded-full bg-sand-0 text-black font-semibold text-[14px] active:scale-[0.99] transition"
          >
            {t('scan.flip.continue')}
          </button>
          <button
            onClick={onSkip}
            className="w-full h-11 text-[13.5px] font-medium text-sand-0/70 active:text-sand-0/90 transition"
          >
            {t('scan.flip.skip')}
          </button>
        </div>
      </div>
    </div>
  )
}

function SideDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full transition ${
          done ? 'bg-emerald-400' : active ? 'bg-sand-0' : 'bg-sand-0/30'
        }`}
      />
      <span
        className={`text-[12px] font-medium ${active ? 'text-sand-0' : done ? 'text-emerald-400' : 'text-sand-0/45'}`}
        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
      >
        {label}
      </span>
    </span>
  )
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const map = {
    tl: 'top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-[24px]',
    tr: 'top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-[24px]',
    bl: 'bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-[24px]',
    br: 'bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-[24px]',
  }
  return <div className={`absolute ${map[pos]} w-9 h-9 border-sand-0`} />
}
