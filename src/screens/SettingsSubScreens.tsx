import { useState } from 'react'
import {
  Check, Crown, Sparkles, Zap, ShieldCheck, Eye, EyeOff, MapPin, AtSign, Search,
  Smartphone, Fingerprint, KeyRound, LogOut, HardDrive, Trash2, Download,
  Globe, Moon, Sun, Monitor, Bell, MessageSquareWarning, FileText, Mail,
  Star, ExternalLink, Info, ChevronRight,
} from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useTheme } from '../theme'

/* ---------- shared primitives ---------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-medium text-ink-dim mt-1 mb-2.5 ml-1">{children}</p>
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[20px] border border-line/60 bg-surface/60 overflow-hidden mb-5">{children}</div>
}

function Page({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader title={title} onBack={onBack} />
      <div className="px-5 pb-8">{children}</div>
    </div>
  )
}

function ToggleRow({ icon, label, sub, value, onChange }: { icon: React.ReactNode; label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0">
      <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted">{icon}</div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold leading-tight">{label}</p>
        {sub && <p className="text-[11.5px] text-ink-dim mt-0.5">{sub}</p>}
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

function ChoiceRow({ icon, label, sub, selected, onSelect }: { icon?: React.ReactNode; label: string; sub?: string; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className="w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0 hover:bg-surface-elevated transition">
      {icon && <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted">{icon}</div>}
      <div className="flex-1 text-left">
        <p className="text-[14px] font-semibold leading-tight">{label}</p>
        {sub && <p className="text-[11.5px] text-ink-dim mt-0.5">{sub}</p>}
      </div>
      {selected && <Check size={17} className="text-brand" strokeWidth={2.2} />}
    </button>
  )
}

function ActionRow({ icon, label, sub, danger, onClick }: { icon: React.ReactNode; label: string; sub?: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0 hover:bg-surface-elevated transition">
      <div className={`h-9 w-9 rounded-xl border grid place-items-center ${danger ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-surface-higher border-line/60 text-ink-muted'}`}>{icon}</div>
      <div className="flex-1 text-left">
        <p className={`text-[14px] font-semibold leading-tight ${danger ? 'text-rose-400' : ''}`}>{label}</p>
        {sub && <p className="text-[11.5px] text-ink-dim mt-0.5">{sub}</p>}
      </div>
      <ChevronRight size={16} className="text-ink-dim" strokeWidth={1.8} />
    </button>
  )
}

/* ---------- Subscription ---------- */

export function SubscriptionScreen({ onBack }: { onBack: () => void }) {
  const [plan, setPlan] = useState<'free' | 'pro' | 'team'>('free')
  return (
    <Page title="Subscription" onBack={onBack}>
      <div className="relative overflow-hidden p-5 rounded-[20px] border border-brand/30 bg-gradient-to-br from-brand/15 via-surface to-surface mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-brand-gradient grid place-items-center shadow-glow">
            <Crown size={20} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold">Cardo Pro</p>
            <p className="text-[12px] text-ink-dim mt-0.5">Unlimited AI cards, analytics, multi-card</p>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-4">
          <span className="text-[28px] font-bold">9,900 Ks</span>
          <span className="text-[12px] text-ink-dim">/month</span>
        </div>
        <button className="mt-4 w-full py-3 rounded-2xl bg-ink text-canvas font-semibold text-[14px]">Upgrade now</button>
      </div>

      <SectionLabel>Choose plan</SectionLabel>
      <Group>
        <ChoiceRow icon={<Sparkles size={15} />} label="Free" sub="3 AI credits / month" selected={plan === 'free'} onSelect={() => setPlan('free')} />
        <ChoiceRow icon={<Crown size={15} />} label="Pro" sub="Unlimited AI · 9,900 Ks /mo" selected={plan === 'pro'} onSelect={() => setPlan('pro')} />
        <ChoiceRow icon={<Zap size={15} />} label="Team" sub="5 seats · 39,000 Ks /mo" selected={plan === 'team'} onSelect={() => setPlan('team')} />
      </Group>

      <SectionLabel>Billing</SectionLabel>
      <Group>
        <ActionRow icon={<FileText size={15} />} label="Payment method" sub="Add card or KBZ Pay" />
        <ActionRow icon={<Download size={15} />} label="Billing history" sub="Invoices & receipts" />
      </Group>
    </Page>
  )
}

