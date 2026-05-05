import { useEffect, useRef, useState } from 'react'
import {
  Check, Crown, Sparkles, Zap, ShieldCheck, Eye, EyeOff, MapPin, Search,
  Smartphone, LogOut, HardDrive, Trash2, Download,
  Moon, Sun, Monitor, Bell, MessageSquareWarning, FileText, Mail,
  Star, ExternalLink, Info, ChevronRight, AlertTriangle,
} from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'
import { useTheme, useAccent, ACCENTS, type AccentId } from '../theme'
import type { View } from '../nav'

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
      </Group>

      <SectionLabel>Data</SectionLabel>
      <Group>
        <ActionRow icon={<Trash2 size={15} />} label="Delete account" sub="Permanently remove your account" danger />
      </Group>
    </Page>
  )
}

/* ---------- Security ---------- */

export function SecurityScreen({ onBack, go }: { onBack: () => void; go: (v: View) => void }) {
  const [twoFactor, setTwoFactor] = useState(false)
  const [confirmAll, setConfirmAll] = useState(false)
  const toast = useToast()
  return (
    <Page title="Security" onBack={onBack}>
      <SectionLabel>Sign-in</SectionLabel>
      <Group>
        <ActionRow icon={<Smartphone size={15} />} label="Phone number" sub="+95 9 •••• 3421" onClick={() => go({ kind: 'security-phone' })} />
        <ToggleRow icon={<ShieldCheck size={15} />} label="Two-factor auth" sub="Extra code at sign-in" value={twoFactor} onChange={setTwoFactor} />
      </Group>

      <SectionLabel>Active sessions</SectionLabel>
      <Group>
        <ActionRow icon={<Smartphone size={15} />} label="iPhone 15 · Yangon" sub="This device · Active now" onClick={() => go({ kind: 'security-session', device: 'iphone' })} />
        <ActionRow icon={<Monitor size={15} />} label="MacBook Pro" sub="Last active 2 hours ago" onClick={() => go({ kind: 'security-session', device: 'mac' })} />
      </Group>

      <Group>
        <ActionRow icon={<LogOut size={15} />} label="Sign out of all devices" danger onClick={() => setConfirmAll(true)} />
      </Group>

      {confirmAll && (
        <ConfirmDialog
          icon={<AlertTriangle size={20} className="text-rose-400" strokeWidth={1.8} />}
          title="Sign out of all devices?"
          body="This signs you out everywhere except this device. You can sign back in with your phone and PIN."
          confirmLabel="Sign out all"
          onCancel={() => setConfirmAll(false)}
          onConfirm={() => {
            setConfirmAll(false)
            toast.show('Signed out of 1 other device')
          }}
        />
      )}
    </Page>
  )
}

