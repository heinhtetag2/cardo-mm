import { useEffect, useState } from 'react'
import { Sparkles, Check, Type, Hash, Shapes, Layers, RefreshCw, Info } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import type { Creation } from '../data'

const CARD_STATUS = ['Analyzing your brand…', 'Generating layouts…', 'Polishing details…']
const LOGO_STATUS = ['Analyzing your brand…', 'Sketching marks…', 'Polishing details…']

type Mode = 'card' | 'logo'

const cardStyles = [
  { id: 'minimal',   name: 'Minimal',   desc: 'Clean type, monochrome',   accent: 'from-zinc-700/60 to-zinc-900/60' },
  { id: 'gradient',  name: 'Gradient',  desc: 'Bold color, modern',       accent: 'from-brand/40 to-brand-violet/40' },
  { id: 'editorial', name: 'Editorial', desc: 'Serif elegance',            accent: 'from-amber-500/40 to-rose-500/40' },
  { id: 'mono',      name: 'Mono',      desc: 'Black & white, typographic', accent: 'from-slate-700/50 to-slate-900/50' },
]

const logoTypes = [
  { id: 'wordmark',    name: 'Wordmark',    desc: 'Brand name, set in type',  icon: <Type size={18} strokeWidth={1.8} /> },
  { id: 'lettermark',  name: 'Lettermark',  desc: 'Initials in a mark',       icon: <Hash size={18} strokeWidth={1.8} /> },
  { id: 'symbol',      name: 'Symbol',      desc: 'Abstract icon mark',        icon: <Shapes size={18} strokeWidth={1.8} /> },
  { id: 'combination', name: 'Combination', desc: 'Symbol with brand name',    icon: <Layers size={18} strokeWidth={1.8} /> },
]

const logoTones = ['Professional', 'Playful', 'Bold', 'Elegant', 'Modern', 'Minimal']

