import { useState } from 'react'
import { Plus, Eye, Bookmark, Share2, Star, MoreHorizontal, QrCode, Sparkles, Pencil, Copy } from 'lucide-react'
import { MY_CARDS, type MyCard, DASH_USER } from '../data'

export function MyCardsPage() {
  const [selected, setSelected] = useState<string>(MY_CARDS[0].id)
  const card = MY_CARDS.find((c) => c.id === selected) ?? MY_CARDS[0]

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">My Cards</h1>
          <p className="text-[13.5px] text-[#616161] mt-1">
            All your digital cards — paper, AI, conference, personal.
          </p>
        </div>
        <button className="h-11 px-5 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] text-white text-[13.5px] font-semibold rounded-xl hover:opacity-95 transition shadow-sm">
          <Plus className="w-4 h-4" /> New card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-8">
        {/* Card list */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MY_CARDS.map((c) => (
            <CardTile key={c.id} card={c} active={c.id === selected} onClick={() => setSelected(c.id)} />
          ))}
        </div>

        {/* Detail panel */}
        <CardDetail card={card} />
      </div>
    </div>
  )
}

function CardTile({ card, active, onClick }: { card: MyCard; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white border rounded-2xl overflow-hidden transition group ${
        active ? 'border-[#5B8DEF] ring-2 ring-[#EEF2FF]' : 'border-[#EBEBEB] hover:border-[#5B8DEF]/40'
      }`}
    >
      <div className={`relative h-40 bg-gradient-to-br ${card.gradient} p-5 text-white`}>
        <div className="text-[11px] font-medium uppercase tracking-wider opacity-80">{card.style}</div>
        <div className="text-[15.5px] font-semibold mt-1">{DASH_USER.firstName} {DASH_USER.lastName}</div>
        <div className="text-[11.5px] opacity-90 truncate">{DASH_USER.role} · {DASH_USER.company}</div>
        {card.isPrimary && (
          <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur">
            Primary
          </span>
        )}
        <div className="absolute bottom-3 right-3 h-9 w-9 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
          <QrCode className="w-4 h-4" />
        </div>
      </div>
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-[14px] font-semibold text-[#1A1A1A]">{card.name}</div>
          <div className="text-[11px] text-[#616161] truncate">{card.description}</div>
        </div>
        <div className="text-right">
          <div className="text-[16px] tabular-nums font-bold text-[#1A1A1A] leading-none">{card.views}</div>
          <div className="text-[10px] text-[#616161] mt-0.5">views</div>
        </div>
      </div>
    </button>
  )
}

function CardDetail({ card }: { card: MyCard }) {
  const stats = [
    { label: 'Views', value: card.views, Icon: Eye },
    { label: 'Saves', value: card.saves, Icon: Bookmark },
    { label: 'Shares', value: card.shares, Icon: Share2 },
  ]
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-2xl sticky top-0 overflow-hidden">
      <div className="p-6 border-b border-[#F3F3F3]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[14px] font-semibold text-[#1A1A1A]">{card.name}</div>
            <div className="text-[11.5px] text-[#616161] mt-0.5">{card.description}</div>
          </div>
          <button className="p-2 text-[#616161] hover:bg-[#F3F3F3] rounded-xl transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className={`mt-4 h-48 rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white relative`}>
          <div className="text-[10px] font-medium uppercase tracking-wider opacity-80">{card.style}</div>
          <div className="text-[18px] font-semibold mt-1.5">{DASH_USER.firstName} {DASH_USER.lastName}</div>
          <div className="text-[11.5px] opacity-90">{DASH_USER.role}</div>
          <div className="text-[11px] opacity-80 mt-0.5">{DASH_USER.company}</div>
          <div className="absolute bottom-4 left-5 text-[10.5px] opacity-80">{DASH_USER.email}</div>
          <div className="absolute bottom-4 right-5 h-10 w-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
            <QrCode className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="px-6 py-5 grid grid-cols-3 gap-2 border-b border-[#F3F3F3]">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <s.Icon className="w-3.5 h-3.5 mx-auto text-[#616161]" />
            <div className="text-[22px] font-bold tabular-nums text-[#1A1A1A] mt-1.5 leading-none">{s.value}</div>
            <div className="text-[10.5px] text-[#616161] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="p-4 grid grid-cols-2 gap-2">
        <ActionBtn icon={Pencil} label="Edit" />
        <ActionBtn icon={Sparkles} label="Remix in AI" />
        <ActionBtn icon={Copy} label="Duplicate" />
        <ActionBtn icon={Star} label={card.isPrimary ? 'Primary' : 'Set primary'} active={card.isPrimary} />
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center justify-center gap-1.5 h-10 rounded-xl text-[12.5px] font-medium transition ${
        active ? 'bg-[#EEF2FF] text-[#5B8DEF]' : 'bg-[#F8F8F8] text-[#1A1A1A] hover:bg-[#F3F3F3]'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}
