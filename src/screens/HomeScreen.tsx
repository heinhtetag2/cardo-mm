import { Search, QrCode, Wand2, Plus, Radar, Gift, ChevronRight } from 'lucide-react'
import type { Tab, View } from '../nav'
import { contacts } from '../data'
import { SectionHeader } from '../components/SectionHeader'

export function HomeScreen({ go, setTab }: { go: (v: View) => void; setTab: (t: Tab) => void }) {
  const recent = contacts.slice(0, 3)
  return (
    <div className="px-5 pt-2 animate-fade-in">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-[24px] border border-line/60 bg-hero-card p-5 mb-7">
        <div className="mb-12">
          <p className="text-[12px] font-semibold text-brand mb-2">Connect smarter</p>
          <h1 className="text-[26px] font-bold tracking-tight leading-[1.1] text-balance">
            The paper card,<br/>reimagined.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => go({ kind: 'my-card' })} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-canvas text-[13px] font-semibold whitespace-nowrap">
            <QrCode size={15} strokeWidth={2.4} /> Share My Card
          </button>
          <button onClick={() => go({ kind: 'register' })} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-line bg-surface/60 text-[13px] font-medium whitespace-nowrap">
            <Plus size={15} strokeWidth={2.4} /> Add Card
          </button>
        </div>
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
      </div>

      {/* Search */}
      <SectionHeader title="Find a contact" size="sm" />
      <div className="mb-7">
        <button
          onClick={() => go({ kind: 'search' })}
          className="w-full flex items-center gap-2.5 px-4 h-12 rounded-2xl border border-line/70 bg-surface text-left"
        >
          <Search size={17} className="text-ink-dim" strokeWidth={1.8} />
          <span className="flex-1 text-[14px] text-ink-dim">Search by name, company…</span>
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2.5 mb-7">
        <QuickAction icon={<QrCode size={18} />} label="Scan QR" onClick={() => go({ kind: 'qr-scan' })} />
        <QuickAction icon={<Wand2 size={18} />} label="Generate" onClick={() => setTab('ai')} />
        <QuickAction icon={<Radar size={18} />} label="Nearby" onClick={() => go({ kind: 'nearby' })} />
      </div>

      {/* Recently saved */}
      <SectionHeader
        title="Recently saved"
        action={<button onClick={() => setTab('cardo')} className="text-[12.5px] text-ink-muted font-medium">See all</button>}
      />
      <div className="space-y-2.5 mb-7">
        {recent.map((c) => (
          <button
            key={c.id}
            onClick={() => go({ kind: 'card-detail', contact: c })}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-line/60 bg-surface/60 hover:bg-surface-elevated transition-colors"
          >
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.accent} grid place-items-center text-[13px] font-bold text-white`}>
              {c.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[14.5px] font-semibold leading-tight truncate">{c.name}</p>
              <p className="text-[12px] text-ink-dim mt-0.5 truncate">{c.role} · {c.company}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated border border-line/60 text-[10.5px] font-semibold text-ink-muted">{c.city}</span>
          </button>
        ))}
      </div>

      {/* Referral */}
      <button onClick={() => go({ kind: 'invite' })} className="relative w-full p-4 rounded-[20px] border border-brand/25 bg-brand/8 flex items-center gap-3.5 mb-4 overflow-hidden">
        <div className="h-11 w-11 rounded-xl border border-brand/30 bg-brand/15 grid place-items-center">
          <Gift size={17} className="text-brand" strokeWidth={1.8} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[14.5px] font-semibold">Earn unlimited credits</p>
          <p className="text-[12px] text-ink-dim mt-0.5">You and your friend each get +1 credit.</p>
        </div>
        <ChevronRight size={18} className="text-ink-dim" strokeWidth={1.8} />
      </button>
    </div>
  )
}

function QuickAction({ icon, label, highlight, onClick }: { icon: React.ReactNode; label: string; highlight?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all
        ${highlight
          ? 'border-brand/40 bg-gradient-to-b from-brand/15 to-transparent'
          : 'border-line/70 bg-surface'
        }`}
    >
      <span className={highlight ? 'text-brand' : 'text-ink'}>{icon}</span>
      <span className={`text-[12px] font-medium ${highlight ? 'text-white' : 'text-ink-muted'}`}>{label}</span>
    </button>
  )
}