function ConfirmDialog({
  icon, title, body, confirmLabel, onConfirm, onCancel,
}: {
  icon: React.ReactNode; title: string; body: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
      <button onClick={onCancel} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-[320px] rounded-[24px] border border-line/70 bg-surface p-5 animate-pop-in">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 grid place-items-center mb-4 mx-auto">
          {icon}
        </div>
        <h2 className="text-[16px] font-semibold text-center">{title}</h2>
        <p className="text-[12.5px] text-ink-dim text-center mt-1.5 leading-relaxed">{body}</p>
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-line/70 bg-surface-elevated text-[13.5px] font-semibold">Cancel</button>
          <button onClick={onConfirm} className="flex-1 h-11 rounded-xl bg-rose-500 text-white text-[13.5px] font-semibold">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Security · Change phone number ---------- */

export function SecurityPhoneScreen({ onBack }: { onBack: () => void }) {
  const toast = useToast()
  const [step, setStep] = useState<'enter' | 'verify'>('enter')
  const [number, setNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(60)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step !== 'verify' || seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [step, seconds])

  useEffect(() => {
    if (step === 'verify') otpRefs.current[0]?.focus()
  }, [step])

  const setDigit = (idx: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 1)
    const arr = otp.split('')
    while (arr.length < 6) arr.push('')
    arr[idx] = d
    const next = arr.join('').slice(0, 6)
    setOtp(next)
    if (d && idx < 5) otpRefs.current[idx + 1]?.focus()
  }

  const onOtpKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus()
  }

  const onOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!d) return
    e.preventDefault()
    setOtp(d)
    otpRefs.current[Math.min(d.length, 5)]?.focus()
  }

  return (
    <Page title="Change phone" onBack={onBack}>
      {step === 'enter' ? (
        <>
          <SectionLabel>Current</SectionLabel>
          <Group>
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted">
                <Smartphone size={15} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold leading-tight">+95 9 •••• 3421</p>
                <p className="text-[11.5px] text-ink-dim mt-0.5">In use since Jan 2026</p>
              </div>
            </div>
          </Group>

          <SectionLabel>New phone number</SectionLabel>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-12 px-3 flex items-center gap-2 rounded-2xl border border-line/70 bg-surface">
              <span className="text-[16px] leading-none">🇲🇲</span>
              <span className="text-[14px] font-semibold">+95</span>
            </div>
            <input
              autoFocus
              inputMode="tel"
              placeholder="9 xxx xxx xxx"
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/[^\d\s]/g, ''))}
              className="flex-1 h-12 px-4 rounded-2xl border border-line/70 bg-surface outline-none text-[14px] placeholder:text-ink-dim focus:border-brand/60 transition"
            />
          </div>
          <p className="text-[11.5px] text-ink-dim ml-1 mb-7 leading-relaxed">
            We'll text a 6-digit code to verify it's your number. Standard SMS rates apply.
          </p>

          <button
            disabled={number.replace(/\s/g, '').length < 9}
            onClick={() => setStep('verify')}
            className="w-full h-12 rounded-2xl bg-brand text-white font-semibold text-[14px] disabled:bg-surface-higher disabled:text-ink-dim disabled:border disabled:border-line/70 transition"
          >
            Send code
          </button>
        </>
      ) : (
        <>
          <div className="text-center pt-1 pb-7">
            <div className="h-14 w-14 rounded-2xl bg-brand/15 border border-brand/30 grid place-items-center mx-auto mb-3">
              <ShieldCheck size={22} className="text-brand" strokeWidth={1.8} />
            </div>
            <p className="text-[15px] font-bold">Verify your number</p>
            <p className="text-[12.5px] text-ink-dim mt-1.5 leading-relaxed px-2">
              We sent a code to <span className="text-ink font-semibold">+95 {number}</span>
            </p>
          </div>

          <SectionLabel>Verification code</SectionLabel>
          <div className="flex justify-between gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el }}
                inputMode="numeric"
                maxLength={1}
                value={otp[i] || ''}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onOtpKey(i, e)}
                onPaste={onOtpPaste}
                className={`w-full h-14 rounded-2xl border bg-surface text-[18px] font-semibold text-center tabular-nums outline-none transition
                  ${otp[i] ? 'border-brand/60' : 'border-line/70'}
                  focus:border-brand/60`}
              />
            ))}
          </div>

          <div className="mt-4 mb-7 flex items-center justify-between text-[12px] ml-1 mr-1">
            <button
              onClick={() => setSeconds(60)}
              disabled={seconds > 0}
              className="text-ink-muted disabled:text-ink-dim font-medium"
            >
              Resend code
            </button>
            <span className="text-ink-dim tabular-nums">
              {seconds > 0 ? `in 0:${String(seconds).padStart(2, '0')}` : 'available'}
            </span>
          </div>

          <button
            disabled={otp.length < 6}
            onClick={() => {
              toast.show('Phone number updated')
              setTimeout(onBack, 500)
            }}
            className="w-full h-12 rounded-2xl bg-brand text-white font-semibold text-[14px] disabled:bg-surface-higher disabled:text-ink-dim disabled:border disabled:border-line/70 transition"
          >
            Verify & update
          </button>

          <button onClick={() => { setStep('enter'); setOtp('') }} className="w-full text-center text-[12.5px] text-ink-dim font-medium mt-3">
            Use a different number
          </button>
        </>
      )}
    </Page>
  )
}

/* ---------- Security · Session detail ---------- */

