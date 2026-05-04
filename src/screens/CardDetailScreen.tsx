import { useState } from 'react'
import {
  Phone, Mail, Globe, MapPin, Tag, Calendar, MessageCircle, Share2,
  MoreHorizontal, X, Star, Bell, Pencil, Trash2, AlertTriangle, Plus,
  Copy, ExternalLink,
} from 'lucide-react'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'
import type { Contact } from '../data'
import type { View } from '../nav'

export function CardDetailScreen({
  contact,
  onBack,
  go,
  isFavorite,
  onToggleFavorite,
}: {
  contact: Contact
  onBack: () => void
  go: (v: View) => void
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  const toast = useToast()
  const [showMenu, setShowMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [tags, setTags] = useState<string[]>(contact.tags || [])
  const [addingTag, setAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [notes, setNotes] = useState('')

  const initials = contact.name.split(' ').map((p) => p[0]).slice(0, 2).join('')

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value)
    toast.show(`${label} copied`)
  }

  const addTag = () => {
    const t = newTag.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setNewTag('')
    setAddingTag(false)
  }

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t))

  return (
    <div className="absolute inset-0 bg-canvas overflow-y-auto scrollbar-hide animate-fade-in">
      <SubScreenHeader
        onBack={onBack}
        right={
          <button onClick={() => setShowMenu(true)} className="h-10 w-10 grid place-items-center rounded-full border border-line/70 bg-surface/80">
            <MoreHorizontal size={18} strokeWidth={1.8} />
          </button>
        }
      />

      {/* Hero card preview */}
      <div className="px-5 pt-1 pb-5">
        <div className={`relative rounded-[24px] aspect-[1.7/1] bg-gradient-to-br ${contact.accent} border border-line/70 p-5 overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-canvas/20 to-canvas/40" />
          <div className="relative flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-white/95 grid place-items-center text-canvas font-bold text-[15px]">{initials}</div>
              <span className="px-2.5 py-1 rounded-full bg-canvas/40 backdrop-blur text-[10.5px] font-semibold border border-white/15">{contact.city}</span>
            </div>
            <div>
              <p className="text-[22px] font-bold tracking-tight leading-tight">{contact.name}</p>
              <p className="text-[12.5px] text-ink-muted mt-0.5">{contact.role} · {contact.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions row */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-4 gap-2.5">
          <ActionPill icon={<Phone size={17} strokeWidth={1.8} />} label="Call" href={`tel:${contact.phone.replace(/\s/g, '')}`} />
          <ActionPill icon={<MessageCircle size={17} strokeWidth={1.8} />} label="Message" href={`sms:${contact.phone.replace(/\s/g, '')}`} />
          <ActionPill icon={<Mail size={17} strokeWidth={1.8} />} label="Email" href={`mailto:${contact.email}`} />
          <ActionPill icon={<Share2 size={17} strokeWidth={1.8} />} label="Share" onClick={() => toast.show('Share sheet (mock)', 'info')} />
        </div>
      </div>

      {/* Bio */}
      {contact.bio && (
        <div className="px-5 mb-5">
          <p className="text-[14px] text-ink-muted leading-relaxed">{contact.bio}</p>
        </div>
      )}

      {/* Info list */}
      <div className="px-5 mb-5">
        <div className="rounded-[20px] border border-line/60 bg-surface/60 overflow-hidden">
          {contact.phone && <InfoRow icon={<Phone size={15} />} label="Phone" value={contact.phone} action="copy" onAction={() => copy('Phone', contact.phone)} />}
          {contact.email && <InfoRow icon={<Mail size={15} />} label="Email" value={contact.email} action="copy" onAction={() => copy('Email', contact.email)} />}
          {contact.website && <InfoRow icon={<Globe size={15} />} label="Website" value={contact.website} action="open" onAction={() => { window.open(`https://${contact.website}`, '_blank'); toast.show('Opening website…', 'info') }} />}
          <InfoRow icon={<MapPin size={15} />} label="Location" value={contact.city} />
        </div>
      </div>

      {/* Met at */}
      {contact.metAt && (
        <>
          <SectionLabel>Context</SectionLabel>
          <div className="px-5 mb-5">
            <div className="rounded-[20px] border border-line/60 bg-surface/60 p-4 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-surface-higher border border-line/60 grid place-items-center">
                <Calendar size={15} className="text-ink-muted" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-ink-dim">First met</p>
                <p className="text-[13.5px] font-semibold mt-0.5">{contact.metAt}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tags */}
      <SectionLabel>Tags</SectionLabel>
      <div className="px-5 mb-5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line/70 bg-surface text-[12px] font-medium">
            <Tag size={11} strokeWidth={2} className="text-brand" />{t}
            <button onClick={() => removeTag(t)} className="ml-0.5 -mr-1 h-4 w-4 grid place-items-center rounded-full bg-surface-higher">
              <X size={9} strokeWidth={2.4} className="text-ink-dim" />
            </button>
          </span>
        ))}
        {addingTag ? (
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand/40 bg-brand/5">
            <input
              autoFocus
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') { setNewTag(''); setAddingTag(false) } }}
              onBlur={addTag}
              placeholder="New tag"
              className="bg-transparent outline-none text-[12px] w-20"
            />
          </div>
        ) : (
          <button onClick={() => setAddingTag(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-line-strong text-[12px] text-ink-muted">
            <Plus size={11} strokeWidth={2} /> Add tag
          </button>
        )}
      </div>

      {/* Notes */}
      <SectionLabel>Notes</SectionLabel>
      <div className="px-5 mb-5">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => { if (notes.trim()) toast.show('Note saved') }}
          placeholder="Where you met, what you discussed, follow-up reminders…"
          rows={4}
          className="w-full p-4 rounded-2xl border border-line/70 bg-surface text-[14px] outline-none focus:border-brand/60 resize-none placeholder:text-ink-dim"
        />
      </div>

      {/* Actions */}
      <div className="px-5 pb-8">
        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/8 flex items-center justify-center gap-2 text-[14px] font-semibold text-rose-400 transition"
        >
          <Trash2 size={15} strokeWidth={1.8} />
          <span>Delete contact</span>
        </button>
      </div>

      {/* More menu sheet */}
      {showMenu && (
        <Sheet onClose={() => setShowMenu(false)}>
          <SheetItem
            icon={<Pencil size={17} strokeWidth={1.8} />}
            label="Edit contact"
            onClick={() => { setShowMenu(false); go({ kind: 'edit-contact', contact }) }}
          />
          <SheetItem
            icon={<Star size={17} strokeWidth={1.8} className={isFavorite ? 'fill-brand text-brand' : ''} />}
            label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => {
              setShowMenu(false)
              onToggleFavorite()
              toast.show(isFavorite ? 'Removed from favorites' : 'Added to favorites')
            }}
          />
          <SheetItem icon={<Bell size={17} strokeWidth={1.8} />}   label="Set follow-up reminder"  onClick={() => { setShowMenu(false); toast.show('Reminder set for 1 week') }} />
          <SheetItem icon={<Share2 size={17} strokeWidth={1.8} />} label="Share card"              onClick={() => { setShowMenu(false); toast.show('Share sheet (mock)', 'info') }} />
          <div className="border-t border-line/40 my-1" />
          <SheetItem icon={<Trash2 size={17} strokeWidth={1.8} />} label="Delete"                  destructive onClick={() => { setShowMenu(false); setConfirmDelete(true) }} />
        </Sheet>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <DeleteAlert
          name={contact.name}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => { setConfirmDelete(false); toast.show('Contact deleted'); setTimeout(onBack, 400) }}
        />
      )}
    </div>
  )
}

