import { useState } from 'react'
import { Sparkles, ArrowRight, Check, RefreshCw, Type, Hash, Shapes, Layers } from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import type { Creation } from '../data'

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

  const next = () => {
    if (step === 1) {
      setGenerating(true)
      setTimeout(() => { setGenerating(false); setStep(2) }, 1800)
    } else {
      setStep((s) => Math.min(s + 1, 2))
    }
  }
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-glow-radial pointer-events-none" />
      <SubScreenHeader title={isLogo ? 'AI Logo Studio' : 'AI Card Studio'} onBack={step === 0 ? onBack : prev} right={
        <span className="px-2.5 py-0.5 rounded-full bg-brand/15 border border-brand/30 text-brand text-[10.5px] font-semibold tabular-nums">
          {step + 1} / 3
        </span>
      } />

      {/* Stepper */}
      <div className="px-5 mt-1 mb-5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-brand' : 'bg-line'}`} />
          ))}
        </div>
      </div>

      <div className="relative px-5 pb-32">
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

            <div className="rounded-[20px] border border-brand/30 bg-brand/8 p-4 flex items-start gap-3 mt-3">
              <Sparkles size={16} className="text-brand mt-0.5" strokeWidth={2} />
              <p className="text-[12.5px] text-ink-muted leading-relaxed">
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
              {isLogo ? 'Choose the kind of mark — you\'ll see 3 variations next.' : "Choose a starting point — you'll see 3 variations next."}
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
          <div className="animate-fade-in py-12 text-center">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-brand-gradient grid place-items-center shadow-glow mb-5">
              <Sparkles size={28} className="text-white animate-pulse" />
            </div>
            <h1 className="text-[20px] font-bold">{isLogo ? 'Generating your logos…' : 'Generating your cards…'}</h1>
            <p className="text-[13px] text-ink-dim mt-1.5">This takes about 30 seconds.</p>
            <div className="mt-6 max-w-[220px] mx-auto h-1 rounded-full bg-line overflow-hidden">
              <div className="h-full bg-brand-gradient animate-pulse" style={{ width: '70%' }} />
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

      {/* Bottom CTA */}
      {!generating && (
        <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-canvas border-t border-line/40">
          {step < 2 ? (
            <button onClick={next} className="w-full py-3.5 rounded-2xl bg-ink text-canvas font-semibold text-[15px] flex items-center justify-center gap-2">
              <span>{step === 1 ? 'Generate' : 'Next'}</span>
              {step === 1
                ? <Sparkles size={15} strokeWidth={2.2} />
                : <ArrowRight size={15} strokeWidth={2.2} />}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button onClick={save} className="w-full py-3.5 rounded-2xl bg-brand-gradient text-white font-semibold text-[15px] shadow-glow flex items-center justify-center gap-2">
                <Check size={15} strokeWidth={2.4} />
                <span>{isLogo ? 'Save as my logo' : 'Save as my card'}</span>
              </button>
              <button className="w-full py-3 rounded-2xl border border-line/70 bg-surface text-[13.5px] font-medium text-ink-muted flex items-center justify-center gap-2">
                <RefreshCw size={14} strokeWidth={1.8} />
                <span>Regenerate <span className="text-ink-dim">(1 credit)</span></span>
              </button>
            </div>
          )}
        </div>
      )}
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
               style={{ borderColor: index === 1 ? '#0c0d14' : '#5B8DEF' }}>
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
            className={`px-3.5 h-9 rounded-full text-[12.5px] font-medium border transition inline-flex items-center justify-center leading-none ${
              value === o ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