export function SecuritySessionScreen({ onBack, device }: { onBack: () => void; device: 'iphone' | 'mac' }) {
  const toast = useToast()
  const [confirm, setConfirm] = useState(false)

  const data = device === 'iphone'
    ? {
        name: 'iPhone 15',
        location: 'Yangon, Myanmar',
        icon: <Smartphone size={26} className="text-brand" strokeWidth={1.6} />,
        iconBg: 'bg-brand/15 border-brand/30',
        isCurrent: true,
        rows: [
          { label: 'Model', value: 'iPhone 15 Pro' },
          { label: 'Operating system', value: 'iOS 17.4.1' },
          { label: 'App version', value: 'Cardo 1.0.0 (142)' },
          { label: 'IP address', value: '203.81.222.18' },
          { label: 'Network', value: 'MPT mobile' },
          { label: 'Signed in', value: 'Jan 12, 2026' },
          { label: 'Last active', value: 'Active now' },
        ],
      }
    : {
        name: 'MacBook Pro',
        location: 'Yangon, Myanmar',
        icon: <Monitor size={26} className="text-ink-muted" strokeWidth={1.6} />,
        iconBg: 'bg-surface-higher border-line/60',
        isCurrent: false,
        rows: [
          { label: 'Model', value: 'MacBook Pro 14"' },
          { label: 'Operating system', value: 'macOS 14.4 Sonoma' },
          { label: 'Browser', value: 'Safari 17.4' },
          { label: 'IP address', value: '203.81.198.42' },
          { label: 'Network', value: 'Ooredoo home' },
          { label: 'Signed in', value: 'Mar 28, 2026' },
          { label: 'Last active', value: '2 hours ago' },
        ],
      }

  return (
    <Page title="Session" onBack={onBack}>
      <div className="p-5 rounded-[20px] border border-line/60 bg-surface/60 mb-5 flex items-center gap-4">
        <div className={`h-14 w-14 rounded-2xl border grid place-items-center ${data.iconBg}`}>
          {data.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold truncate">{data.name}</p>
          <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-ink-dim">
            <MapPin size={12} strokeWidth={1.8} />
            <span className="truncate">{data.location}</span>
          </div>
          {data.isCurrent ? (
            <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10.5px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              This device · Active now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-surface-higher border border-line/60 text-ink-dim text-[10.5px] font-semibold">
              Inactive
            </span>
          )}
        </div>
      </div>

      <SectionLabel>Details</SectionLabel>
      <Group>
        {data.rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line/40 last:border-0">
            <span className="text-[12.5px] text-ink-dim">{row.label}</span>
            <span className="text-[12.5px] font-semibold text-right truncate">{row.value}</span>
          </div>
        ))}
      </Group>

      {!data.isCurrent && (
        <Group>
          <ActionRow
            icon={<LogOut size={15} />}
            label="Sign out this device"
            sub="You can sign back in anytime"
            danger
            onClick={() => setConfirm(true)}
          />
        </Group>
      )}

      <p className="text-[11.5px] text-ink-dim ml-1 leading-relaxed">
        Don't recognize this session? Sign it out and change your PIN immediately.
      </p>

      {confirm && (
        <ConfirmDialog
          icon={<LogOut size={20} className="text-rose-400" strokeWidth={1.8} />}
          title={`Sign out of ${data.name}?`}
          body="This device will need to sign back in to access your Cardo account."
          confirmLabel="Sign out"
          onCancel={() => setConfirm(false)}
          onConfirm={() => {
            setConfirm(false)
            toast.show('Signed out')
            setTimeout(onBack, 400)
          }}
        />
      )}
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
  const { accent, setAccent } = useAccent()
  const accentIds: AccentId[] = ['blue', 'violet', 'emerald', 'rose', 'amber']
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
        {accentIds.map((id) => (
          <button
            key={id}
            onClick={() => setAccent(id)}
            style={{ backgroundColor: ACCENTS[id].hex }}
            className={`h-10 w-10 rounded-full grid place-items-center transition ${accent === id ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-surface' : ''}`}
          >
            {accent === id && <Check size={16} className="text-white" strokeWidth={2.4} />}
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
    { q: 'Is Cardo free?', a: 'Yes. The Free plan includes 3 AI credits per month, and Pro unlocks unlimited use.' },
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
