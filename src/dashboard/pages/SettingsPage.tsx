import { useState } from 'react'
import {
  User, Globe, Palette, Bell, Lock, Shield, Database, Plug, ChevronRight, Check, Camera, Sun, Moon, Monitor,
} from 'lucide-react'
import {
  DASH_USER, LANGUAGES, NOTIFICATION_PREFS, CONNECTED_APPS,
  type Appearance, type NotificationPref, type ConnectedApp,
} from '../data'

type Section = 'profile' | 'language' | 'appearance' | 'notifications' | 'privacy' | 'security' | 'data' | 'integrations'

type SectionItem = { id: Section; label: string; subtitle: string; icon: React.ElementType }

const NAV_GROUPS: { label: string; items: SectionItem[] }[] = [
  {
    label: 'Personal',
    items: [
      { id: 'profile', label: 'Profile', subtitle: 'Name, role, photo', icon: User },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { id: 'language', label: 'Language', subtitle: 'English / မြန်မာ', icon: Globe },
      { id: 'appearance', label: 'Appearance', subtitle: 'Theme & accent', icon: Palette },
      { id: 'notifications', label: 'Notifications', subtitle: 'Email, push, in-app', icon: Bell },
    ],
  },
  {
    label: 'Privacy & Security',
    items: [
      { id: 'privacy', label: 'Privacy', subtitle: 'Visibility & data', icon: Lock },
      { id: 'security', label: 'Security', subtitle: '2FA, sessions', icon: Shield },
      { id: 'data', label: 'Data & storage', subtitle: 'Export, deletion', icon: Database },
      { id: 'integrations', label: 'Integrations', subtitle: 'Google, Apple…', icon: Plug },
    ],
  },
]

