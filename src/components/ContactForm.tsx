import { useState, type ReactNode } from 'react'
import {
  Briefcase, Building2, Camera, Mail, Phone, User,
} from 'lucide-react'
import { InputRow } from './InputRow'
import { LocationPicker, LocationPickerRow } from './LocationPicker'
import { WebsiteRow } from './WebsiteRow'
import { useT } from '../i18n'
import type { LocationOption } from '../locations'

export type ContactDraft = {
  name: string
  role: string
  company: string
  phone: string
  email: string
  website: string
  city: string
  tags: string[]
  notes: string
}

export const EMPTY_CONTACT: ContactDraft = {
  name: '', role: '', company: '', phone: '', email: '', website: '', city: '', tags: [], notes: '',
}

export function ContactForm({
  header,
  initial,
  saveLabel,
  topBanner,
  onSave,
}: {
  header: ReactNode
  initial?: Partial<ContactDraft>
  saveLabel?: string
  topBanner?: ReactNode
  onSave: (draft: ContactDraft) => void
}) {
  const t = useT()
  const TAG_OPTIONS = [
    { id: 'Lead',    label: t('form.tag.lead') },
    { id: 'Client',  label: t('form.tag.client') },
    { id: 'Partner', label: t('form.tag.partner') },
    { id: 'Friend',  label: t('form.tag.friend') },
    { id: 'Mentor',  label: t('form.tag.mentor') },
  ]
  const [data, setData] = useState<ContactDraft>({ ...EMPTY_CONTACT, ...initial })
  const [pickerOpen, setPickerOpen] = useState(false)
  const setStr = (k: 'name' | 'role' | 'company' | 'phone' | 'email' | 'website' | 'city' | 'notes') => (v: string) =>
    setData((d) => ({ ...d, [k]: v }))
  const toggleTag = (t: string) =>
    setData((d) => ({ ...d, tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t] }))

  return (
    <div className="absolute inset-0 bg-canvas flex flex-col animate-fade-in">
      <div className="sticky top-0 z-30 bg-canvas/95 backdrop-blur">{header}</div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-32">
        <div className="flex justify-center mb-7">
          <button className="relative h-24 w-24 rounded-full border-2 border-dashed border-line-strong bg-surface grid place-items-center">
            <Camera size={20} className="text-ink-dim" strokeWidth={1.8} />
            <span className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-surface-elevated border border-line/70 text-[10px] font-semibold text-ink-muted">{t('form.addPhoto')}</span>
          </button>
        </div>

        {topBanner && <div className="mb-5">{topBanner}</div>}

        <SectionLabel>{t('form.section.identity')}</SectionLabel>
        <div className="space-y-3 mb-6">
          <InputRow icon={<User size={15} />}      placeholder={t('form.placeholder.name')}    value={data.name}    onChange={setStr('name')} />
          <InputRow icon={<Briefcase size={15} />} placeholder={t('form.placeholder.role')}    value={data.role}    onChange={setStr('role')} />
          <InputRow icon={<Building2 size={15} />} placeholder={t('form.placeholder.company')} value={data.company} onChange={setStr('company')} />
        </div>

        <SectionLabel>{t('form.section.contact')}</SectionLabel>
        <div className="space-y-3 mb-6">
          <InputRow icon={<Phone size={15} />} placeholder={t('form.placeholder.phone')} value={data.phone} onChange={setStr('phone')} type="tel" />
          <InputRow icon={<Mail size={15} />}  placeholder={t('form.placeholder.email')} value={data.email} onChange={setStr('email')} type="email" />
          <WebsiteRow value={data.website} onChange={setStr('website')} />
          <LocationPickerRow value={data.city} onTap={() => setPickerOpen(true)} />
        </div>

        <SectionLabel>{t('form.section.tags')}</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {TAG_OPTIONS.map((tag) => {
            const active = data.tags.includes(tag.id)
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3.5 h-9 rounded-full text-[12px] font-medium border transition inline-flex items-center justify-center leading-none ${
                  active ? 'bg-ink text-canvas border-ink' : 'bg-surface text-ink-muted border-line/70'
                }`}
              >
                {active ? tag.label : `+ ${tag.label}`}
              </button>
            )
          })}
        </div>

        <SectionLabel>{t('form.section.notes')}</SectionLabel>
        <textarea
          placeholder={t('form.placeholder.notes')}
          rows={4}
          value={data.notes}
          onChange={(e) => setStr('notes')(e.target.value)}
          className="w-full p-4 rounded-2xl border border-line/70 bg-surface text-[14px] outline-none focus:border-brand/60 resize-none placeholder:text-ink-dim"
        />
      </div>

      <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-gradient-to-t from-canvas via-canvas to-canvas/0">
        <button
          onClick={() => onSave(data)}
          className="w-full pt-[15px] pb-3.5 rounded-2xl bg-ink text-canvas font-semibold text-[15px] flex items-center justify-center"
        >
          {saveLabel ?? t('form.saveDefault')}
        </button>
      </div>

      {pickerOpen && (
        <LocationPicker
          current={data.city}
          onClose={() => setPickerOpen(false)}
          onSelect={(loc) => {
            setStr('city')(loc.name)
            setPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-medium text-ink-dim mt-1 mb-2.5 ml-1">{children}</p>
}