/* ---------- Privacy ---------- */

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
  const [discoverable, setDiscoverable] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [searchByPhone, setSearchByPhone] = useState(true)
  const [nearbyShare, setNearbyShare] = useState(true)
  return (
    <Page title="Privacy" onBack={onBack}>
      <SectionLabel>Who can find me</SectionLabel>
      <Group>
        <ToggleRow icon={<Eye size={15} />} label="Discoverable" sub="Allow others to find your card" value={discoverable} onChange={setDiscoverable} />
        <ToggleRow icon={<Search size={15} />} label="Search by phone" sub="People with your number can find you" value={searchByPhone} onChange={setSearchByPhone} />
        <ToggleRow icon={<MapPin size={15} />} label="Nearby sharing" sub="Appear in nearby at events" value={nearbyShare} onChange={setNearbyShare} />
      </Group>

      <SectionLabel>What others see</SectionLabel>
      <Group>
        <ToggleRow icon={showEmail ? <Eye size={15} /> : <EyeOff size={15} />} label="Show email on card" value={showEmail} onChange={setShowEmail} />
        <ActionRow icon={<AtSign size={15} />} label="Blocked users" sub="0 people blocked" />
      </Group>

      <SectionLabel>Data</SectionLabel>
      <Group>
        <ActionRow icon={<Download size={15} />} label="Download my data" sub="Get a copy of everything we store" />
        <ActionRow icon={<Trash2 size={15} />} label="Delete account" sub="Permanently remove your account" danger />
      </Group>
    </Page>
  )
}

/* ---------- Security ---------- */

export function SecurityScreen({ onBack }: { onBack: () => void }) {
  const [biometrics, setBiometrics] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  return (
    <Page title="Security" onBack={onBack}>
      <SectionLabel>Sign-in</SectionLabel>
      <Group>
        <ActionRow icon={<Smartphone size={15} />} label="Phone number" sub="+95 9 •••• 3421" />
        <ActionRow icon={<KeyRound size={15} />} label="Change PIN" />
        <ToggleRow icon={<Fingerprint size={15} />} label="Biometric unlock" sub="Face ID or fingerprint" value={biometrics} onChange={setBiometrics} />
        <ToggleRow icon={<ShieldCheck size={15} />} label="Two-factor auth" sub="Extra code at sign-in" value={twoFactor} onChange={setTwoFactor} />
      </Group>

      <SectionLabel>Active sessions</SectionLabel>
      <Group>
        <ActionRow icon={<Smartphone size={15} />} label="iPhone 15 · Yangon" sub="This device · Active now" />
        <ActionRow icon={<Monitor size={15} />} label="MacBook Pro" sub="Last active 2 hours ago" />
      </Group>

      <Group>
        <ActionRow icon={<LogOut size={15} />} label="Sign out of all devices" danger />
      </Group>
    </Page>
  )
}

/* ---------- Data & Storage ---------- */

export function DataStorageScreen({ onBack }: { onBack: () => void }) {
  const [autoBackup, setAutoBackup] = useState(true)
  const [hdImages, setHdImages] = useState(false)
  return (
    <Page title="Data & Storage" onBack={onBack}>
      <div className="p-4 rounded-[20px] border border-line/60 bg-surface/60 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] text-ink-dim">App storage</p>
          <p className="text-[13px] font-semibold">142 MB</p>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-higher overflow-hidden">
          <div className="h-full bg-brand" style={{ width: '38%' }} />
        </div>
        <div className="flex justify-between text-[11px] text-ink-dim mt-2">
          <span>Cards 84 MB</span>
          <span>Cache 41 MB</span>
          <span>Other 17 MB</span>
        </div>
      </div>

      <SectionLabel>Backup</SectionLabel>
      <Group>
        <ToggleRow icon={<HardDrive size={15} />} label="Auto-backup cards" sub="Sync to cloud daily" value={autoBackup} onChange={setAutoBackup} />
        <ActionRow icon={<Download size={15} />} label="Export cards" sub="Download as vCard or CSV" />
      </Group>

      <SectionLabel>Media</SectionLabel>
      <Group>
        <ToggleRow icon={<Sparkles size={15} />} label="High-quality card images" sub="Uses more data" value={hdImages} onChange={setHdImages} />
      </Group>

      <SectionLabel>Cleanup</SectionLabel>
      <Group>
        <ActionRow icon={<Trash2 size={15} />} label="Clear cache" sub="Free up 41 MB" />
        <ActionRow icon={<Trash2 size={15} />} label="Reset all data" sub="Remove all local cards" danger />
      </Group>
    </Page>
  )
}

