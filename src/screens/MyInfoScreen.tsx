import { useState } from 'react'
import { ChevronRight, IdCard, Settings, MapPin, Bell, HelpCircle, FileText, LogOut, Pencil, Gift } from 'lucide-react'
import { LogoutConfirm } from '../components/LogoutConfirm'
import { account } from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

export function MyInfoScreen({ go, onLogout }: { go: (v: View) => void; onLogout: () => void }) {
  const [confirmLogout, setConfirmLogout] = useState(false)
  const t = useT()
  const planLabel = account.plan === 'pro' ? t('me.plan.pro') : t('me.plan.free')
  return (
    <div className="px-5 pt-2 animate-fade-in">
      {/* Profile header */}
      <button
        onClick={() => go({ kind: 'account' })}
        className="relative w-full text-left overflow-hidden rounded-[24px] border border-line/60 bg-gradient-to-br from-brand/12 via-surface to-surface p-5 mb-5"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-brand to-brand-violet p-[2px]">
            <div className="h-full w-full rounded-full bg-canvas grid place-items-center">
              <span className="text-[18px] font-bold">{account.displayName.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-bold leading-tight">{account.displayName}</p>
            <p className="text-[12px] text-ink-dim mt-1 truncate">{account.loginPhoneMasked}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand/15 border border-brand/30 text-brand text-[10.5px] font-semibold uppercase">{planLabel}</span>
              <span className="text-[11px] text-ink-dim">{t('me.creditsLeft', { n: account.credits })}</span>
            </div>
          </div>
          <span className="h-9 w-9 grid place-items-center rounded-full border border-line/70 bg-surface/60">
            <Pencil size={14} strokeWidth={1.8} />
          </span>
        </div>
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand/8 blur-3xl pointer-events-none" />
      </button>

      {/* Invite friends — earn AI credits */}
      <button
        onClick={() => go({ kind: 'invite' })}
        className="relative w-full overflow-hidden rounded-[20px] border border-brand/25 bg-brand/8 flex items-center gap-3.5 p-4 mb-5"
      >
        <div className="h-11 w-11 rounded-2xl bg-brand-gradient grid place-items-center shadow-glow flex-shrink-0">
          <Gift size={18} className="text-sand-0" strokeWidth={1.8} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[14px] font-semibold leading-tight">{t('me.invite')}</p>
          <p className="text-[11.5px] text-ink-dim mt-0.5">{t('me.invite.sub')}</p>
        </div>
        <ChevronRight size={16} className="text-ink-dim flex-shrink-0" strokeWidth={1.8} />
        <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-brand/10 blur-2xl pointer-events-none" />
      </button>

      <SectionLabel>{t('me.section.activity')}</SectionLabel>
      <Group>
        <Row icon={<IdCard size={16} />}   label={t('me.row.myCard')}   sub={t('me.row.myCard.sub')}   onClick={() => go({ kind: 'my-card' })} />
        <Row icon={<Settings size={16} />} label={t('me.row.settings')} sub={t('me.row.settings.sub')} onClick={() => go({ kind: 'settings' })} />
        <Row icon={<MapPin size={16} />}   label={t('me.row.nearby')}   sub={t('me.row.nearby.sub')}   badge={t('me.row.nearby.badge')} onClick={() => go({ kind: 'nearby' })} />
      </Group>

      <SectionLabel>{t('me.section.customer')}</SectionLabel>
      <Group>
        <Row icon={<Bell size={16} />}       label={t('me.row.notice')} sub={t('me.row.notice.sub')} onClick={() => go({ kind: 'notice' })} />
        <Row icon={<HelpCircle size={16} />} label={t('me.row.faq')}    sub={t('me.row.faq.sub')}    onClick={() => go({ kind: 'faq' })} />
        <Row icon={<FileText size={16} />}   label={t('me.row.terms')}  sub={t('me.row.terms.sub')}  onClick={() => go({ kind: 'terms' })} />
      </Group>

      <button
        onClick={() => setConfirmLogout(true)}
        className="w-full mt-5 p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/8 flex items-center justify-center gap-2 text-[14px] font-semibold text-rose-400 transition"
      >
        <LogOut size={15} strokeWidth={1.8} />
        <span>{t('me.logout')}</span>
      </button>

      <p className="text-center text-[11px] text-ink-dim mt-5">{t('me.version')}</p>

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