export function AICreateScreen({ onBack, mode, onSave }: { onBack: () => void; mode: Mode; onSave: (c: Creation) => void }) {
  const isLogo = mode === 'logo'

  const save = () => {
    onSave({
      id: `${mode}-${Date.now()}`,
      kind: mode,
      name,
      role: isLogo ? undefined : role,
      industry: isLogo ? undefined : industry,
      tone: isLogo ? tone : undefined,
      styleId,
      variation: picked,
      createdAt: Date.now(),
    })
    onBack()
  }

  const [step, setStep] = useState(0)
  const [name, setName] = useState(isLogo ? 'Cardo' : 'Hein Htet')
  const [role, setRole] = useState('Product Designer')
  const [industry, setIndustry] = useState('Tech')
  const [tone, setTone] = useState('Modern')
  const [styleId, setStyleId] = useState(isLogo ? 'symbol' : 'gradient')
  const [generating, setGenerating] = useState(false)
  const [picked, setPicked] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)

  useEffect(() => {
    if (!generating) {
      setStatusIdx(0)
      return
    }
    const id = setInterval(() => setStatusIdx((s) => Math.min(s + 1, 2)), 600)
    return () => clearInterval(id)
  }, [generating])

  const next = () => {
    if (step === 1) {
      setGenerating(true)
      setTimeout(() => { setGenerating(false); setStep(2) }, 1800)
    } else {
      setStep((s) => Math.min(s + 1, 2))
    }
  }
  const prev = () => setStep((s) => Math.max(s - 1, 0))
  const regenerate = () => {
    setStep(0)
    setPicked(0)
  }

  return (
    <div className="absolute inset-0 bg-canvas flex flex-col animate-fade-in">
      {/* Static background glow */}
      <div className="absolute inset-x-0 top-0 h-[420px] bg-glow-radial pointer-events-none z-0" />

      {/* Fixed top: header + stepper */}
      <div className="relative z-30 flex-shrink-0 bg-canvas/80 backdrop-blur">
        <SubScreenHeader
          title={isLogo ? 'AI Logo Studio' : 'AI Card Studio'}
          onBack={step === 0 ? onBack : prev}
          variant="overlay"
          right={
            <span className="px-2.5 py-0.5 rounded-full bg-brand/15 border border-brand/30 text-brand text-[10.5px] font-semibold tabular-nums">
              {step + 1} / 3
            </span>
          }
        />
        <div className="px-5 mt-1 pb-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-brand' : 'bg-line'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable area + floating bottom CTA share the same flex-1 container */}
      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
          <div className="px-5 pt-2 pb-40">
        {step === 0 && (
          <div className="animate-fade-in">
            {isLogo ? (
              <>
                <h1 className="text-[24px] font-bold tracking-tight leading-tight">Tell us about your brand</h1>
                <p className="text-[13px] text-ink-dim mt-1.5 mb-6">Cardo's AI will design 3 logos based on your brand details.</p>
                <Field label="Brand name" value={name} onChange={setName} />
                <SelectField label="Industry" value={industry} onChange={setIndustry} options={['Tech', 'Finance', 'Logistics', 'Creative', 'Healthcare', 'Government', 'F&B', 'Other']} />
                <SelectField label="Brand tone" value={tone} onChange={setTone} options={logoTones} />
              </>
            ) : (
              <>
                <h1 className="text-[24px] font-bold tracking-tight leading-tight">Tell us about you</h1>
                <p className="text-[13px] text-ink-dim mt-1.5 mb-6">Cardo's AI will design 3 cards based on your details.</p>
                <Field label="Full name" value={name} onChange={setName} />
                <Field label="Role / Title" value={role} onChange={setRole} />
                <SelectField label="Industry" value={industry} onChange={setIndustry} options={['Tech', 'Finance', 'Logistics', 'Creative', 'Healthcare', 'Government', 'F&B', 'Other']} />
              </>
            )}

            <div className="flex items-start gap-2.5 px-3.5 py-3 mt-3 rounded-2xl border border-line/60 bg-surface-elevated">
              <Info size={14} className="text-ink-muted mt-0.5 flex-shrink-0" strokeWidth={1.8} />
              <p className="text-[12px] text-ink-dim leading-relaxed">
                {isLogo
                  ? "We'll suggest mark types, color, and typography that match your brand. You can edit anything after."
                  : "We'll use these to suggest a tone, palette, and layout. You can always edit after."}
              </p>
            </div>
          </div>
        )}

        {step === 1 && !generating && (
          <div className="animate-fade-in">
            <h1 className="text-[24px] font-bold tracking-tight leading-tight">{isLogo ? 'Pick a logo type' : 'Pick a style'}</h1>
            <p className="text-[13px] text-ink-dim mt-1.5 mb-6">
              {isLogo ? "Choose the kind of mark. You'll see 3 variations next." : "Choose a starting point. You'll see 3 variations next."}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {isLogo
                ? logoTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setStyleId(t.id)}
                      className={`relative p-4 rounded-2xl border text-left overflow-hidden ${styleId === t.id ? 'border-brand ring-2 ring-brand/30' : 'border-line/70'}`}
                    >
                      <div className="h-20 rounded-xl bg-surface-elevated border border-line/50 mb-3 grid place-items-center text-ink/80">
                        {t.icon}
                      </div>
                      <p className="text-[14px] font-semibold">{t.name}</p>
                      <p className="text-[11.5px] text-ink-dim mt-0.5">{t.desc}</p>
                      {styleId === t.id && (
                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-brand grid place-items-center">
                          <Check size={13} strokeWidth={2.6} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))
                : cardStyles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyleId(s.id)}
                      className={`relative p-3 rounded-2xl border text-left overflow-hidden ${styleId === s.id ? 'border-brand ring-2 ring-brand/30' : 'border-line/70'}`}
                    >
                      <div className={`h-20 rounded-xl bg-gradient-to-br ${s.accent} mb-3 grid place-items-center`}>
                        <div className="h-7 w-12 rounded bg-white/20 backdrop-blur-sm" />
                      </div>
                      <p className="text-[14px] font-semibold">{s.name}</p>
                      <p className="text-[11.5px] text-ink-dim mt-0.5">{s.desc}</p>
                      {styleId === s.id && (
                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-brand grid place-items-center">
                          <Check size={13} strokeWidth={2.6} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
            </div>
          </div>
        )}

        {step === 1 && generating && (
          <div className="animate-fade-in py-10 text-center relative">
            {/* Ambient glow */}
            <div className="absolute inset-x-0 top-2 h-[260px] pointer-events-none">
              <div className="absolute left-1/2 top-6 -translate-x-1/2 h-44 w-44 rounded-full bg-brand-violet/30 blur-3xl animate-soft-pulse" />
              <div
                className="absolute left-1/2 top-10 -translate-x-1/2 h-36 w-36 rounded-full bg-brand/35 blur-3xl animate-soft-pulse"
                style={{ animationDelay: '0.9s' }}
              />
            </div>

            {/* Orb */}
            <div className="relative mx-auto mt-4 h-32 w-32 grid place-items-center">
              {/* Outer pulse ring */}
              <span className="absolute inset-0 rounded-full border border-brand/30 animate-ping" />
              {/* Rotating dashed rings */}
              <span className="absolute inset-1 rounded-full border border-dashed border-brand/45 animate-spin-slow" />
              <span className="absolute inset-4 rounded-full border border-dashed border-brand-violet/50 animate-spin-rev" />
              {/* Core orb — glassy radial */}
              <div className="relative h-20 w-20 rounded-full grid place-items-center shadow-glow overflow-hidden">
                {/* Radial base */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(120% 100% at 30% 18%, #C5DBFF 0%, #5B8DEF 38%, #6B4FCF 78%, #2E1773 100%)',
                  }}
                />
                {/* Rotating conic shimmer */}
                <div
                  className="absolute -inset-2 mix-blend-overlay opacity-70 animate-spin-slow"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.45) 60deg, transparent 130deg, transparent 240deg, rgba(255,255,255,0.35) 310deg, transparent 360deg)',
                  }}
                />
                {/* Top highlight */}
                <div className="absolute inset-x-3 top-1.5 h-3 rounded-full bg-white/40 blur-[6px] pointer-events-none" />
                {/* Inner edge */}
                <div className="absolute inset-0 rounded-full border border-white/15 pointer-events-none" />
                {/* Icon */}
                <Sparkles size={26} className="relative text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]" strokeWidth={1.8} />
              </div>
              {/* Floating sparkle particles */}
              <span className="absolute top-2 right-3 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-float-a" />
              <span className="absolute bottom-4 left-1 h-1 w-1 rounded-full bg-brand-violet shadow-[0_0_6px_rgba(139,92,246,0.8)] animate-float-b" />
              <span className="absolute top-10 left-1 h-1 w-1 rounded-full bg-brand shadow-[0_0_6px_rgba(91,141,239,0.8)] animate-float-c" />
            </div>

            <h1 className="text-[20px] font-bold mt-7">
              {isLogo ? 'Generating your logos…' : 'Generating your cards…'}
            </h1>
            <p key={statusIdx} className="text-[13px] text-ink-dim mt-1.5 h-5 animate-fade-in">
              {(isLogo ? LOGO_STATUS : CARD_STATUS)[statusIdx]}
            </p>

            {/* Real progress bar */}
            <div className="mt-6 max-w-[240px] mx-auto h-1 rounded-full bg-line overflow-hidden">
              <div className="h-full origin-left bg-brand-gradient animate-progress-fill" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-[24px] font-bold tracking-tight leading-tight">Pick your favorite</h1>
            <p className="text-[13px] text-ink-dim mt-1.5 mb-6">Tap to preview. Save the one you love.</p>

            <div className={`${isLogo ? 'grid grid-cols-1 gap-3' : 'space-y-3'}`}>
              {[0, 1, 2].map((i) =>
                isLogo ? (
                  <LogoPreview key={i} index={i} brand={name} tone={tone} type={styleId} picked={picked === i} onClick={() => setPicked(i)} />
                ) : (
                  <CardPreview key={i} index={i} name={name} role={role} industry={industry} picked={picked === i} onClick={() => setPicked(i)} />
                ),
              )}
            </div>
          </div>
        )}
          </div>
        </div>

        {/* Floating bottom CTA */}
        {!generating && (
          <div className="absolute bottom-0 inset-x-0 z-20 px-5 pb-6 pt-8 bg-gradient-to-t from-canvas via-canvas to-canvas/0 pointer-events-none">
            <div className="pointer-events-auto">
              {step < 2 ? (
                <button onClick={next} className="w-full pt-[15px] pb-3.5 rounded-2xl bg-ink text-canvas font-semibold text-[15px] flex items-center justify-center">
                  {step === 1 ? 'Generate' : 'Next'}
                </button>
              ) : (
                <>
                  <button
                    onClick={save}
                    className="w-full pt-[15px] pb-3.5 rounded-2xl bg-ink text-canvas font-semibold text-[15px] flex items-center justify-center active:scale-[0.99] transition"
                  >
                    {isLogo ? 'Save as my logo' : 'Save as my card'}
                  </button>
                  <button
                    onClick={regenerate}
                    className="w-full mt-1 py-3 text-[13px] text-ink-muted font-medium inline-flex items-center justify-center gap-1.5 hover:text-ink transition"
                  >
                    <RefreshCw size={13} strokeWidth={2} />
                    Regenerate
                    <span className="text-ink-dim">· 1 credit</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CardPreview({ index, name, role, industry, picked, onClick }: { index: number; name: string; role: string; industry: string; picked: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-[20px] border-2 transition-all ${picked ? 'border-brand shadow-glow' : 'border-line/60'}`}
    >
      <div className={`relative aspect-[1.7/1] rounded-[18px] overflow-hidden bg-gradient-to-br
        ${index === 0 ? 'from-[#1a2440] via-[#171b2c] to-[#0c0d14]' :
          index === 1 ? 'from-violet-500/40 via-fuchsia-500/30 to-canvas' :
          'from-emerald-500/40 via-teal-600/30 to-canvas'}`}>
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative p-5 flex flex-col h-full justify-between">
          <div className="flex items-start justify-between">
            <p className="text-[10.5px] tracking-[0.22em] font-bold text-white">CARDO·</p>
            <div className="h-9 w-9 rounded-xl bg-white grid place-items-center text-canvas font-black text-[13px]">C</div>
          </div>
          <div>
            <p className="text-[19px] font-bold">{name}</p>
            <p className="text-[12px] text-ink-muted mt-0.5">{role} · {industry}</p>
          </div>
        </div>
      </div>
      {picked && (
        <div className="absolute top-3 left-3 h-7 w-7 rounded-full bg-brand grid place-items-center shadow-glow">
          <Check size={14} strokeWidth={2.6} className="text-white" />
        </div>
      )}
    </button>
  )
}

function LogoPreview({ index, brand, tone, type, picked, onClick }: { index: number; brand: string; tone: string; type: string; picked: boolean; onClick: () => void }) {
  const initials = brand.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'C'
  const palettes = [
    { from: '#1a2440', to: '#0c0d14', mark: 'text-white', accent: 'bg-brand' },
    { from: '#fef3c7', to: '#fde68a', mark: 'text-zinc-900', accent: 'bg-zinc-900' },
    { from: '#0c0d14', to: '#0c0d14', mark: 'text-brand', accent: 'bg-brand' },
  ]
  const p = palettes[index]

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-[20px] border-2 transition-all overflow-hidden ${picked ? 'border-brand shadow-glow' : 'border-line/60'}`}
    >
      <div
        className="relative aspect-[2.4/1] grid place-items-center"
        style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
      >
        {type === 'wordmark' && (
          <p className={`text-[28px] font-bold tracking-tight ${p.mark}`}>{brand}</p>
        )}
        {type === 'lettermark' && (
          <div className={`h-16 w-16 rounded-2xl ${p.accent} grid place-items-center`}>
            <p className="text-white text-[24px] font-black tracking-tight">{initials}</p>
          </div>
        )}
        {type === 'symbol' && (
          <div className={`h-16 w-16 rounded-full border-[3px] grid place-items-center`}
               style={{ borderColor: index === 1 ? '#0c0d14' : 'rgb(var(--brand))' }}>
            <div className={`h-7 w-7 rounded-full ${p.accent}`} />
          </div>
        )}
        {type === 'combination' && (
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl ${p.accent} grid place-items-center`}>
              <p className="text-white text-[18px] font-black">{initials[0]}</p>
            </div>
            <p className={`text-[20px] font-bold tracking-tight ${p.mark}`}>{brand}</p>
          </div>
        )}
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold capitalize">{type} · {tone.toLowerCase()}</p>
          <p className="text-[11px] text-ink-dim mt-0.5">Variation {index + 1}</p>
        </div>
        {picked && (
          <div className="h-7 w-7 rounded-full bg-brand grid place-items-center shadow-glow">
            <Check size={14} strokeWidth={2.6} className="text-white" />
          </div>
        )}
      </div>
    </button>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-[11.5px] font-semibold text-ink-dim mb-1.5 ml-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-2xl border border-line/70 bg-surface text-[14px] outline-none focus:border-brand/60 transition"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="mb-3">
      <label className="block text-[11.5px] font-semibold text-ink-dim mb-1.5 ml-1">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            className={`px-3.5 h-9 pt-px rounded-full text-[12.5px] font-medium border transition inline-flex items-center justify-center ${
              value === o ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
