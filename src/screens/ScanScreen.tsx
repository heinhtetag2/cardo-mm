import { useState } from 'react'
import { ChevronLeft, Zap, ZapOff, Image as ImageIcon, RotateCcw, Info } from 'lucide-react'
import { useToast } from '../components/Toast'
import { ContactForm } from '../components/ContactForm'
import { useT } from '../i18n'

type Mode = 'card' | 'qr'
type Side = 'front' | 'back'

export function ScanScreen({ onBack, onDone, mode = 'card' }: { onBack: () => void; onDone?: () => void; mode?: Mode }) {
  const toast = useToast()
  const t = useT()
  const isQR = mode === 'qr'
  const [phase, setPhase] = useState<'scan' | 'flip' | 'processing' | 'review'>('scan')
  const [side, setSide] = useState<Side>('front')
  const [flash, setFlash] = useState(false)
  const finish = onDone ?? onBack

  const capture = () => {
    if (isQR) {
      setPhase('processing')
      setTimeout(() => {
        toast.show(t('scan.toast.received', { name: 'Mya Thandar' }))
        setTimeout(finish, 600)
      }, 1500)
      return
    }
    if (side === 'front') {
      setPhase('processing')
      setTimeout(() => setPhase('flip'), 900)
    } else {
      setPhase('processing')
      setTimeout(() => setPhase('review'), 1500)
    }
  }

  const continueToBack = () => {
    setSide('back')
    setPhase('scan')
  }

  const skipBack = () => {
    setPhase('processing')
    setTimeout(() => setPhase('review'), 1100)
  }

  const retake = () => {
    setSide('front')
    setPhase('scan')
  }

  const headerTitle = isQR ? t('scan.title.qr') : side === 'front' ? t('scan.header.front') : t('scan.header.back')

  return (
    <div className="absolute inset-0 bg-black overflow-hidden animate-fade-in">
      {/* Camera mock background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 16px)',
        }} />
      </div>

      {/* Top bar — only during camera/scanning phases */}
      {phase !== 'review' && (
        <header className="relative z-30 flex items-center justify-between px-4 pt-12 pb-3">
          <button onClick={onBack} className="h-10 w-10 grid place-items-center rounded-full bg-black/50 backdrop-blur border border-sand-0/10">
            <ChevronLeft size={20} className="text-sand-0" strokeWidth={2} />
          </button>
          <p className="text-[13.5px] font-semibold text-sand-0/90">{headerTitle}</p>
          <button onClick={() => setFlash((f) => !f)} className="h-10 w-10 grid place-items-center rounded-full bg-black/50 backdrop-blur border border-sand-0/10">
            {flash ? <Zap size={16} className="text-amber-300" fill="currentColor" /> : <ZapOff size={16} className="text-sand-0/80" />}
          </button>
        </header>
      )}

      {phase === 'scan' && (
        <>
          {isQR ? (
            /* Square viewfinder with live glowing sweep */
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="relative w-[72%] aspect-square">
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
                  <div className="absolute inset-x-0" style={{ animation: 'scanSweep 2.6s ease-in-out infinite' }}>
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
          ) : (
            <>
              {/* Mock paper card in viewfinder */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative w-[78%] aspect-[1.7/1] rounded-2xl bg-gradient-to-br from-sand-0/95 to-sand-0/85 shadow-2xl rotate-[-2deg]">
                  <div className="absolute top-4 left-5 right-5 flex items-start justify-between">
                    <div>
                      <div className="h-2.5 w-16 rounded bg-zinc-800 mb-1.5" />
                      <div className="h-1.5 w-24 rounded bg-zinc-400" />
                    </div>
                    <div className="h-7 w-7 rounded bg-zinc-800" />
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 space-y-1">
                    <div className="h-1.5 w-32 rounded bg-zinc-500" />
                    <div className="h-1.5 w-24 rounded bg-zinc-500" />
                    <div className="h-1.5 w-28 rounded bg-zinc-500" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="relative w-[82%] aspect-[1.7/1]">
                  <Corner pos="tl" />
                  <Corner pos="tr" />
                  <Corner pos="bl" />
                  <Corner pos="br" />
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent shadow-glow animate-[scan_2s_linear_infinite]" />
                </div>
              </div>
            </>
          )}

          {/* Hint */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-sand-0/10">
              <p className="text-[12px] text-sand-0/90">
                {isQR
                  ? t('scan.hint.qr')
                  : side === 'front'
                  ? t('scan.hint.front')
                  : t('scan.hint.back')}
              </p>
            </div>
            {!isQR && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-sand-0/10">
                <SideDot active={side === 'front'} done={side === 'back'} label={t('scan.flip.front')} />
                <span className="h-px w-3 bg-sand-0/20" />
                <SideDot active={side === 'back'} done={false} label={t('scan.flip.back')} />
              </div>
            )}
          </div>
        </>
      )}

      {phase === 'processing' && (
        <ProcessingOverlay isQR={isQR} captionOverride={!isQR && side === 'front' ? t('scan.proc.front') : undefined} />
      )}

      {phase === 'flip' && (
        <FlipOverlay onContinue={continueToBack} onSkip={skipBack} />
      )}

      {phase === 'review' && (
        <ContactForm
          header={
            <header className="flex items-center justify-between px-4 pt-12 pb-3">
              <button onClick={retake} aria-label={t('scan.retake.aria')} className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80">
                <RotateCcw size={16} strokeWidth={1.8} />
              </button>
              <h1 className="text-[15px] font-semibold">{t('scan.review.title')}</h1>
              <span className="w-10" />
            </header>
          }
          topBanner={
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-2xl bg-brand/8 border border-brand/25">
              <Info size={15} className="text-brand mt-0.5 flex-shrink-0" strokeWidth={2} />
              <p className="text-[12.5px] text-ink-muted leading-relaxed">
                {t('scan.review.banner')}
              </p>
            </div>
          }
          initial={{
            name: 'Mya Thandar',
            role: 'Marketing Lead',
            company: 'Bagan Heritage Co.',
            phone: '+95 9 442 110 887',
            email: 'mya@baganheritage.mm',
            website: 'baganheritage.mm',
            city: 'No. 142, Pyay Road, Sanchaung, Yangon',
          }}
          saveLabel={t('scan.save')}
          onSave={() => {
            toast.show(t('scan.toast.saved'))
            setTimeout(finish, 500)
          }}
        />
      )}

      {phase === 'scan' && (
        <div className="absolute bottom-0 inset-x-0 px-6 pb-9 pt-4 z-30">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button onClick={() => toast.show(t('scan.toast.openLib'), 'info')} className="h-12 w-12 rounded-2xl bg-sand-0/10 backdrop-blur border border-sand-0/15 grid place-items-center">
              <ImageIcon size={18} className="text-sand-0" strokeWidth={1.8} />
            </button>
            <button onClick={capture} className="h-[72px] w-[72px] rounded-full bg-sand-0 grid place-items-center">
              <div className="h-[60px] w-[60px] rounded-full border-[3px] border-canvas" />
            </button>
            <span className="w-12" />
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan { 0% { top: 0 } 100% { top: 100% } }
        @keyframes scanSweep {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes dotsBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4 }
          30% { transform: translateY(-4px); opacity: 1 }
        }
      `}</style>
    </div>
  )
}

function ProcessingOverlay({ isQR, captionOverride }: { isQR: boolean; captionOverride?: string }) {
  const t = useT()
  const title = captionOverride ?? (isQR ? t('scan.proc.qr.title') : t('scan.proc.card.title'))
  const sub = captionOverride
    ? t('scan.proc.holdSteady')
    : isQR
    ? t('scan.proc.qr.sub')
    : t('scan.proc.card.sub')
  return (
    <div className="absolute inset-0 grid place-items-center bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="text-center px-8">
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-sand-0"
              style={{ animation: `dotsBounce 1.2s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-[15px] font-semibold text-sand-0">{title}</p>
        <p className="text-[12.5px] text-sand-0/55 mt-1.5 leading-relaxed">{sub}</p>
      </div>
    </div>
  )
}

function FlipOverlay({ onContinue, onSkip }: { onContinue: () => void; onSkip: () => void }) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/85 backdrop-blur-md animate-fade-in px-7">
      <div className="text-center max-w-[320px]">
        <div className="relative mx-auto mb-6 w-44 aspect-[1.7/1]" style={{ perspective: '900px' }}>
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sand-0/95 to-sand-0/85 shadow-2xl"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'flipCard 1.8s ease-in-out infinite',
            }}
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
        <p className="text-[12.5px] text-sand-0/60 mt-2 leading-relaxed">
          {t('scan.flip.body')}
        </p>

        <div className="flex flex-col gap-2.5 mt-6">
          <button onClick={onContinue} className="w-full h-12 rounded-2xl bg-sand-0 text-black font-semibold text-[14px] active:scale-[0.99] transition">
            {t('scan.flip.continue')}
          </button>
          <button onClick={onSkip} className="w-full h-11 text-[13.5px] font-medium text-sand-0/70 active:text-sand-0/90 transition">
            {t('scan.flip.skip')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes flipCard {
          0%   { transform: rotateY(0deg); }
          50%  { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  )
}

function SideDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className={`h-1.5 w-1.5 rounded-full transition ${
          done ? 'bg-emerald-400' : active ? 'bg-sand-0' : 'bg-sand-0/25'
        }`}
      />
      <span className={`text-[10.5px] font-semibold tracking-wider uppercase ${active ? 'text-sand-0' : done ? 'text-emerald-400' : 'text-sand-0/40'}`}>
        {label}
      </span>
    </span>
  )
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const map = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl',
  }
  return <div className={`absolute ${map[pos]} w-7 h-7 border-sand-0`} />
}

