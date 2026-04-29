import { ContactForm } from '../components/ContactForm'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'

export function ManualEntryScreen({ onBack }: { onBack: () => void }) {
  const toast = useToast()
  return (
    <ContactForm
      header={<SubScreenHeader title="New contact" onBack={onBack} />}
      initial={{ city: 'Yangon' }}
      saveLabel="Save contact"
      onSave={() => {
        toast.show('Contact saved')
        setTimeout(onBack, 500)
      }}
    />
  )
}
