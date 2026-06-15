import { useState } from 'react'
import { Sparkles, Wand2, Zap, ImageIcon, ArrowRight, Check, Clock } from 'lucide-react'
import { AI_GENERATIONS, AI_PRESETS, DASH_STATS, type AIPreset } from '../data'

export function AIStudioPage() {
  const [preset, setPreset] = useState<AIPreset>('Minimal')
  const [prompt, setPrompt] = useState('Marketing lead at a Bagan heritage hospitality brand. Confident, warm, Yangon-based.')

  const creditPct = (DASH_STATS.aiCreditsLeft / DASH_STATS.aiCreditsCap) * 100

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">AI Studio</h1>
          <p className="text-[13.5px] text-[#616161] mt-1">
            Generate Myanmar-flavoured cards with smart presets and your bio.
          </p>
        </div>
        <div className="bg-sand-0 border border-[#EBEBEB] rounded-2xl px-5 py-3 flex items-center gap-3 min-w-[240px]">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5B8DEF] to-[#8B5CF6] grid place-items-center">
            <Sparkles className="w-4 h-4 text-sand-0" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between text-[12.5px]">
              <span className="font-semibold text-[#1A1A1A] tabular-nums">{DASH_STATS.aiCreditsLeft} / {DASH_STATS.aiCreditsCap}</span>
              <span className="text-[#616161] text-[10.5px]">credits</span>
            </div>
            <div className="h-1 w-full bg-[#F3F3F3] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6]" style={{ width: `${creditPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-8">
        {/* Generator */}
        <div className="lg:col-span-2 bg-sand-0 border border-[#EBEBEB] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-4 h-4 text-[#5B8DEF]" />
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">New generation</h2>
          </div>

          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#616161] mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full p-4 bg-[#F8F8F8] border border-transparent rounded-2xl text-[13px] text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:bg-sand-0 focus:border-[#5B8DEF] resize-none"
            placeholder="Describe yourself, your role, the vibe…"
          />

          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#616161] mt-6 mb-3">
            Style preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {AI_PRESETS.map((p) => {
              const active = preset === p.name
              return (
                <button
                  key={p.name}
                  onClick={() => setPreset(p.name)}
                  className={`text-left rounded-2xl border p-4 transition ${
                    active ? 'border-[#5B8DEF] bg-[#F8F8FF] ring-1 ring-[#5B8DEF]/30' : 'border-[#EBEBEB] hover:border-[#5B8DEF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#1A1A1A]">{p.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${p.tone}`}>
                      {p.cost} credits
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#616161] mt-1.5">{p.description}</p>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[11.5px] text-[#616161]">
              <Zap className="w-3.5 h-3.5" />
              ~30 seconds · uses your latest profile photo
            </div>
            <button className="h-11 px-5 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] text-sand-0 text-[13.5px] font-semibold rounded-xl hover:opacity-95 transition shadow-sm">
              Generate card
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-sand-0 border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F3F3F3] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Recent generations</h2>
            <button className="text-[11.5px] font-medium text-[#5B8DEF] hover:text-[#4A7AD9] transition">View all</button>
          </div>
          <ul className="divide-y divide-[#F3F3F3] max-h-[480px] overflow-y-auto">
            {AI_GENERATIONS.map((g) => (
              <li key={g.id}>
                <button className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-[#FAFAFA] transition">
                  <div className="w-12 h-12 rounded-xl grid place-items-center shrink-0" style={{ background: `linear-gradient(135deg, ${g.thumbColor} 0%, #ffffff10 100%)` }}>
                    <ImageIcon className="w-4 h-4 text-sand-0/90" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#1A1A1A] truncate">{g.title}</div>
                    <div className="text-[11px] text-[#616161] truncate">
                      {g.preset} · {g.creditsUsed} credits · {timeAgo(g.createdAt)}
                    </div>
                  </div>
                  <StatusPill status={g.status} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: 'queued' | 'rendering' | 'ready' }) {
  const map = {
    queued: { Icon: Clock, label: 'Queued', tone: 'bg-[#F3F3F3] text-[#616161]' },
    rendering: { Icon: Wand2, label: 'Rendering', tone: 'bg-[#FFF7ED] text-[#C2410C]' },
    ready: { Icon: Check, label: 'Ready', tone: 'bg-[#ECFDF5] text-[#047857]' },
  } as const
  const { Icon, label, tone } = map[status]
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg inline-flex items-center gap-1 ${tone}`}>
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  )
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}
