import { ContactForm } from '../components/ContactForm'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'
import type { Contact } from '../data'

export function EditContactScreen({ contact, onBack }: { contact: Contact; onBack: () => void }) {
  const toast = useToast()
  return (
    <ContactForm
      header={<SubScreenHeader title={`Edit ${contact.name.split(' ')[0]}`} onBack={onBack} />}
      saveLabel="Save changes"
      initial={{
        name: contact.name,
        role: contact.role,
        company: contact.company,
        phone: contact.phone,
        email: contact.email,
        website: contact.website || '',
        city: contact.city,
        tags: contact.tags || [],
        notes: contact.bio || '',
      }}
      onSave={() => {
        toast.show('Contact updated')
        setTimeout(onBack, 500)
      }}
    />
  )
}