function ActionPill({ icon, label, onClick, href }: { icon: React.ReactNode; label: string; onClick?: () => void; href?: string }) {
  const cls = 'flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-line/70 bg-surface'
  if (href) return <a href={href} className={cls}><span className="text-ink">{icon}</span><span className="text-[11px] font-medium text-ink-muted">{label}</span></a>
  return <button onClick={onClick} className={cls}><span className="text-ink">{icon}</span><span className="text-[11px] font-medium text-ink-muted">{label}</span></button>
}

function InfoRow({
  icon,
  label,
  value,
  action,
  onAction,
}: {
  icon: React.ReactNode
  label: string
  value: string
  action?: 'copy' | 'open'
  onAction?: () => void
}) {
  const ActionIcon = action === 'copy' ? Copy : action === 'open' ? ExternalLink : null
  const actionLabel = action === 'copy' ? `Copy ${label.toLowerCase()}` : `Open ${label.toLowerCase()}`
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-line/40 last:border-0">
      <div className="h-9 w-9 rounded-xl bg-surface-higher border border-line/60 grid place-items-center text-ink-muted flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-ink-dim">{label}</p>
        <p className="text-[13.5px] font-semibold truncate">{value}</p>
      </div>
      {ActionIcon && (
        <button
          onClick={onAction}
          aria-label={actionLabel}
          className="h-8 w-8 grid place-items-center rounded-full text-ink-muted hover:text-ink hover:bg-surface-elevated transition flex-shrink-0"
        >
          <ActionIcon size={15} strokeWidth={1.8} />
        </button>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-medium text-ink-dim px-5 mt-1 mb-2.5">{children}</p>
}

function Sheet({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
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
        <div className={title ? 'px-3 pt-3 pb-4' : 'px-3 pt-2 pb-3'}>{children}</div>
      </div>
    </div>
  )
}

function SheetItem({ icon, label, destructive, onClick }: { icon: React.ReactNode; label: string; destructive?: boolean; onClick: () => void }) {
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
      <span className="flex-1 text-[14px] font-medium leading-snug">{label}</span>
    </button>
  )
}

function DeleteAlert({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-[320px] rounded-[24px] border border-line/70 bg-surface p-5 animate-pop-in">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 grid place-items-center mb-4 mx-auto">
          <AlertTriangle size={20} className="text-rose-400" strokeWidth={1.8} />
        </div>
        <h2 className="text-[16px] font-semibold text-center">Delete {name}?</h2>
        <p className="text-[12.5px] text-ink-dim text-center mt-1.5 leading-relaxed">
          The card and any notes will be removed. This can't be undone.
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
