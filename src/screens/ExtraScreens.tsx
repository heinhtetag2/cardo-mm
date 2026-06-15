import { useState } from 'react'
import {
  Search, X, Check, Camera, Calendar, Trash2,
  MapPin, ChevronRight, ScanLine,
  Share2, Copy, Mail, MessageCircle, Gift,
  ArrowUpRight, Users, ArrowRightLeft,
  Smartphone, Star, User, Image as ImageIcon, Plug, AlertTriangle,
  Pencil, Building2, Sparkles,
} from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { LocationPicker } from '../components/LocationPicker'
import { CardScanOverlay } from '../components/CardScanOverlay'
import { useToast } from '../components/Toast'
import { contacts, me, account, type Contact } from '../data'
import { useT } from '../i18n'
import type { View } from '../nav'

/* shared */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-medium text-ink-dim mt-1 mb-2.5 ml-1">{children}</p>
}
function Group({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[20px] border border-line/60 bg-surface/60 overflow-hidden mb-5">{children}</div>
}
function Page({ title, onBack, right, children }: { title: string; onBack: () => void; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader title={title} onBack={onBack} right={right} />
      <div className="px-5 pb-8">{children}</div>
    </div>
  )
}

/* ---------- Edit Card ---------- */

export function EditCardScreen({ onBack, autoScan = false }: { onBack: () => void; autoScan?: boolean }) {
  const toast = useToast()
  const t = useT()
  const [name, setName] = useState(me.name)
  const [role, setRole] = useState(me.role)
  const [company, setCompany] = useState(me.company)
  const [city, setCity] = useState(me.city)
  const [phone, setPhone] = useState(me.phone)
  const [email, setEmail] = useState(me.email)
  const [website, setWebsite] = useState(me.website)
  const [bio, setBio] = useState(me.bio)
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const [scanOpen, setScanOpen] = useState(autoScan)

  const save = () => {
    toast.show('Card saved')
    setTimeout(onBack, 600)
  }

  // Mock extraction from the user's own paper card — fields they then edit.
  const applyScan = () => {
    setName('Hein Htet')
    setRole('Senior Product Designer')
    setCompany('Bagan Studio')
    setCity('Yangon')
    setPhone('+95 9 770 112 233')
    setEmail('hein@baganstudio.mm')
    setWebsite('baganstudio.mm')
    setBio('Designing calm, useful products from Yangon.')
    setScanOpen(false)
    toast.show(t('myCard.scan.filled'))
  }

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader
        title={t('editCard.title')}
        onBack={onBack}
        right={<button onClick={save} className="px-3.5 h-9 pt-px rounded-full bg-sand-0 text-black text-[12.5px] font-semibold inline-flex items-center justify-center">{t('common.save')}</button>}
      />

      <div className="px-5 pb-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-brand to-brand-violet p-[2px] mb-3">
            <div className="h-full w-full rounded-full bg-canvas grid place-items-center">
              <span className="text-[22px] font-bold">{name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
            </div>
            <button
              onClick={() => toast.show('Open camera (mock)', 'info')}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-ink text-canvas grid place-items-center shadow-glow border-2 border-canvas"
            >
              <Camera size={14} strokeWidth={2} />
            </button>
          </div>
          <button onClick={() => toast.show('Photo removed', 'info')} className="text-[12px] text-ink-dim">Remove photo</button>
        </div>

        {/* Scan a paper card to auto-fill */}
        <button
          onClick={() => setScanOpen(true)}
          className="w-full mb-5 p-4 rounded-[20px] border border-brand/25 bg-brand/8 flex items-center gap-3.5 active:scale-[0.99] transition"
        >
          <div className="h-11 w-11 rounded-2xl bg-brand-gradient grid place-items-center shadow-glow flex-shrink-0">
            <ScanLine size={18} className="text-sand-0" strokeWidth={1.8} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold leading-tight">{t('myCard.scanFill')}</p>
            <p className="text-[11.5px] text-ink-dim mt-0.5">{t('myCard.scanFill.sub')}</p>
          </div>
          <ChevronRight size={16} className="text-ink-dim flex-shrink-0" strokeWidth={1.8} />
        </button>

        <SectionLabel>Identity</SectionLabel>
        <Group>
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Role / Title" value={role} onChange={setRole} />
          <Field label="Company" value={company} onChange={setCompany} />
          <FieldButton label="City" value={city} onTap={() => setCityPickerOpen(true)} />
        </Group>

        <SectionLabel>Contact</SectionLabel>
        <Group>
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Website" value={website} onChange={setWebsite} />
        </Group>

        <SectionLabel>About</SectionLabel>
        <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-5">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full bg-transparent outline-none text-[13.5px] leading-relaxed resize-none placeholder:text-ink-dim"
            placeholder="A short bio…"
          />
          <p className="text-[11px] text-ink-dim mt-2 text-right">{bio.length} / 160</p>
        </div>

        <SectionLabel>Card history</SectionLabel>
        <CardHistory />

        <button
          onClick={() => toast.show('Are you sure? (mock)', 'info')}
          className="w-full p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/8 flex items-center justify-center gap-2 text-[14px] font-semibold text-rose-400"
        >
          <Trash2 size={15} strokeWidth={1.8} />
          <span>Reset card</span>
        </button>
      </div>

      {cityPickerOpen && (
        <LocationPicker
          current={city}
          onSelect={(loc) => { setCity(loc.name); setCityPickerOpen(false) }}
          onClose={() => setCityPickerOpen(false)}
        />
      )}

      {scanOpen && <CardScanOverlay onClose={() => setScanOpen(false)} onFill={applyScan} />}
    </div>
  )
}

function CardHistory() {
  const items = [
    { icon: <Check size={13} strokeWidth={2.4} />, label: 'Card is active', time: 'In use now', active: true },
    { icon: <Pencil size={12} strokeWidth={2} />, label: 'Updated role · Product Designer', time: '2 days ago' },
    { icon: <Camera size={12} strokeWidth={2} />, label: 'Changed profile photo', time: '5 days ago' },
    { icon: <Building2 size={12} strokeWidth={2} />, label: 'Updated company · Independent', time: '2 weeks ago' },
    { icon: <Sparkles size={12} strokeWidth={2} />, label: 'Card created', time: 'Mar 2026' },
  ]
  return (
    <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-5">
      <ol className="relative">
        {items.map((it, i) => (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {i < items.length - 1 && (
              <span className="absolute left-[13px] top-7 -bottom-0.5 w-px bg-line/60" />
            )}
            <span
              className={`relative z-10 h-7 w-7 rounded-full grid place-items-center flex-shrink-0 border ${
                it.active
                  ? 'bg-brand/15 border-brand/40 text-brand'
                  : 'bg-surface-higher border-line/60 text-ink-muted'
              }`}
            >
              {it.icon}
            </span>
            <div className="flex-1 min-w-0 pt-1">
              <p className={`text-[13px] font-medium leading-tight ${it.active ? 'text-ink' : 'text-ink-muted'}`}>
                {it.label}
              </p>
              <p className="text-[11px] text-ink-dim mt-0.5">{it.time}</p>
            </div>
            {it.active && (
              <span className="self-start mt-0.5 px-2 py-0.5 rounded-full bg-brand/15 text-brand text-[10px] font-semibold border border-brand/25">
                Active
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="px-4 py-2.5 border-b border-line/40 last:border-0">
      <label className="block text-[12px] font-medium text-ink-dim mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none text-[14px] py-1"
      />
    </div>
  )
}

function FieldButton({ label, value, onTap }: { label: string; value: string; onTap: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="w-full text-left px-4 py-2.5 border-b border-line/40 last:border-0 active:bg-surface-elevated transition flex items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-ink-dim mb-1">{label}</p>
        <p className="text-[14px] py-1 truncate">{value || '—'}</p>
      </div>
      <ChevronRight size={16} className="text-ink-dim flex-shrink-0" />
    </button>
  )
}

/* ---------- Account ---------- */

export function AccountScreen({ onBack, go }: { onBack: () => void; go: (v: View) => void }) {
  const toast = useToast()
  const t = useT()
  const [avatarSheet, setAvatarSheet] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const planLabel = account.plan === 'pro' ? t('sub.pro') : t('sub.free') + ' ' + t('account.plan').toLowerCase()

  return (
    <Page title={t('account.title')} onBack={onBack}>
      <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-5 flex items-center gap-3.5">
        <button onClick={() => setAvatarSheet(true)} className="relative h-12 w-12 rounded-full bg-gradient-to-br from-brand to-brand-violet p-[2px]" aria-label="Change avatar">
          <div className="h-full w-full rounded-full bg-canvas grid place-items-center">
            <span className="text-[14px] font-bold">{account.displayName.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-ink text-canvas grid place-items-center border-2 border-surface">
            <Camera size={10} strokeWidth={2.4} />
          </span>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold leading-tight truncate">{account.displayName}</p>
          <p className="text-[12px] text-ink-dim mt-0.5">{planLabel} · {account.credits} AI credits</p>
        </div>
      </div>

      <SectionLabel>{t('account.profile')}</SectionLabel>
      <Group>
        <AccountRow icon={<User size={15} />} label={t('account.row.displayName')} value={account.displayName} onClick={() => go({ kind: 'account-display-name' })} />
      </Group>

      <SectionLabel>{t('account.signin')}</SectionLabel>
      <Group>
        <AccountRow icon={<Mail size={15} />} label={t('account.row.email')} value={account.recoveryEmail} onClick={() => go({ kind: 'account-email' })} />
      </Group>

      <button
        onClick={() => setConfirmDelete(true)}
        className="w-full p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/8 flex items-center justify-center gap-2 text-[14px] font-semibold text-rose-400"
      >
        <Trash2 size={15} strokeWidth={1.8} />
        <span>{t('account.delete')}</span>
      </button>

      {avatarSheet && (
        <AvatarSheet
          onClose={() => setAvatarSheet(false)}
          onAction={(action) => {
            setAvatarSheet(false)
            const labels: Record<string, string> = { camera: 'Open camera (mock)', library: 'Open photo library (mock)', remove: 'Photo removed' }
            toast.show(labels[action], action === 'remove' ? 'success' : 'info')
          }}
        />
      )}
      {confirmDelete && (
        <DeleteAccountConfirm
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => { setConfirmDelete(false); toast.show('Account scheduled for deletion (mock)', 'info') }}
        />
      )}
    </Page>
  )
}

function AccountRow({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0 hover:bg-surface-elevated transition">
      <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted flex-shrink-0">{icon}</div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-[14px] font-semibold leading-tight">{label}</p>
        <p className="text-[11.5px] text-ink-dim mt-0.5 truncate">{value}</p>
      </div>
      <ChevronRight size={16} className="text-ink-dim flex-shrink-0" strokeWidth={1.8} />
    </button>
  )
}

function AvatarSheet({ onClose, onAction }: { onClose: () => void; onAction: (a: 'camera' | 'library' | 'remove') => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full rounded-t-[24px] border-t border-x border-line/70 bg-surface p-4 pb-6 animate-slide-up">
        <div className="mx-auto h-1 w-10 rounded-full bg-line/70 mb-3" />
        <p className="text-center text-[12px] font-medium text-ink-dim mb-3">Change avatar</p>
        <div className="rounded-[20px] border border-line/60 bg-surface/60 overflow-hidden mb-2">
          <SheetRow icon={<Camera size={16} />} label="Take photo" onClick={() => onAction('camera')} />
          <SheetRow icon={<ImageIcon size={16} />} label="Choose from library" onClick={() => onAction('library')} />
          <SheetRow icon={<Trash2 size={16} />} label="Remove current photo" danger onClick={() => onAction('remove')} />
        </div>
        <button onClick={onClose} className="w-full h-12 rounded-2xl border border-line/70 bg-surface-elevated text-[14px] font-semibold">Cancel</button>
      </div>
    </div>
  )
}

function SheetRow({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0 hover:bg-surface-elevated transition ${danger ? 'text-rose-400' : ''}`}>
      <div className={`h-9 w-9 rounded-xl border grid place-items-center flex-shrink-0 ${danger ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-surface-higher border-line/60 text-ink-muted'}`}>{icon}</div>
      <span className="text-[14px] font-semibold">{label}</span>
    </button>
  )
}

function DeleteAccountConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [text, setText] = useState('')
  const ok = text.trim().toUpperCase() === 'DELETE'
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-[340px] rounded-[24px] border border-line/70 bg-surface p-5 animate-pop-in">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 grid place-items-center mb-4 mx-auto">
          <AlertTriangle size={20} className="text-rose-400" strokeWidth={1.8} />
        </div>
        <h2 className="text-[16px] font-semibold text-center">Delete your account?</h2>
        <p className="text-[12.5px] text-ink-dim text-center mt-1.5 leading-relaxed">
          This permanently removes your card, saved contacts, and AI credits. Type <span className="font-semibold text-ink">DELETE</span> to confirm.
        </p>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type DELETE"
          className="w-full mt-4 h-11 px-3 rounded-xl border border-line/70 bg-surface-elevated text-[14px] outline-none focus:border-rose-500/50"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-line/70 bg-surface-elevated text-[13.5px] font-semibold">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={!ok}
            className="flex-1 h-11 rounded-xl bg-rose-500 text-sand-0 text-[13.5px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Edit Display Name ---------- */

export function EditDisplayNameScreen({ onBack }: { onBack: () => void }) {
  const toast = useToast()
  const t = useT()
  const [name, setName] = useState(account.displayName)
  const dirty = name.trim().length > 0 && name !== account.displayName
  const save = () => {
    if (!dirty) return
    toast.show(t('editName.title') + ' ' + t('common.save'))
    setTimeout(onBack, 400)
  }
  return (
    <Page
      title={t('editName.title')}
      onBack={onBack}
      right={
        <button onClick={save} disabled={!dirty} className="px-3.5 h-9 pt-px rounded-full bg-sand-0 text-black text-[12.5px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
          Save
        </button>
      }
    >
      <SectionLabel>Your name in Swapo</SectionLabel>
      <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-3">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          className="w-full bg-transparent outline-none text-[15px] font-semibold"
          placeholder="Enter display name"
        />
        <p className="text-[11px] text-ink-dim mt-1.5 text-right">{name.length} / 40</p>
      </div>
      <p className="text-[11.5px] text-ink-dim leading-relaxed px-1">
        This is how you appear inside the Swapo app. Your card name (shown to people who scan your card) is set separately under My Card.
      </p>
    </Page>
  )
}

/* ---------- Edit Recovery Email ---------- */

export function EditRecoveryEmailScreen({ onBack }: { onBack: () => void }) {
  const toast = useToast()
  const [email, setEmail] = useState(account.recoveryEmail)
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const dirty = email !== account.recoveryEmail
  const save = () => {
    if (!valid || !dirty) return
    toast.show('Verification email sent')
    setTimeout(onBack, 500)
  }
  return (
    <Page
      title="Recovery email"
      onBack={onBack}
      right={
        <button onClick={save} disabled={!valid || !dirty} className="px-3.5 h-9 pt-px rounded-full bg-sand-0 text-black text-[12.5px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
          Save
        </button>
      }
    >
      <SectionLabel>Email address</SectionLabel>
      <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-3">
        <input
          autoFocus
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent outline-none text-[15px] font-semibold"
          placeholder="you@example.com"
        />
      </div>
      <p className="text-[11.5px] text-ink-dim leading-relaxed px-1">
        We use this email to recover your account if you lose access to your phone number. We'll send a verification link before the change takes effect.
      </p>
    </Page>
  )
}

/* ---------- Linked Accounts ---------- */

type Provider = 'Google' | 'Apple' | 'Facebook'
const ALL_PROVIDERS: Provider[] = ['Google', 'Apple', 'Facebook']

export function LinkedAccountsScreen({ onBack }: { onBack: () => void }) {
  const toast = useToast()
  const [linked, setLinked] = useState<Record<Provider, boolean>>({
    Google: account.linked.includes('Google'),
    Apple: account.linked.includes('Apple'),
    Facebook: account.linked.includes('Facebook'),
  })
  const toggle = (p: Provider) => {
    setLinked((s) => {
      const next = !s[p]
      toast.show(next ? `${p} connected` : `${p} disconnected`, next ? 'success' : 'info')
      return { ...s, [p]: next }
    })
  }
  return (
    <Page title="Linked accounts" onBack={onBack}>
      <SectionLabel>Sign in with</SectionLabel>
      <Group>
        {ALL_PROVIDERS.map((p, i) => (
          <div key={p} className={`flex items-center gap-3.5 px-4 py-3.5 ${i < ALL_PROVIDERS.length - 1 ? 'border-b border-line/40' : ''}`}>
            <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted flex-shrink-0">
              <Plug size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold leading-tight">{p}</p>
              <p className="text-[11.5px] text-ink-dim mt-0.5">{linked[p] ? 'Connected' : 'Not connected'}</p>
            </div>
            <button
              onClick={() => toggle(p)}
              className={`h-8 px-3.5 rounded-full text-[12px] font-semibold transition ${
                linked[p]
                  ? 'border border-line/70 bg-surface-elevated text-ink-muted'
                  : 'bg-brand text-sand-0'
              }`}
            >
              {linked[p] ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </Group>
      <p className="text-[11.5px] text-ink-dim leading-relaxed px-1">
        Connecting a provider lets you sign in to Swapo with that account in addition to your phone number. You can disconnect any provider at any time.
      </p>
    </Page>
  )
}

/* ---------- Card Analytics ---------- */

export function AnalyticsScreen({ onBack }: { onBack: () => void }) {
  const t = useT()
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d')
  const data = range === '7d'
    ? [3, 5, 2, 8, 12, 6, 10]
    : range === '30d'
    ? [4, 6, 3, 9, 12, 7, 10, 11, 5, 8, 13, 9, 12, 14, 8, 6, 10, 12, 9, 11, 14, 16, 12, 10, 13, 15, 11, 14, 17, 14]
    : Array.from({ length: 12 }, (_, i) => 5 + Math.round(Math.sin(i / 2) * 4 + i / 2))
  const max = Math.max(...data)
  const total = data.reduce((a, b) => a + b, 0)
  const labels = range === '7d' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : []

  return (
    <Page title={t('analytics.title')} onBack={onBack}>
      {/* Range */}
      <div className="flex items-center gap-2 mb-5">
        {(['7d', '30d', '90d'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition
              ${range === r ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'}`}
          >
            Last {r}
          </button>
        ))}
      </div>

      {/* Headline */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <Stat label="Views" value={String(total)} delta="+18%" up />
        <Stat label="Saves" value="9" delta="+22%" up />
        <Stat label="Scans" value="4" delta="–6%" />
      </div>

      {/* Chart */}
      <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 mb-5">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[14px] font-semibold">Card views</p>
          <span className="text-[11.5px] text-ink-dim">{total} total</span>
        </div>
        <div className="flex items-end gap-1.5 h-32">
          {data.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-md bg-gradient-to-t from-brand/70 to-brand"
                style={{ height: `${(v / max) * 100}%` }}
              />
              {labels[i] && <span className="text-[10px] text-ink-dim">{labels[i]}</span>}
            </div>
          ))}
        </div>
      </div>

      <SectionLabel>Top sources</SectionLabel>
      <Group>
        <SourceRow icon={<Share2 size={15} />} label="Smart link" pct={62} />
        <SourceRow icon={<MapPin size={15} />} label="Nearby" pct={24} />
        <SourceRow icon={<Camera size={15} />} label="QR scans" pct={14} />
      </Group>

      <SectionLabel>Recent visitors</SectionLabel>
      <Group>
        {contacts.slice(0, 4).map((c) => (
          <button key={c.id} className="w-full flex items-center gap-3 px-4 py-3 border-b border-line/40 last:border-0 text-left">
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${c.accent} grid place-items-center text-[12px] font-bold text-sand-0`}>
              {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold truncate">{c.name}</p>
              <p className="text-[11.5px] text-ink-dim truncate">{c.role} · viewed your card</p>
            </div>
            <span className="text-[11px] text-ink-dim">{1 + (c.id.charCodeAt(1) % 6)}h</span>
          </button>
        ))}
      </Group>
    </Page>
  )
}

function Stat({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="p-3 rounded-2xl border border-line/70 bg-surface">
      <p className="text-[12px] font-medium text-ink-dim">{label}</p>
      <p className="text-[18px] font-semibold mt-1 leading-none">{value}</p>
      <p className={`text-[10.5px] mt-1.5 font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>{delta}</p>
    </div>
  )
}

function SourceRow({ icon, label, pct }: { icon: React.ReactNode; label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3 border-b border-line/40 last:border-0">
      <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted">{icon}</div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-[13.5px] font-semibold">{label}</p>
          <p className="text-[12px] text-ink-dim">{pct}%</p>
        </div>
        <div className="h-1.5 rounded-full bg-surface-higher overflow-hidden">
          <div className="h-full bg-brand-gradient" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Invite Friend ---------- */

export function InviteScreen({ onBack }: { onBack: () => void }) {
  const toast = useToast()
  const t = useT()
  const link = 'swapo.mm/i/heinhtet'
  const [showTerms, setShowTerms] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard?.writeText(link)
    toast.show('Link copied')
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Page title={t('invite.title')} onBack={onBack}>
      <div className="relative overflow-hidden p-5 rounded-[20px] border border-brand/25 bg-brand/8 mb-5">
        <div className="h-12 w-12 rounded-2xl border border-brand/30 bg-brand/15 grid place-items-center mb-3">
          <Gift size={20} className="text-brand" strokeWidth={1.8} />
        </div>
        <p className="text-[18px] font-bold leading-tight">Both get +1 credit</p>
        <p className="text-[12.5px] text-ink-dim mt-1.5">Invite a friend. When they create their first card, you both unlock a free generation.</p>
      </div>

      <SectionLabel>Your invite link</SectionLabel>
      <div className="rounded-[20px] border border-line/60 bg-surface/60 p-3 mb-5 flex items-center gap-2">
        <div className="flex-1 px-3 py-2 rounded-xl bg-surface-higher border border-line/60 text-[13px] font-mono truncate">{link}</div>
        <button
          onClick={copyLink}
          aria-label={copied ? 'Copied' : 'Copy link'}
          className="h-10 w-10 grid place-items-center rounded-xl bg-ink text-canvas transition-transform active:scale-95"
        >
          {copied ? <Check size={15} strokeWidth={2.4} /> : <Copy size={15} strokeWidth={2.2} />}
        </button>
      </div>

      <SectionLabel>Share via</SectionLabel>
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        <ShareTile label="Messages" icon={<MessageCircle size={18} />} onClick={() => toast.show('Open Messages (mock)', 'info')} />
        <ShareTile label="Email" icon={<Mail size={18} />} onClick={() => toast.show('Open Mail (mock)', 'info')} />
        <ShareTile label="Share…" icon={<Share2 size={18} />} onClick={() => toast.show('Share sheet (mock)', 'info')} />
        <ShareTile label="More" icon={<ChevronRight size={18} />} onClick={() => toast.show('More options', 'info')} />
      </div>

      <SectionLabel>Your rewards</SectionLabel>
      <div className="rounded-[20px] border border-line/60 bg-surface/60 p-5 mb-3">
        <div className="flex items-center gap-5">
          {/* Circular progress */}
          <div className="relative h-[100px] w-[100px] flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="44" strokeWidth="5" className="stroke-line/60" fill="none" />
              <circle
                cx="50" cy="50" r="44"
                strokeWidth="5"
                strokeLinecap="round"
                className="stroke-brand"
                fill="none"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - 22 / 30)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[22px] font-semibold leading-none tracking-tight">22</p>
              <p className="text-[10px] font-medium text-ink-dim mt-0.5">of 30</p>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold leading-snug">Credits this month</p>
            <p className="text-[12.5px] text-brand font-medium mt-1.5">8 more to reach the cap</p>
            <p className="text-[11.5px] text-ink-dim mt-1">Resets May 1</p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-line/40 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="text-center">
            <p className="text-[18px] font-semibold leading-none">2</p>
            <p className="text-[12px] text-ink-dim mt-1.5">Friends joined</p>
          </div>
          <div className="h-8 w-px bg-line/50 mx-4" />
          <div className="text-center">
            <p className="text-[18px] font-semibold leading-none">1</p>
            <p className="text-[12px] text-ink-dim mt-1.5">Invite pending</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowTerms(true)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-line/60 bg-surface/60 hover:bg-surface transition"
      >
        <span className="text-[13px] font-medium text-ink">Read program terms</span>
        <ChevronRight size={16} className="text-ink-dim" strokeWidth={1.8} />
      </button>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </Page>
  )
}

function ShareTile({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 py-3 rounded-2xl border border-line/70 bg-surface">
      <span className="text-ink">{icon}</span>
      <span className="text-[11px] font-medium text-ink-muted">{label}</span>
    </button>
  )
}

function TermsModal({ onClose }: { onClose: () => void }) {
  const items = [
    {
      title: 'About the program',
      body: 'The Swapo Referral Program lets active Swapo users earn AI credits by inviting new users to the app. Participation is free, and you can opt out at any time by no longer sharing your invite link.',
    },
    {
      title: 'How you earn credits',
      body: 'You earn 1 AI credit each time a new user signs up using your unique invite link and successfully creates their first card on Swapo. Your friend will also receive 1 credit on their account as a welcome bonus. Credits are added to your balance within 24 hours of the qualifying action.',
    },
    {
      title: 'Monthly earning cap',
      body: 'You can earn up to 30 referral credits per calendar month. The counter resets at 00:00 (Yangon time) on the 1st of each month. Credits earned beyond the cap are not granted, and unused cap does not roll over.',
    },
    {
      title: 'Who can participate',
      body: 'You must have an active Swapo account in good standing. Invited friends must be brand-new Swapo users (not previously registered). Self-referrals, duplicate accounts, and accounts created on behalf of other people do not qualify and may result in credits being reversed.',
    },
    {
      title: 'Using your credits',
      body: 'Credits can be spent on AI generations within Swapo, including business cards, logos, and other AI-assisted designs. Credits have no monetary value, are non-transferable, cannot be exchanged for cash, and do not expire while your Swapo account remains active.',
    },
    {
      title: 'Fair use and prohibited conduct',
      body: 'You may not use bots, scripts, paid traffic, fake accounts, spam, misleading content, or any other deceptive method to obtain credits. Swapo reserves the right to pause your account, reverse credits, or remove you from the program if abuse is detected, with or without notice.',
    },
    {
      title: 'Privacy',
      body: 'When a friend uses your invite link, Swapo records the referral connection so we can credit your account. We do not share your personal information with the people you invite beyond what is needed to attribute the referral. See our Privacy Policy for full details.',
    },
    {
      title: 'Changes and termination',
      body: 'Swapo may modify, pause, or end the Referral Program at any time, in whole or in part. Material changes (such as reward amounts or caps) will be announced in-app at least 7 days before they take effect. Credits already earned before a change will be honored.',
    },
    {
      title: 'Questions',
      body: 'If you have questions about your credits or believe a referral was missed, contact us at support@swapo.mm and include your account email and your friend\'s email so we can investigate.',
    },
  ]

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />

      <div className="relative w-full max-h-[85%] rounded-t-[28px] border-t border-x border-line/70 bg-canvas flex flex-col animate-slide-up overflow-hidden">
        {/* Drag handle */}
        <div className="pt-2.5 pb-1 flex justify-center flex-shrink-0">
          <div className="h-[3px] w-9 rounded-full bg-line-strong" />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight leading-tight">Program terms</h2>
            <p className="text-[12px] text-ink-dim mt-1.5">Updated April 2026</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 grid place-items-center rounded-full border border-line/70 bg-surface/80 flex-shrink-0"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5">
          {items.map((it, i) => (
            <div key={i} className="py-5 border-b border-line/30 last:border-0">
              <p className="text-[15px] font-semibold leading-snug">{it.title}</p>
              <p className="text-[13px] text-ink-dim leading-relaxed mt-2">{it.body}</p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-5 pt-3 pb-6 border-t border-line/40 bg-canvas flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[14px] active:scale-[0.99] transition inline-flex items-center justify-center"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Search ---------- */

export function SearchScreen({ onBack, go, initial = '' }: { onBack: () => void; go: (v: View) => void; initial?: string }) {
  const t = useT()
  const [q, setQ] = useState(initial)
  const recent = ['logistics', 'designer', 'mandalay']
  const matches = q.trim().length === 0
    ? []
    : contacts.filter((c) =>
        [c.name, c.role, c.company, c.city, ...(c.tags || [])].some((s) => s.toLowerCase().includes(q.toLowerCase())),
      )

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <header className="relative z-30 flex items-center gap-2 px-3 pt-12 pb-3 bg-canvas/80 backdrop-blur">
        <button onClick={onBack} className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3.5 h-10 rounded-2xl border border-line/70 bg-surface">
          <Search size={16} className="text-ink-dim" strokeWidth={1.8} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent outline-none text-[13.5px] placeholder:text-ink-dim"
          />
          {q && (
            <button onClick={() => setQ('')} className="h-6 w-6 grid place-items-center rounded-full bg-surface-higher">
              <X size={12} strokeWidth={2} className="text-ink-dim" />
            </button>
          )}
        </div>
      </header>

      <div className="px-5 pb-8">
        {q.trim().length === 0 ? (
          <>
            <SectionLabel>{t('search.recent')}</SectionLabel>
            <Group>
              {recent.map((r) => (
                <button key={r} onClick={() => setQ(r)} className="w-full flex items-center gap-3.5 px-4 py-3 border-b border-line/40 last:border-0">
                  <Search size={14} className="text-ink-dim" />
                  <span className="flex-1 text-left text-[13.5px]">{r}</span>
                  <ArrowUpRight size={14} className="text-ink-dim" />
                </button>
              ))}
            </Group>

            <SectionLabel>Suggested filters</SectionLabel>
            <div className="flex flex-wrap gap-2 mb-5">
              {['Yangon', 'Mandalay', 'Tech', 'Founder', 'Lead', 'Recently added'].map((t) => (
                <button key={t} onClick={() => setQ(t.toLowerCase())} className="px-3 py-1.5 rounded-full bg-surface border border-line/70 text-[12px] font-medium">
                  {t}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-[12px] text-ink-dim mb-3 ml-1">{matches.length} result{matches.length === 1 ? '' : 's'} for "{q}"</p>
            {matches.length === 0 ? (
              <div className="text-center py-12 rounded-[20px] border border-line/60 bg-surface/40">
                <p className="text-[14px] font-semibold">No matches</p>
                <p className="text-[12px] text-ink-dim mt-1">Try a different keyword.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {matches.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => go({ kind: 'card-detail', contact: c })}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-line/60 bg-surface/60"
                  >
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.accent} grid place-items-center text-[13px] font-bold text-sand-0`}>
                      {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-[14px] font-semibold truncate">{c.name}</p>
                      <p className="text-[11.5px] text-ink-dim truncate">{c.role} · {c.company}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated border border-line/60 text-[10.5px] font-semibold text-ink-muted">{c.city}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- Filter ---------- */

export function FilterScreen({ onBack }: { onBack: () => void }) {
  const toast = useToast()
  const t = useT()
  const [city, setCity] = useState<string[]>([])
  const [tag, setTag] = useState<string[]>([])
  const [recency, setRecency] = useState<'any' | '7' | '30' | '90'>('any')
  const cities = ['Yangon', 'Mandalay', 'Naypyidaw', 'Bago']
  const tags = ['Lead', 'Mentor', 'Friend', 'Tech', 'Creative', 'Founder', 'Partner']

  const toggle = (xs: string[], setXs: (v: string[]) => void, v: string) =>
    setXs(xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v])

  const reset = () => { setCity([]); setTag([]); setRecency('any') }
  const apply = () => { toast.show(`Filter applied · ${city.length + tag.length + (recency !== 'any' ? 1 : 0)} active`); setTimeout(onBack, 400) }

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader
        title={t('filter.title')}
        onBack={onBack}
        right={<button onClick={reset} className="text-[12.5px] font-semibold text-ink-dim">{t('filter.clear')}</button>}
      />

      <div className="px-5 pb-32">
        <SectionLabel>City</SectionLabel>
        <div className="flex flex-wrap gap-2 mb-5">
          {cities.map((c) => (
            <Chip key={c} active={city.includes(c)} onClick={() => toggle(city, setCity, c)}>{c}</Chip>
          ))}
        </div>

        <SectionLabel>Tags</SectionLabel>
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((t) => (
            <Chip key={t} active={tag.includes(t)} onClick={() => toggle(tag, setTag, t)}>{t}</Chip>
          ))}
        </div>

        <SectionLabel>Added</SectionLabel>
        <Group>
          {([['any', 'Any time'], ['7', 'Last 7 days'], ['30', 'Last 30 days'], ['90', 'Last 90 days']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setRecency(id)} className="w-full flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0 text-left">
              <Calendar size={15} className="text-ink-muted" />
              <span className="flex-1 text-[14px] font-semibold">{label}</span>
              {recency === id && <Check size={16} className="text-brand" strokeWidth={2.2} />}
            </button>
          ))}
        </Group>
      </div>

      <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-gradient-to-t from-canvas via-canvas to-canvas/0">
        <button onClick={apply} className="w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[14.5px] flex items-center justify-center">
          Show results
        </button>
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition
        ${active ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'}`}
    >
      {children}
    </button>
  )
}

/* ---------- Exchange (after tapping a Nearby person) ---------- */

export function ExchangeScreen({
  onBack,
  name,
  role,
  accent,
  phone,
  email,
  website,
  city,
  onViewCard,
}: {
  onBack: () => void
  name: string
  role: string
  accent: string
  phone: string
  email: string
  website?: string
  city: string
  onViewCard: (c: Contact) => void
}) {
  const toast = useToast()
  const t = useT()
  const [phase, setPhase] = useState<'request' | 'sent' | 'done'>('request')
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('')

  const send = () => {
    setPhase('sent')
    setTimeout(() => setPhase('done'), 1400)
  }

  const viewTheirCard = () => {
    const [parsedRole, parsedCompany] = role.split(' · ')
    onViewCard({
      id: `nearby-${name.replace(/\s+/g, '-').toLowerCase()}`,
      name,
      role: parsedRole || role,
      company: parsedCompany || '',
      city,
      phone,
      email,
      website,
      bio: 'Met via Nearby exchange.',
      metAt: 'Nearby exchange · just now',
      tags: ['Nearby'],
      accent,
    })
  }

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader title={t('exchange.title')} onBack={onBack} />

      <div className="px-5 pb-8">
        {/* Avatars — exchange stage */}
        <div className="relative h-36 mb-5 grid place-items-center">
          {/* Connecting beam */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-px bg-gradient-to-r from-transparent via-line-strong to-transparent pointer-events-none" />

          {/* Particles flowing both directions */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span className="block absolute -mt-1.5 -ml-0.5 h-1.5 w-1.5 rounded-full bg-ink animate-flow-right" />
            <span className="block absolute mt-1 -ml-0.5 h-1.5 w-1.5 rounded-full bg-brand animate-flow-left" />
          </div>

          <div className="relative flex items-center gap-4 animate-pop-in">
            {/* HH (me) */}
            <div className="h-16 w-16 rounded-full bg-surface-elevated border border-line/60 grid place-items-center text-ink font-semibold text-[16px]">
              HH
            </div>

            {/* Exchange icon */}
            <div className="h-9 w-9 rounded-full border border-line/60 bg-canvas grid place-items-center">
              <ArrowRightLeft size={14} className="text-ink-muted" strokeWidth={2} />
            </div>

            {/* Their avatar */}
            <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${accent} grid place-items-center text-sand-0 font-semibold text-[16px]`}>
              {initials}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-[18px] font-bold">{name}</p>
          <p className="text-[12.5px] text-ink-dim mt-1">{role}</p>
        </div>

        {phase === 'request' && (
          <>
            <SectionLabel>You'll share</SectionLabel>
            <Group>
              <ShareItem label="Name" value={me.name} on />
              <ShareItem label="Role" value={`${me.role} · ${me.company}`} on />
              <ShareItem label="Phone" value={me.phone} on />
              <ShareItem label="Email" value={me.email} on />
            </Group>

            <button
              onClick={send}
              className="w-full h-[52px] rounded-full bg-sand-0 text-black font-semibold text-[14.5px] flex items-center justify-center"
            >
              Send exchange request
            </button>
            <button
              onClick={() => { toast.show('Card saved without exchange'); onBack() }}
              className="w-full mt-2 py-3 text-[13px] text-ink-dim font-medium"
            >
              Save without exchange
            </button>
          </>
        )}

        {phase === 'sent' && (
          <div className="py-10 text-center animate-fade-in">
            <div className="mx-auto mb-5 h-12 w-12 rounded-full border-[2.5px] border-line border-t-brand animate-spin" />
            <p className="text-[15px] font-semibold">Sending request…</p>
            <p className="text-[12.5px] text-ink-dim mt-1.5">Waiting for {name.split(' ')[0]} to accept</p>
          </div>
        )}

        {phase === 'done' && (
          <div className="py-8 text-center animate-fade-in">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-brand/12 border border-brand/30 grid place-items-center">
              <Check size={22} className="text-brand" strokeWidth={2.4} />
            </div>
            <p className="text-[17px] font-bold">Exchanged</p>
            <p className="text-[12.5px] text-ink-dim mt-1.5 leading-relaxed max-w-[240px] mx-auto">
              {name} is now in your Swapo.
            </p>
            <button
              onClick={viewTheirCard}
              className="mt-6 w-full h-[52px] rounded-full bg-sand-0 text-black text-[14.5px] font-semibold inline-flex items-center justify-center"
            >
              View their card
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ShareItem({ label, value, on }: { label: string; value: string; on: boolean }) {
  const [v, setV] = useState(on)
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-line/40 last:border-0">
      <div className="flex-1">
        <p className="text-[12px] font-medium text-ink-dim">{label}</p>
        <p className="text-[13.5px] mt-0.5 truncate">{value}</p>
      </div>
      <button
        onClick={() => setV(!v)}
        className={`relative h-6 w-10 rounded-full transition ${v ? 'bg-brand' : 'bg-surface-higher border border-line/70'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-sand-0 transition-all ${v ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

