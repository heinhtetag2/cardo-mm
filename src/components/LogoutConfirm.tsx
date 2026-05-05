import { LogOut } from 'lucide-react'
import { useT } from '../i18n'

export function LogoutConfirm({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void
  onClose: () => void
}) {
  const t = useT()
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
      <button onClick={onClose} aria-label="Close" className="absolute inset-0 bg-canvas/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-[320px] rounded-[24px] border border-line/70 bg-surface p-5 animate-pop-in">
        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 grid place-items-center mb-4 mx-auto">
          <LogOut size={20} className="text-rose-400" strokeWidth={1.8} />
        </div>
        <h2 className="text-[16px] font-semibold text-center">{t('logout.title')}</h2>
        <p className="text-[12.5px] text-ink-dim text-center mt-1.5 leading-relaxed">
          {t('logout.body')}
        </p>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-line/70 bg-surface-elevated text-[13.5px] font-semibold"
          >
            {t('logout.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-rose-500 text-white text-[13.5px] font-semibold"
          >
            {t('logout.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
