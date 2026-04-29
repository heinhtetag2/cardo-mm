import { useState } from 'react'
import { ChevronRight, IdCard, Settings, MapPin, Bell, HelpCircle, FileText, LogOut, Pencil } from 'lucide-react'
import { LogoutConfirm } from '../components/LogoutConfirm'
import type { View } from '../nav'

export function MyInfoScreen({ go, onLogout }: { go: (v: View) => void; onLogout: () => void }) {
  const [confirmLogout, setConfirmLogout] = useState(false)
  return (
    <div className="px-5 pt-2 animate-fade-in">
      {/* Profile header */}
      <div className="relative overflow-hidden rounded-[24px] border border-line/60 bg-gradient-to-br from-[#1a2440] via-surface to-surface p-5 mb-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-brand to-brand-violet p-[2px]">
            <div className="h-full w-full rounded-full bg-canvas grid place-items-center">
              <span className="text-[18px] font-bold">HH</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-bold leading-tight">Hein Htet</p>
            <p className="text-[13px] text-ink-dim mt-0.5 truncate">Product Designer · Yangon</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand/15 border border-brand/30 text-brand text-[10.5px] font-semibold">FREE</span>
              <span className="text-[11px] text-ink-dim">3 AI credits left</span>
            </div>
          </div>
          <button onClick={() => go({ kind: 'edit-profile' })} className="h-9 w-9 grid place-items-center rounded-full border border-line/70 bg-surface/60">
            <Pencil size={14} strokeWidth={1.8} />
          </button>
        </div>
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand/8 blur-3xl pointer-events-none" />
      </div>

      <SectionLabel>My Activity</SectionLabel>
      <Group>
        <Row icon={<IdCard size={16} />} label="My Card" sub="Edit & share your digital card" onClick={() => go({ kind: 'my-card' })} />
        <Row icon={<Settings size={16} />} label="Settings" sub="Account, language, privacy" onClick={() => go({ kind: 'settings' })} />
        <Row icon={<MapPin size={16} />} label="Nearby Cards" sub="Discover people near you" badge="New" onClick={() => go({ kind: 'nearby' })} />
      </Group>

      <SectionLabel>Customer Center</SectionLabel>
      <Group>
        <Row icon={<Bell size={16} />} label="Notice" sub="Announcements & updates" onClick={() => go({ kind: 'notice' })} />
        <Row icon={<HelpCircle size={16} />} label="FAQ" sub="Common questions answered" onClick={() => go({ kind: 'faq' })} />
        <Row icon={<FileText size={16} />} label="Terms & Policies" sub="Privacy, ToS, data handling" onClick={() => go({ kind: 'terms' })} />
      </Group>

      <button
        onClick={() => setConfirmLogout(true)}
        className="w-full mt-5 p-3.5 rounded-2xl border border-line/70 bg-surface/60 flex items-center justify-center gap-2 text-[14px] font-semibold text-rose-400 hover:border-rose-500/40 transition"
      >
        <LogOut size={15} strokeWidth={1.8} />
        <span>Log out</span>
      </button>

      <p className="text-center text-[11px] text-ink-dim mt-5">Cardo Myanmar · v1.0.0</p>

      {confirmLogout && (
        <LogoutConfirm
          onClose={() => setConfirmLogout(false)}
          onConfirm={() => { setConfirmLogout(false); onLogout() }}
        />
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-medium text-ink-dim mt-1 mb-2.5 ml-1">{children}</p>
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[20px] border border-line/60 bg-surface/60 overflow-hidden mb-2">{children}</div>
}

function Row({ icon, label, sub, badge, onClick }: { icon: React.ReactNode; label: string; sub: string; badge?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0 hover:bg-surface-elevated transition">
      <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[14.5px] font-semibold leading-tight">{label}</p>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-brand/20 text-brand text-[10.5px] font-semibold border border-brand/30">{badge}</span>
          )}
        </div>
        <p className="text-[11.5px] text-ink-dim mt-0.5">{sub}</p>
      </div>
      <ChevronRight size={16} className="text-ink-dim" strokeWidth={1.8} />
    </button>
  )
}
