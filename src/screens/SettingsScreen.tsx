import { useState } from 'react'
import {
  Bell, Globe, Lock, Database, Shield, Moon, Accessibility, ChevronRight, CreditCard, Star,
  HelpCircle, Info, Share2, LogOut,
} from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { LogoutConfirm } from '../components/LogoutConfirm'
import { useT, useLang, LANGS } from '../i18n'
import type { View } from '../nav'

export function SettingsScreen({
  onBack, go, onLogout,
}: {
  onBack: () => void
  go: (v: View) => void
  onLogout: () => void
}) {
  const [push, setPush] = useState(true)
  const [nearby, setNearby] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const t = useT()
  const { lang } = useLang()
  const langSub = LANGS.find((l) => l.id === lang)?.label ?? 'English'

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader title={t('settings.title')} onBack={onBack} />

      <div className="px-5 pb-8">
        {/* Upgrade banner */}
        <button
          onClick={() => go({ kind: 'subscription' })}
          className="w-full p-4 rounded-[20px] border border-brand/30 bg-gradient-to-br from-brand/15 via-surface to-surface mb-6 flex items-center gap-3.5"
        >
          <div className="h-11 w-11 rounded-2xl bg-brand-gradient grid place-items-center shadow-glow">
            <Star size={17} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold">{t('settings.upgrade')}</p>
            <p className="text-[11.5px] text-ink-dim mt-0.5">{t('settings.upgrade.sub')}</p>
          </div>
          <ChevronRight size={16} className="text-ink-dim" strokeWidth={1.8} />
        </button>

        <SectionLabel>{t('settings.section.notifications')}</SectionLabel>
        <Group>
          <ToggleRow icon={<Bell size={15} />}  label={t('settings.push')}   sub={t('settings.push.sub')}   value={push}   onChange={setPush} />
          <ToggleRow icon={<Globe size={15} />} label={t('settings.nearby')} sub={t('settings.nearby.sub')} value={nearby} onChange={setNearby} />
        </Group>

        <SectionLabel>{t('settings.section.preferences')}</SectionLabel>
        <Group>
          <NavRow    icon={<Globe size={15} />}         label={t('settings.language')}      sub={langSub}                       onClick={() => go({ kind: 'language' })} />
          <NavRow    icon={<Moon size={15} />}          label={t('settings.appearance')}    sub={t('settings.appearance.sub')}  onClick={() => go({ kind: 'appearance' })} />
          <ToggleRow icon={<Accessibility size={15} />} label={t('settings.reduceMotion')}  sub={t('settings.reduceMotion.sub')} value={reduceMotion} onChange={setReduceMotion} />
        </Group>

        <SectionLabel>{t('settings.section.account')}</SectionLabel>
        <Group>
          <NavRow icon={<CreditCard size={15} />} label={t('settings.subscription')} sub={t('settings.subscription.sub')} onClick={() => go({ kind: 'subscription' })} />
          <NavRow icon={<Lock size={15} />}       label={t('settings.privacy')}      sub={t('settings.privacy.sub')}      onClick={() => go({ kind: 'privacy' })} />
          <NavRow icon={<Shield size={15} />}     label={t('settings.security')}     sub={t('settings.security.sub')}     onClick={() => go({ kind: 'security' })} />
          <NavRow icon={<Database size={15} />}   label={t('settings.dataStorage')}  sub={t('settings.dataStorage.sub')}  onClick={() => go({ kind: 'data-storage' })} />
        </Group>

        <SectionLabel>{t('settings.section.helpAbout')}</SectionLabel>
        <Group>
          <NavRow icon={<HelpCircle size={15} />} label={t('settings.help')}   sub={t('settings.help.sub')}   onClick={() => go({ kind: 'help' })} />
          <NavRow icon={<Share2 size={15} />}     label={t('settings.invite')} sub={t('settings.invite.sub')} onClick={() => go({ kind: 'invite' })} />
          <NavRow icon={<Info size={15} />}       label={t('settings.about')}  sub={t('settings.about.sub')}  onClick={() => go({ kind: 'about' })} />
        </Group>

        <button
          onClick={() => setConfirmLogout(true)}
          className="w-full mt-1 p-3.5 rounded-2xl border border-line/70 bg-surface/60 flex items-center justify-center gap-2 text-[14px] font-semibold text-rose-400 hover:border-rose-500/40 transition"
        >
          <LogOut size={15} strokeWidth={1.8} />
          <span>{t('settings.logout')}</span>
        </button>
      </div>

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
  return <div className="rounded-[20px] border border-line/60 bg-surface/60 overflow-hidden mb-5">{children}</div>
}

function NavRow({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0 hover:bg-surface-elevated transition">
      <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted">{icon}</div>
      <div className="flex-1 text-left">
        <p className="text-[14px] font-semibold leading-tight">{label}</p>
        <p className="text-[11.5px] text-ink-dim mt-0.5">{sub}</p>
      </div>
      <ChevronRight size={16} className="text-ink-dim" strokeWidth={1.8} />
    </button>
  )
}

function ToggleRow({ icon, label, sub, value, onChange }: { icon: React.ReactNode; label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0">
      <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted">{icon}</div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold leading-tight">{label}</p>
        <p className="text-[11.5px] text-ink-dim mt-0.5">{sub}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-7 w-12 rounded-full transition ${value ? 'bg-brand' : 'bg-surface-higher border border-line/70'}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
