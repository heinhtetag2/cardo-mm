import { ContactForm } from '../components/ContactForm'
import { SubScreenHeader } from '../components/SubScreenHeader'
import { useToast } from '../components/Toast'
import { useT } from '../i18n'

export function ManualEntryScreen({ onBack, onDone }: { onBack: () => void; onDone?: () => void }) {
  const toast = useToast()
  const t = useT()
  const finish = onDone ?? onBack
  return (
    <ContactForm
      header={<SubScreenHeader title={t('manual.headerTitle')} onBack={onBack} />}
      initial={{ city: 'Yangon' }}
      saveLabel={t('manual.saveLabel')}
      onSave={() => {
        toast.show(t('manual.toast.saved'))
        setTimeout(finish, 500)
      }}
    />
  )
}
