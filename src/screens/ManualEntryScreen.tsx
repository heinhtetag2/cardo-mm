import { ContactForm } from '../components/ContactForm'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'

export function ManualEntryScreen({ onBack, onDone }: { onBack: () => void; onDone?: () => void }) {
  const toast = useToast()
  const finish = onDone ?? onBack
  return (
    <ContactForm
      header={<SubScreenHeader title="New contact" onBack={onBack} />}
      initial={{ city: 'Yangon' }}
      saveLabel="Save contact"
      onSave={() => {
        toast.show('Contact saved')
        setTimeout(finish, 500)
      }}
    />
  )
}