/* ---------- Language ---------- */

export function LanguageScreen({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState('en')
  const langs = [
    { id: 'en', label: 'English', sub: 'English' },
    { id: 'my', label: 'Burmese', sub: 'မြန်မာ' },
    { id: 'zh', label: 'Chinese', sub: '中文 (简体)' },
    { id: 'th', label: 'Thai', sub: 'ไทย' },
    { id: 'ja', label: 'Japanese', sub: '日本語' },
    { id: 'ko', label: 'Korean', sub: '한국어' },
  ]
  return (
    <Page title="Language" onBack={onBack}>
      <SectionLabel>App language</SectionLabel>
      <Group>
        {langs.map((l) => (
          <ChoiceRow key={l.id} label={l.label} sub={l.sub} selected={lang === l.id} onSelect={() => setLang(l.id)} />
        ))}
      </Group>
      <p className="text-[11.5px] text-ink-dim ml-1">Changing the language will restart the app.</p>
    </Page>
  )
}

/* ---------- Appearance ---------- */

export function AppearanceScreen({ onBack }: { onBack: () => void }) {
  const { theme, setTheme } = useTheme()
  const [accent, setAccent] = useState('blue')
  const accents = [
    { id: 'blue', color: 'bg-brand' },
    { id: 'violet', color: 'bg-brand-violet' },
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'rose', color: 'bg-rose-500' },
    { id: 'amber', color: 'bg-amber-500' },
  ]
  return (
    <Page title="Appearance" onBack={onBack}>
      <SectionLabel>Theme</SectionLabel>
      <Group>
        <ChoiceRow icon={<Monitor size={15} />} label="System" sub="Match device setting" selected={theme === 'system'} onSelect={() => setTheme('system')} />
        <ChoiceRow icon={<Moon size={15} />} label="Dark" sub="Always dark" selected={theme === 'dark'} onSelect={() => setTheme('dark')} />
        <ChoiceRow icon={<Sun size={15} />} label="Light" sub="Always light" selected={theme === 'light'} onSelect={() => setTheme('light')} />
      </Group>

      <SectionLabel>Accent color</SectionLabel>
      <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-5 flex items-center gap-3">
        {accents.map((a) => (
          <button
            key={a.id}
            onClick={() => setAccent(a.id)}
            className={`h-10 w-10 rounded-full ${a.color} grid place-items-center transition ${accent === a.id ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-surface' : ''}`}
          >
            {accent === a.id && <Check size={16} className="text-white" strokeWidth={2.4} />}
          </button>
        ))}
      </div>
    </Page>
  )
}

/* ---------- Notice ---------- */

export function NoticeScreen({ onBack }: { onBack: () => void }) {
  const items = [
    { tag: 'Update', title: 'Cardo v1.0.0 is here', date: 'Apr 24, 2026', body: 'AI cards, multi-card, and a refreshed design system.' },
    { tag: 'Event', title: 'Yangon Tech Mixer · Apr 30', date: 'Apr 20, 2026', body: 'Tap into Nearby at the venue to swap cards.' },
    { tag: 'Notice', title: 'Scheduled maintenance', date: 'Apr 15, 2026', body: 'Brief downtime on Apr 28 from 02:00–03:00 MMT.' },
  ]
  return (
    <Page title="Notice" onBack={onBack}>
      {items.map((n, i) => (
        <div key={i} className="p-4 rounded-[20px] border border-line/60 bg-surface/60 mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-brand/15 border border-brand/30 text-brand text-[10.5px] font-semibold">{n.tag}</span>
            <span className="text-[11px] text-ink-dim">{n.date}</span>
          </div>
          <p className="text-[14px] font-semibold leading-tight">{n.title}</p>
          <p className="text-[12px] text-ink-dim mt-1.5 leading-relaxed">{n.body}</p>
        </div>
      ))}
    </Page>
  )
}

/* ---------- FAQ ---------- */

