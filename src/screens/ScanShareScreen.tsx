import { useState } from 'react'
import { X, Zap, ZapOff, Image as ImageIcon } from 'lucide-react'
import { useToast } from '../components/Toast'
import { ContactForm } from '../components/ContactForm'
import { MyCardShare } from '../components/MyCardShare'
import { useT } from '../i18n'
import type { View } from '../nav'

type Mode = 'scan' | 'share'
type Side = 'front' | 'back'
type Phase = 'idle' | 'processing' | 'flip' | 'review'

export function ScanShareScreen({
  onBack,
  go,
}: {
  onBack: () => void
  go: (v: View) => void
}) {
  const t = useT()
  const toast = useToast()
  const [mode, setMode] = useState<Mode>('scan')
  const [flash, setFlash] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [side, setSide] = useState<Side>('front')

  const capture = () => {
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
    setPhase('idle')
  }

  const skipBack = () => {
    setPhase('processing')
    setTimeout(() => setPhase('review'), 1100)
  }

  const resetScan = () => {
    setSide('front')
    setPhase('idle')
  }

  if (phase === 'review') {
    return (
      <ContactForm
        header={
          <header className="flex items-center justify-between px-4 pt-12 pb-3">
            <button
              onClick={resetScan}
              aria-label="Back"
              className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80"
            >
              <X size={16} strokeWidth={1.8} />
            </button>
            <h1 className="text-[15px] font-semibold">{t('scan.review.title')}</h1>
            <span className="w-10" />
          </header>
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
          setTimeout(onBack, 500)
        }}
      />
    )
  }

  const scanHint =
    mode === 'scan'
      ? side === 'front'
        ? t('scan.hint.front')
        : t('scan.hint.back')
      : ''

  return (
    <div className="absolute inset-0 bg-black overflow-hidden animate-fade-in">
      {mode === 'scan' ? <CameraBackdrop /> : <ShareBackdrop />}

      {/* Top bar */}
      <header className="relative z-30 flex items-center justify-between px-5 pt-12 pb-3">
        <button
          onClick={onBack}
          aria-label="Close"
          className="h-10 w-10 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-sand-0/10"
        >
          <X size={20} className="text-sand-0" strokeWidth={2.2} />
        </button>
        {mode === 'scan' ? (
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
        ) : (
          <span className="w-10" />
        )}
      </header>

      {/* Side stepper — only in scan mode */}
      {mode === 'scan' && phase !== 'flip' && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 top-[88px] flex items-center gap-2">
          <SideDot active={side === 'front'} done={side === 'back'} label={t('scan.flip.front')} />
          <span className="h-px w-4 bg-sand-0/25" />
          <SideDot active={side === 'back'} done={false} label={t('scan.flip.back')} />
        </div>
      )}

      {/* Body */}
      {mode === 'scan' && (
        <ScanBody processing={phase === 'processing'} hint={scanHint} side={side} />
      )}
      {mode === 'share' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-5 pt-16 pb-48">
          <MyCardShare showPreview={false} bare />
        </div>
      )}

      {/* Flip overlay */}
      {phase === 'flip' && (
        <FlipOverlay onContinue={continueToBack} onSkip={skipBack} t={t} />
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 inset-x-0 z-30 px-6 pb-9 pt-3 flex flex-col items-center gap-4">
        {mode === 'scan' && phase === 'idle' && (
          <div className="flex items-center justify-between w-full max-w-[280px] mb-1">
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

        <Segmented value={mode} onChange={setMode} t={t} />

        <button
          onClick={() => go({ kind: 'manual' })}
          className="text-[13px] font-medium text-sand-0/75 active:text-sand-0 transition"
        >
          {t('scanShare.manual')}
        </button>
      </div>
    </div>
  )
}

/* ───────── Sub-components ───────── */

function ScanBody({
  processing, hint, side,
}: {
  processing: boolean
  hint: string
  side: Side
}) {
  const t = useT()
  return (
    <>
      {/* Frame — bracket corners */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="relative w-[82%] aspect-[1.7/1]">
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <div className="absolute inset-x-3 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent shadow-glow rounded-full animate-[scanShareLine_2.2s_linear_infinite]" />
        </div>
      </div>

      {/* Hint pill */}
      <div className="absolute inset-x-0 z-20 grid place-items-center pointer-events-none" style={{ bottom: '34%' }}>
        <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur border border-sand-0/10">
          <p className="text-[13px] text-sand-0">{hint}</p>
        </div>
      </div>

      {/* Processing overlay */}
      {processing && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="text-center px-8">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-sand-0"
                  style={{ animation: 'dotsBounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-[15px] font-semibold text-sand-0">
              {side === 'front' ? t('scan.proc.front') : t('scan.proc.card.title')}
            </p>
            <p className="text-[12.5px] text-sand-0/55 mt-1.5">{t('scan.proc.holdSteady')}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanShareLine {
          0% { transform: translateY(0%) }
          50% { transform: translateY(100%) }
          100% { transform: translateY(0%) }
        }
        @keyframes dotsBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4 }
          30% { transform: translateY(-4px); opacity: 1 }
        }
      `}</style>
    </>
  )
}

function FlipOverlay({
  onContinue, onSkip, t,
}: {
  onContinue: () => void
  onSkip: () => void
  t: (k: string) => string
}) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/85 backdrop-blur-md animate-fade-in px-7">
      <div className="text-center max-w-[320px]">
        <div className="relative mx-auto mb-6 w-44 aspect-[1.7/1]" style={{ perspective: '900px' }}>
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sand-0/95 to-sand-0/85 shadow-2xl"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'flipCardSS 1.8s ease-in-out infinite',
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

      <style>{`
        @keyframes flipCardSS {
          0%   { transform: rotateY(0deg); }
          50%  { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
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

function SideDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full transition ${
          done ? 'bg-emerald-400' : active ? 'bg-sand-0' : 'bg-sand-0/30'
        }`}
      />
      <span
        className={`text-[12px] font-medium ${
          active ? 'text-sand-0' : done ? 'text-emerald-400' : 'text-sand-0/45'
        }`}
        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
      >
        {label}
      </span>
    </span>
  )
}

function Segmented({
  value, onChange, t,
}: {
  value: Mode
  onChange: (m: Mode) => void
  t: (k: string) => string
}) {
  return (
    <div className="relative flex items-center p-1 rounded-full bg-black/55 backdrop-blur border border-sand-0/10">
      {(['scan', 'share'] as const).map((m) => {
        const active = value === m
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={`px-7 py-2 rounded-full text-[13.5px] font-medium transition ${
              active ? 'bg-sand-0/15 text-sand-0' : 'text-sand-0/55'
            }`}
          >
            {m === 'scan' ? t('scanShare.tab.scan') : t('scanShare.tab.share')}
          </button>
        )
      })}
    </div>
  )
}

function CameraBackdrop() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 16px)',
        }}
      />
    </div>
  )
}

function ShareBackdrop() {
  return (
    <div className="absolute inset-0 bg-black">
      <div
        className="absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 0%, rgba(99,71,255,0.32) 0%, rgba(99,71,255,0.16) 25%, transparent 65%)',
        }}
      />
    </div>
  )
}