export function SettingsPage() {
  const [section, setSection] = useState<Section>('profile')

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-[#1A1A1A]">Settings</h1>
        <p className="text-[13.5px] text-[#616161] mt-1">Account, preferences, integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start pb-8">
        {/* Section list */}
        <nav className="bg-sand-0 border border-[#EBEBEB] rounded-2xl p-3 sticky top-0 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-[#9A9A9A]">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((s) => {
                  const active = s.id === section
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSection(s.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                        active ? 'bg-[#EEF2FF] text-[#5B8DEF]' : 'text-[#1A1A1A] hover:bg-[#F8F8F8]'
                      }`}
                    >
                      <s.icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#5B8DEF]' : 'text-[#616161]'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium">{s.label}</div>
                        <div className="text-[10.5px] text-[#616161] truncate">{s.subtitle}</div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-[#5B8DEF]' : 'text-[#9A9A9A]'}`} />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Content */}
        <div>
          {section === 'profile' && <ProfileSection />}
          {section === 'language' && <LanguageSection />}
          {section === 'appearance' && <AppearanceSection />}
          {section === 'notifications' && <NotificationsSection />}
          {section === 'privacy' && <PrivacySection />}
          {section === 'security' && <SecuritySection />}
          {section === 'data' && <DataSection />}
          {section === 'integrations' && <IntegrationsSection />}
        </div>
      </div>
    </div>
  )
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-sand-0 border border-[#EBEBEB] rounded-2xl mb-5 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F3F3F3]">
        <h2 className="text-[16px] font-semibold text-[#1A1A1A]">{title}</h2>
        {subtitle && <p className="text-[11.5px] text-[#616161] mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#616161] mb-2">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, placeholder }: { value?: string; placeholder?: string }) {
  return (
    <input
      defaultValue={value}
      placeholder={placeholder}
      className="w-full h-11 px-4 bg-[#F8F8F8] border border-transparent rounded-xl text-[13px] text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:outline-none focus:bg-sand-0 focus:border-[#5B8DEF] transition"
    />
  )
}

function ProfileSection() {
  return (
    <Card title="Profile" subtitle="What people see when they save your card">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B8DEF] to-[#8B5CF6] text-sand-0 grid place-items-center text-[20px] font-semibold">
          {DASH_USER.initials}
        </div>
        <div>
          <button className="h-10 px-4 inline-flex items-center gap-1.5 bg-[#F8F8F8] hover:bg-[#F3F3F3] rounded-xl text-[12.5px] font-medium text-[#1A1A1A] transition">
            <Camera className="w-3.5 h-3.5" /> Change photo
          </button>
          <p className="text-[10.5px] text-[#616161] mt-1.5">PNG or JPG · max 5MB</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First name"><Input value={DASH_USER.firstName} /></Field>
        <Field label="Last name"><Input value={DASH_USER.lastName} /></Field>
        <Field label="Role / title"><Input value={DASH_USER.role} /></Field>
        <Field label="Company"><Input value={DASH_USER.company} /></Field>
        <Field label="Email"><Input value={DASH_USER.email} /></Field>
        <Field label="Phone"><Input value={DASH_USER.phone} /></Field>
        <div className="sm:col-span-2">
          <Field label="City"><Input value={DASH_USER.city} placeholder="Yangon, Mandalay, Naypyidaw…" /></Field>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button className="h-10 px-4 text-[12.5px] font-medium text-[#616161] hover:text-[#1A1A1A] transition">Cancel</button>
        <button className="h-10 px-5 inline-flex items-center gap-1.5 bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] text-sand-0 text-[12.5px] font-semibold rounded-xl hover:opacity-95 transition">
          Save changes
        </button>
      </div>
    </Card>
  )
}

function LanguageSection() {
  const [lang, setLang] = useState<'en' | 'my'>('en')
  return (
    <Card title="Language" subtitle="Choose your interface language">
      <div className="space-y-2.5">
        {LANGUAGES.map((l) => {
          const active = lang === l.code
          return (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border transition ${
                active ? 'border-[#5B8DEF] bg-[#F8F8FF]' : 'border-[#EBEBEB] hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="text-left">
                <div className="text-[13.5px] font-medium text-[#1A1A1A]">{l.label}</div>
                <div className="text-[11.5px] text-[#616161]">{l.native}</div>
              </div>
              {active && (
                <span className="w-5 h-5 rounded-full bg-[#5B8DEF] grid place-items-center">
                  <Check className="w-3 h-3 text-sand-0" />
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="text-[11px] text-[#616161] mt-4">
        AI prompts and contact card text translate automatically when you switch.
      </p>
    </Card>
  )
}

function AppearanceSection() {
  const [theme, setTheme] = useState<Appearance>('system')
  const themes: { id: Appearance; label: string; icon: React.ElementType }[] = [
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ]
  return (
    <Card title="Appearance" subtitle="Theme used across web and mobile">
      <div className="grid grid-cols-3 gap-2.5">
        {themes.map((t) => {
          const active = theme === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 py-5 rounded-2xl border transition ${
                active ? 'border-[#5B8DEF] bg-[#F8F8FF]' : 'border-[#EBEBEB] hover:bg-[#FAFAFA]'
              }`}
            >
              <t.icon className={`w-5 h-5 ${active ? 'text-[#5B8DEF]' : 'text-[#616161]'}`} />
              <span className={`text-[12.5px] font-medium ${active ? 'text-[#5B8DEF]' : 'text-[#1A1A1A]'}`}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPref[]>(NOTIFICATION_PREFS)
  const toggle = (id: string) => setPrefs((p) => p.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n))
  return (
    <Card title="Notifications" subtitle="Pick what reaches you and how">
      <ul className="divide-y divide-[#F3F3F3] -m-6">
        {prefs.map((n) => (
          <li key={n.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[#1A1A1A]">{n.label}</div>
              <div className="text-[11.5px] text-[#616161]">{n.description}</div>
            </div>
            <Toggle on={n.enabled} onChange={() => toggle(n.id)} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

function PrivacySection() {
  return (
    <>
      <Card title="Profile visibility" subtitle="Who can find you on Swapo">
        <ToggleRow label="Discoverable by phone or email" hint="People with your number can find your card" defaultOn />
        <ToggleRow label="Show in Nearby" hint="Appear to others within ~50m" defaultOn />
        <ToggleRow label="Show city publicly" hint="Display Yangon on your card" defaultOn />
      </Card>
      <Card title="Contact data" subtitle="What you share when someone saves you">
        <ToggleRow label="Share email automatically" hint="Default on for Lead-tagged scans" defaultOn />
        <ToggleRow label="Share phone automatically" hint="Off. Ask first" />
        <ToggleRow label="Share LinkedIn link" hint="Public profile only" defaultOn />
      </Card>
    </>
  )
}

function SecuritySection() {
  return (
    <>
      <Card title="Password" subtitle="Last changed 14 Aug 2025">
        <button className="h-11 px-5 inline-flex items-center bg-[#F8F8F8] hover:bg-[#F3F3F3] rounded-xl text-[12.5px] font-medium text-[#1A1A1A] transition">
          Change password
        </button>
      </Card>
      <Card title="Two-factor authentication" subtitle="Recommended for Pro accounts">
        <ToggleRow label="Authenticator app" hint="Google Authenticator, 1Password, Authy" defaultOn />
        <ToggleRow label="SMS to +95 number" hint="Backup code via SMS" />
      </Card>
      <Card title="Active sessions" subtitle="Where you're signed in">
        <SessionRow device="iPhone 15 · Yangon" lastActive="now" current />
        <SessionRow device="MacBook · Yangon" lastActive="2 hours ago" />
        <SessionRow device="Chrome on Windows · Mandalay" lastActive="3 days ago" />
      </Card>
    </>
  )
}

function DataSection() {
  return (
    <Card title="Data & storage" subtitle="Manage what Swapo keeps for you">
      <ToggleRow label="Cache contact photos" hint="Faster loading on slow networks" defaultOn />
      <ToggleRow label="Auto-backup to KBZ Cloud" hint="Encrypted weekly snapshot" />
      <div className="border-t border-[#F3F3F3] -mx-6 mt-3 pt-5 px-6 grid sm:grid-cols-2 gap-2">
        <button className="h-11 inline-flex items-center justify-center gap-2 bg-[#F8F8F8] hover:bg-[#F3F3F3] rounded-xl text-[12.5px] font-medium text-[#1A1A1A] transition">
          Export all contacts (.vcf)
        </button>
        <button className="h-11 inline-flex items-center justify-center gap-2 bg-[#F8F8F8] hover:bg-[#F3F3F3] rounded-xl text-[12.5px] font-medium text-[#1A1A1A] transition">
          Export to CSV
        </button>
      </div>
      <button className="mt-4 text-[12px] font-medium text-[#DC2626] hover:underline">
        Delete account & all data
      </button>
    </Card>
  )
}

function IntegrationsSection() {
  const [apps, setApps] = useState<ConnectedApp[]>(CONNECTED_APPS)
  const toggle = (id: string) => setApps((a) => a.map((x) => x.id === id ? { ...x, connected: !x.connected } : x))
  return (
    <Card title="Connected apps" subtitle="Sync contacts, billing, and identity">
      <ul className="divide-y divide-[#F3F3F3] -m-6">
        {apps.map((a) => (
          <li key={a.id} className="flex items-center gap-4 px-6 py-4">
            <div className="w-11 h-11 rounded-xl bg-[#F8F8F8] grid place-items-center text-[12px] font-bold text-[#1A1A1A]">
              {a.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[#1A1A1A]">{a.name}</div>
              <div className="text-[11.5px] text-[#616161]">{a.description}</div>
            </div>
            <button
              onClick={() => toggle(a.id)}
              className={`h-10 px-4 text-[12.5px] font-medium rounded-xl transition ${
                a.connected
                  ? 'bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5]'
                  : 'bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6] text-sand-0 hover:opacity-95'
              }`}
            >
              {a.connected ? 'Connected' : 'Connect'}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function ToggleRow({ label, hint, defaultOn }: { label: string; hint?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn)
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 border-b border-[#F3F3F3] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[#1A1A1A]">{label}</div>
        {hint && <div className="text-[11.5px] text-[#616161]">{hint}</div>}
      </div>
      <Toggle on={on} onChange={() => setOn((v) => !v)} />
    </div>
  )
}

function SessionRow({ device, lastActive, current }: { device: string; lastActive: string; current?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 border-b border-[#F3F3F3] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[#1A1A1A] flex items-center gap-2">
          {device}
          {current && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#ECFDF5] text-[#047857]">This device</span>}
        </div>
        <div className="text-[11.5px] text-[#616161]">Last active {lastActive}</div>
      </div>
      {!current && (
        <button className="text-[12px] font-medium text-[#DC2626] hover:underline">Sign out</button>
      )}
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-10 rounded-full transition ${on ? 'bg-gradient-to-r from-[#5B8DEF] to-[#8B5CF6]' : 'bg-[#E5E5E5]'}`}
      role="switch"
      aria-checked={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 bg-sand-0 rounded-full shadow transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}