export function FAQScreen({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(0)
  const qa = [
    { q: 'How do I share my card?', a: 'Tap "My Card" then share via QR, link, or Nearby.' },
    { q: 'Is Cardo free?', a: 'Yes — the Free plan includes 3 AI credits per month. Pro unlocks unlimited use.' },
    { q: 'Can I have multiple cards?', a: 'Multi-card is available on Pro. Switch between work and personal in one tap.' },
    { q: 'How does Nearby work?', a: 'Nearby uses Bluetooth to find other Cardo users at the same venue. You can turn it off anytime.' },
    { q: 'How do I delete my account?', a: 'Settings → Privacy → Delete account. This is permanent.' },
  ]
  return (
    <Page title="FAQ" onBack={onBack}>
      {qa.map((item, i) => (
        <button
          key={i}
          onClick={() => setOpen(open === i ? null : i)}
          className="w-full text-left p-4 rounded-[20px] border border-line/60 bg-surface/60 mb-3"
        >
          <div className="flex items-center gap-3">
            <p className="flex-1 text-[14px] font-semibold leading-tight">{item.q}</p>
            <ChevronRight size={16} className={`text-ink-dim transition-transform ${open === i ? 'rotate-90' : ''}`} strokeWidth={1.8} />
          </div>
          {open === i && <p className="text-[12.5px] text-ink-dim mt-2.5 leading-relaxed">{item.a}</p>}
        </button>
      ))}
    </Page>
  )
}

/* ---------- Terms & Policies ---------- */

export function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <Page title="Terms & Policies" onBack={onBack}>
      <Group>
        <ActionRow icon={<FileText size={15} />} label="Terms of Service" sub="Updated Mar 2026" />
        <ActionRow icon={<ShieldCheck size={15} />} label="Privacy Policy" sub="How we handle your data" />
        <ActionRow icon={<FileText size={15} />} label="Community Guidelines" />
        <ActionRow icon={<FileText size={15} />} label="Cookie Policy" />
        <ActionRow icon={<FileText size={15} />} label="Open-source licenses" />
      </Group>
    </Page>
  )
}

/* ---------- Help & Support ---------- */

export function HelpScreen({ onBack }: { onBack: () => void }) {
  return (
    <Page title="Help & Support" onBack={onBack}>
      <SectionLabel>Get answers</SectionLabel>
      <Group>
        <ActionRow icon={<Search size={15} />} label="Search help articles" />
        <ActionRow icon={<Bell size={15} />} label="What's new" sub="See recent updates" />
      </Group>

      <SectionLabel>Contact us</SectionLabel>
      <Group>
        <ActionRow icon={<Mail size={15} />} label="Email support" sub="help@cardo.mm · replies in 24h" />
        <ActionRow icon={<MessageSquareWarning size={15} />} label="Report a problem" sub="Bugs, crashes, missing features" />
        <ActionRow icon={<Star size={15} />} label="Send feedback" sub="Tell us what to build next" />
      </Group>

      <SectionLabel>Community</SectionLabel>
      <Group>
        <ActionRow icon={<ExternalLink size={15} />} label="Status page" sub="status.cardo.mm" />
        <ActionRow icon={<ExternalLink size={15} />} label="Cardo on Telegram" />
      </Group>
    </Page>
  )
}

/* ---------- About ---------- */

export function AboutScreen({ onBack }: { onBack: () => void }) {
  return (
    <Page title="About" onBack={onBack}>
      <div className="flex flex-col items-center text-center pt-2 pb-6">
        <div className="h-16 w-16 rounded-2xl bg-brand-gradient grid place-items-center shadow-glow mb-3">
          <Sparkles size={26} className="text-white" strokeWidth={1.8} />
        </div>
        <p className="text-[18px] font-bold">Cardo Myanmar</p>
        <p className="text-[12px] text-ink-dim mt-1">Version 1.0.0 (build 142)</p>
      </div>

      <Group>
        <ActionRow icon={<Info size={15} />} label="What's new" />
        <ActionRow icon={<Star size={15} />} label="Rate Cardo on the App Store" />
        <ActionRow icon={<ExternalLink size={15} />} label="Visit cardo.mm" />
      </Group>

      <Group>
        <ActionRow icon={<FileText size={15} />} label="Acknowledgements" sub="Thanks to our contributors" />
        <ActionRow icon={<FileText size={15} />} label="Open-source licenses" />
      </Group>

      <p className="text-center text-[11px] text-ink-dim mt-4">Made in Yangon · 2026</p>
    </Page>
  )
}
