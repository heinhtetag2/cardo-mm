import { useState } from 'react'
import {
  CreditCard, Palette, Gift, Wand2, ChevronRight, MoreHorizontal,
  Share2, Download, PencilLine, Trash2, X, Check, Info, Copy,
  Mail, MessageCircle, Link as LinkIcon, FileImage, FileText, FileCode, Plus,
} from 'lucide-react'
import type { View } from '../nav'
import type { Creation } from '../data'
import { useToast } from '../components/Toast'

type SubAction = null | 'preview' | 'share' | 'download' | 'edit' | 'delete'

export function AICardScreen({
  go, creations, onDelete, onUpdate,
}: {
  go: (v: View) => void
  creations: Creation[]
  onDelete: (id: string) => void
  onUpdate: (id: string, patch: Partial<Creation>) => void
}) {
  const toast = useToast()
  const [actionFor, setActionFor] = useState<Creation | null>(null)
  const [subAction, setSubAction] = useState<SubAction>(null)
  const [showPicker, setShowPicker] = useState(false)

  const cards = creations.filter((c) => c.kind === 'card')
  const logos = creations.filter((c) => c.kind === 'logo')

  const closeAll = () => { setActionFor(null); setSubAction(null) }

  const startCreate = (mode: 'card' | 'logo') => {
    setShowPicker(false)
    go({ kind: 'ai-create', mode })
  }

  return (
    <div className="px-5 pt-2 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[30px] font-bold tracking-tight leading-[1.05]">
          Make it yours.
        </h1>
        <p className="text-[13px] text-ink-dim mt-2.5 leading-relaxed max-w-[280px]">
          Cards and logos, crafted around the way you work.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <Stat label="Cards" value={String(cards.length)} />
        <Stat label="Logos" value={String(logos.length)} />
        <Stat label="Credits" value="3" highlight />
      </div>

      <button onClick={() => go({ kind: 'invite' })} className="relative w-full p-4 rounded-[20px] border border-brand/25 bg-brand/8 flex items-center gap-3.5 mb-6 overflow-hidden">
        <div className="h-11 w-11 rounded-xl border border-brand/30 bg-brand/15 grid place-items-center">
          <Gift size={17} className="text-brand" strokeWidth={1.8} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[14.5px] font-semibold">Earn unlimited credits</p>
          <p className="text-[12px] text-ink-dim mt-0.5">You and your friend each get +1 credit.</p>
        </div>
        <ChevronRight size={18} className="text-ink-dim" strokeWidth={1.8} />
      </button>

      {creations.length === 0 ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full rounded-[20px] border border-dashed border-line-strong bg-surface/40 p-8 text-center transition hover:border-brand/50 hover:bg-surface/60 active:scale-[0.99] group"
        >
          <div className="h-14 w-14 mx-auto rounded-2xl bg-surface-higher border border-line/60 grid place-items-center mb-4 transition group-hover:border-brand/40">
            <Plus size={22} className="text-ink-muted transition group-hover:text-brand" strokeWidth={2.2} />
          </div>
          <p className="text-[14.5px] font-semibold mb-1">Make your first design</p>
          <p className="text-[12.5px] text-ink-dim leading-relaxed max-w-[260px] mx-auto">
            Cardo's AI shapes a card or logo around your brand — ready in 30s.
          </p>
        </button>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-medium text-ink-dim">Your creations</p>
            <p className="text-[11.5px] text-ink-dim tabular-nums">{creations.length}</p>
          </div>
          <div className="space-y-2.5">
            {creations.map((c) => (
              <CreationRow
                key={c.id}
                c={c}
                onPreview={() => { setActionFor(c); setSubAction('preview') }}
                onMore={() => setActionFor(c)}
              />
            ))}
            <button
              onClick={() => setShowPicker(true)}
              className="w-full mt-1 p-3.5 rounded-[18px] border border-dashed border-line-strong bg-surface/40 flex items-center justify-center gap-1.5 text-[13px] font-medium text-ink-muted hover:border-brand/40 hover:text-brand transition"
            >
              <Plus size={14} strokeWidth={2.2} />
              <span>Create another</span>
            </button>
          </div>
        </div>
      )}

      {/* Create picker */}
      {showPicker && (
        <ActionSheet onClose={() => setShowPicker(false)} title="What do you want to create?">
          <div className="grid grid-cols-2 gap-3 px-2 pt-1 pb-2">
            <PickerCard
              icon={<CreditCard size={20} strokeWidth={1.8} />}
              title="Card"
              subtitle="Three styles, one tap"
              onClick={() => startCreate('card')}
            />
            <PickerCard
              icon={<Palette size={20} strokeWidth={1.8} />}
              title="Logo"
              subtitle="Brand mark in 30s"
              onClick={() => startCreate('logo')}
            />
          </div>
          <p className="text-[11.5px] text-ink-dim text-center mt-2 mb-1">
            Each generation uses 1 credit
          </p>
        </ActionSheet>
      )}

      {/* Action sheet */}
      {actionFor && subAction === null && (
        <ActionSheet onClose={closeAll}>
          <ActionRow icon={<Share2 size={17} strokeWidth={1.8} />}      label="Share"        onClick={() => setSubAction('share')} />
          <ActionRow icon={<Download size={17} strokeWidth={1.8} />}    label="Download"     onClick={() => setSubAction('download')} />
          <ActionRow icon={<PencilLine size={17} strokeWidth={1.8} />}  label="Edit details" onClick={() => setSubAction('edit')} />
          <div className="border-t border-line/40 my-1" />
          <ActionRow icon={<Trash2 size={17} strokeWidth={1.8} />}      label="Delete"       destructive onClick={() => setSubAction('delete')} />
        </ActionSheet>
      )}

      {/* Sub-action modals */}
      {actionFor && subAction === 'preview'  && <PreviewSheet  creation={actionFor} onClose={closeAll} onShare={() => setSubAction('share')} onDownload={() => setSubAction('download')} onEdit={() => setSubAction('edit')} />}
      {actionFor && subAction === 'share'    && <ShareSheet    creation={actionFor} onClose={closeAll} />}
      {actionFor && subAction === 'download' && <DownloadSheet creation={actionFor} onClose={closeAll} />}
      {actionFor && subAction === 'edit'     && <EditSheet     creation={actionFor} onSave={(patch) => { onUpdate(actionFor.id, patch); toast.show('Changes saved'); closeAll() }} onClose={closeAll} />}
      {actionFor && subAction === 'delete'   && <DeleteAlert   creation={actionFor} onConfirm={() => { onDelete(actionFor.id); toast.show('Deleted'); closeAll() }} onClose={closeAll} />}
    </div>
  )
}

function PickerCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative p-4 rounded-2xl border border-line/70 bg-surface text-left overflow-hidden transition active:scale-[0.98] hover:border-brand/40"
    >
      <div className="h-11 w-11 rounded-xl bg-surface-higher border border-line-strong grid place-items-center mb-8 text-ink">
        {icon}
      </div>
      <p className="text-[15px] font-semibold">{title}</p>
      <p className="text-[12px] text-ink-dim mt-0.5">{subtitle}</p>
    </button>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-3.5 rounded-2xl border border-line/70 bg-surface">
      <p className="text-[12px] font-medium text-ink-dim">{label}</p>
      <p className={`text-[18px] font-semibold mt-1 leading-none ${highlight ? 'text-brand' : 'text-ink'}`}>{value}</p>
    </div>
  )
}

function CreationRow({ c, onPreview, onMore }: { c: Creation; onPreview: () => void; onMore: () => void }) {
  const isCard = c.kind === 'card'
  return (
    <div className="flex items-center gap-3.5 p-3 rounded-[18px] border border-line/60 bg-surface/60">
      <button onClick={onPreview} aria-label="Preview" className="contents">
        {isCard ? (
          <div className="h-14 w-20 rounded-xl bg-gradient-to-br from-[#1a2440] via-[#171b2c] to-[#0c0d14] flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 p-2 flex flex-col justify-between">
              <div className="h-2 w-6 rounded-sm bg-white/40" />
              <div className="h-1.5 w-10 rounded-sm bg-white/70" />
            </div>
          </div>
        ) : (
          <div className="h-14 w-20 rounded-xl bg-surface-elevated border border-line/60 grid place-items-center flex-shrink-0">
            <div className="h-7 w-7 rounded-full bg-brand/80 grid place-items-center">
              <span className="text-white text-[10px] font-black">
                {(c.name[0] || 'C').toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold truncate">{c.name}</p>
            <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-line/60 text-[10px] font-semibold text-ink-muted flex-shrink-0">
              {isCard ? 'Card' : 'Logo'}
            </span>
          </div>
          <p className="text-[11.5px] text-ink-dim mt-0.5 truncate">
            {isCard ? `${c.role || ''}${c.role && c.industry ? ' · ' : ''}${c.industry || ''}` : `${c.styleId} · ${c.tone || ''}`}
          </p>
        </div>
      </button>

      <button
        onClick={onMore}
        aria-label="More options"
        className="h-8 w-8 grid place-items-center rounded-full border border-line/60 bg-surface flex-shrink-0"
      >
        <MoreHorizontal size={14} className="text-ink-dim" strokeWidth={2} />
      </button>
    </div>
  )
}

/* ---------- Reusable bottom sheet shell ---------- */

function ActionSheet({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full rounded-t-[28px] border-t border-x border-line/70 bg-canvas animate-slide-up overflow-hidden">
        <div className="pt-2.5 pb-2 flex justify-center">
          <div className="h-[3px] w-9 rounded-full bg-line-strong" />
        </div>
        {title && (
          <div className="px-5 pt-1 pb-4 flex items-center justify-between border-b border-line/40">
            <h2 className="text-[16px] font-semibold tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8 grid place-items-center rounded-full border border-line/70 bg-surface/80"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        )}
        <div className={title ? 'px-3 pt-2 pb-4' : 'px-3 pt-2 pb-3'}>{children}</div>
      </div>
    </div>
  )
}

function ActionRow({ icon, label, sub, destructive, onClick }: { icon: React.ReactNode; label: string; sub?: string; destructive?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-surface/80 transition text-left ${
        destructive ? 'text-rose-400' : 'text-ink'
      }`}
    >
      <span className={`flex-shrink-0 ${destructive ? 'text-rose-400' : 'text-ink-muted'}`}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-medium leading-snug">{label}</span>
        {sub && <span className="block text-[11.5px] text-ink-dim mt-0.5">{sub}</span>}
      </span>
    </button>
  )
}

/* ---------- Preview sheet ---------- */

function PreviewSheet({
  creation, onClose, onShare, onDownload, onEdit,
}: {
  creation: Creation
  onClose: () => void
  onShare: () => void
  onDownload: () => void
  onEdit: () => void
}) {
  const isCard = creation.kind === 'card'
  const initials = creation.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full rounded-t-[28px] border-t border-x border-line/70 bg-canvas animate-slide-up overflow-hidden">
        <div className="pt-2.5 pb-2 flex justify-center">
          <div className="h-[3px] w-9 rounded-full bg-line-strong" />
        </div>

        <div className="px-5 pt-1 pb-3 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[16px] font-semibold tracking-tight truncate">{creation.name}</p>
            <p className="text-[11.5px] text-ink-dim mt-0.5">{isCard ? 'Card' : 'Logo'}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 grid place-items-center rounded-full border border-line/70 bg-surface/80 flex-shrink-0"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Big preview */}
        <div className="px-5 pt-2 pb-5">
          {isCard ? (
            <div className="relative aspect-[1.7/1] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#1a2440] via-[#171b2c] to-[#0c0d14] border border-line/60 shadow-soft">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
              <div className="relative p-6 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                  <p className="text-[10.5px] tracking-[0.22em] font-bold text-white">CARDO·</p>
                  <div className="h-9 w-9 rounded-xl bg-white grid place-items-center text-canvas font-black text-[13px]">C</div>
                </div>
                <div>
                  <p className="text-[22px] font-bold text-white">{creation.name}</p>
                  <p className="text-[12.5px] text-white/60 mt-1">
                    {creation.role}{creation.role && creation.industry ? ' · ' : ''}{creation.industry}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[1.7/1] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#1a2440] to-[#0c0d14] border border-line/60 shadow-soft grid place-items-center">
              {creation.styleId === 'wordmark' && (
                <p className="text-[34px] font-bold tracking-tight text-white">{creation.name}</p>
              )}
              {creation.styleId === 'lettermark' && (
                <div className="h-24 w-24 rounded-3xl bg-brand grid place-items-center">
                  <p className="text-white text-[36px] font-black tracking-tight">{initials}</p>
                </div>
              )}
              {creation.styleId === 'symbol' && (
                <div className="h-24 w-24 rounded-full border-[4px] border-brand grid place-items-center">
                  <div className="h-10 w-10 rounded-full bg-brand" />
                </div>
              )}
              {creation.styleId === 'combination' && (
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-brand grid place-items-center">
                    <p className="text-white text-[24px] font-black">{initials[0]}</p>
                  </div>
                  <p className="text-[28px] font-bold tracking-tight text-white">{creation.name}</p>
                </div>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="mt-4 px-1">
            {isCard ? (
              <>
                {creation.role && (
                  <MetaRow label="Role" value={creation.role} />
                )}
                {creation.industry && (
                  <MetaRow label="Industry" value={creation.industry} />
                )}
              </>
            ) : (
              <>
                <MetaRow label="Type" value={creation.styleId} capitalize />
                {creation.tone && <MetaRow label="Tone" value={creation.tone} />}
              </>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-5 pb-6 grid grid-cols-3 gap-2">
          <PreviewAction icon={<Share2 size={16} strokeWidth={1.8} />}     label="Share"    onClick={onShare} />
          <PreviewAction icon={<Download size={16} strokeWidth={1.8} />}   label="Download" onClick={onDownload} />
          <PreviewAction icon={<PencilLine size={16} strokeWidth={1.8} />} label="Edit"     onClick={onEdit} />
        </div>
      </div>
    </div>
  )
}

function PreviewAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-line/70 bg-surface hover:bg-surface-elevated transition"
    >
      <span className="text-ink">{icon}</span>
      <span className="text-[11.5px] font-medium text-ink-muted">{label}</span>
    </button>
  )
}

function MetaRow({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-line/30 last:border-0">
      <span className="text-[12px] text-ink-dim">{label}</span>
      <span className={`text-[13px] font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</span>
    </div>
  )
}

/* ---------- Share sheet ---------- */

function ShareSheet({ creation, onClose }: { creation: Creation; onClose: () => void }) {
  const toast = useToast()
  const link = `cardo.mm/${creation.kind}/${creation.id.slice(-6)}`
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(link)
    setCopied(true)
    toast.show('Link copied')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ActionSheet onClose={onClose} title="Share">
      <div className="rounded-2xl border border-line/60 bg-surface/60 p-2.5 flex items-center gap-2 mb-3">
        <div className="flex-1 px-3 py-2 rounded-xl bg-surface-higher border border-line/60 text-[12.5px] font-mono truncate">
          {link}
        </div>
        <button
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy link'}
          className="h-9 w-9 grid place-items-center rounded-xl bg-ink text-canvas transition-transform active:scale-95"
        >
          {copied ? <Check size={14} strokeWidth={2.4} /> : <LinkIcon size={14} strokeWidth={2.2} />}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <ShareTile icon={<MessageCircle size={17} strokeWidth={1.8} />} label="Messages" onClick={() => toast.show('Open Messages')} />
        <ShareTile icon={<Mail size={17} strokeWidth={1.8} />}          label="Email"    onClick={() => toast.show('Open Mail')} />
        <ShareTile icon={<Share2 size={17} strokeWidth={1.8} />}        label="Share…"   onClick={() => toast.show('Share sheet')} />
        <ShareTile icon={<Copy size={17} strokeWidth={1.8} />}          label="Copy"     onClick={copy} />
      </div>
    </ActionSheet>
  )
}

function ShareTile({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 py-3.5 rounded-2xl border border-line/70 bg-surface">
      <span className="text-ink">{icon}</span>
      <span className="text-[11px] font-medium text-ink-muted">{label}</span>
    </button>
  )
}

/* ---------- Download sheet ---------- */

function DownloadSheet({ creation, onClose }: { creation: Creation; onClose: () => void }) {
  const toast = useToast()
  const isCard = creation.kind === 'card'

  const formats = isCard
    ? [
        { id: 'png',   icon: <FileImage size={17} strokeWidth={1.8} />, label: 'PNG image',   sub: '1080 × 640 · transparent' },
        { id: 'pdf',   icon: <FileText size={17} strokeWidth={1.8} />,  label: 'PDF',         sub: 'Print-ready · CMYK' },
        { id: 'vcard', icon: <FileCode size={17} strokeWidth={1.8} />,  label: 'vCard (.vcf)', sub: 'Add to phone contacts' },
      ]
    : [
        { id: 'svg', icon: <FileCode size={17} strokeWidth={1.8} />,  label: 'SVG',     sub: 'Vector · scales to any size' },
        { id: 'png', icon: <FileImage size={17} strokeWidth={1.8} />, label: 'PNG',     sub: '2048 × 2048 · transparent' },
        { id: 'pdf', icon: <FileText size={17} strokeWidth={1.8} />,  label: 'PDF',     sub: 'Print-ready' },
      ]

  return (
    <ActionSheet onClose={onClose} title="Download">
      {formats.map((f) => (
        <ActionRow
          key={f.id}
          icon={f.icon}
          label={f.label}
          sub={f.sub}
          onClick={() => { toast.show(`Downloading ${f.label}`); onClose() }}
        />
      ))}
    </ActionSheet>
  )
}

/* ---------- Edit sheet ---------- */

function EditSheet({ creation, onSave, onClose }: { creation: Creation; onSave: (patch: Partial<Creation>) => void; onClose: () => void }) {
  const isCard = creation.kind === 'card'
  const [name, setName] = useState(creation.name)
  const [role, setRole] = useState(creation.role || '')
  const [industry, setIndustry] = useState(creation.industry || 'Tech')
  const [tone, setTone] = useState(creation.tone || 'Modern')

  const save = () => {
    onSave(isCard ? { name, role, industry } : { name, tone })
  }

  return (
    <ActionSheet onClose={onClose} title="Edit details">
      <div className="px-2 pt-1">
        <div className="flex items-start gap-2.5 px-3 py-3 mb-3 rounded-2xl bg-surface-elevated border border-line/60">
          <Info size={14} className="text-ink-muted mt-0.5 flex-shrink-0" strokeWidth={1.8} />
          <p className="text-[12px] text-ink-dim leading-relaxed">
            You can update the text shown on your {isCard ? 'card' : 'logo'}. The visual style is fixed — to change it, regenerate with new options.
          </p>
        </div>

        <Field label={isCard ? 'Full name' : 'Brand name'} value={name} onChange={setName} />
        {isCard && <Field label="Role / Title" value={role} onChange={setRole} />}
        {isCard ? (
          <Chips label="Industry" value={industry} onChange={setIndustry} options={['Tech', 'Finance', 'Logistics', 'Creative', 'Healthcare', 'F&B', 'Other']} />
        ) : (
          <Chips label="Brand tone" value={tone} onChange={setTone} options={['Professional', 'Playful', 'Bold', 'Elegant', 'Modern', 'Minimal']} />
        )}

        <div className="flex gap-2 mt-5 mb-1">
          <button
            onClick={onClose}
            className="flex-1 h-12 pt-px rounded-2xl border border-line/70 bg-surface text-[14px] font-semibold text-ink-muted inline-flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!name.trim()}
            className="flex-1 h-12 pt-px rounded-2xl bg-ink text-canvas text-[14px] font-semibold disabled:opacity-40 inline-flex items-center justify-center"
          >
            Save changes
          </button>
        </div>
      </div>
    </ActionSheet>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-[12px] font-medium text-ink-dim mb-1.5 ml-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-2xl border border-line/70 bg-surface text-[14px] outline-none focus:border-brand/60 transition"
      />
    </div>
  )
}

function Chips({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="mb-3">
      <label className="block text-[12px] font-medium text-ink-dim mb-1.5 ml-1">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            className={`px-3.5 h-9 pt-px rounded-full text-[12.5px] font-medium border transition inline-flex items-center justify-center ${
              value === o ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Delete confirmation ---------- */

function DeleteAlert({ creation, onConfirm, onClose }: { creation: Creation; onConfirm: () => void; onClose: () => void }) {
  const isCard = creation.kind === 'card'
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-[320px] rounded-[24px] border border-line/70 bg-surface p-5 animate-pop-in">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 grid place-items-center mb-4 mx-auto">
          <Trash2 size={20} className="text-rose-400" strokeWidth={1.8} />
        </div>
        <h2 className="text-[16px] font-semibold text-center">Delete this {isCard ? 'card' : 'logo'}?</h2>
        <p className="text-[12.5px] text-ink-dim text-center mt-1.5 leading-relaxed">
          "{creation.name}" will be removed from your creations. This can't be undone.
        </p>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-line/70 bg-surface-elevated text-[13.5px] font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-rose-500 text-white text-[13.5px] font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
