import { X } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext'

export default function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
  const { t } = useI18n()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-6 sm:py-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-slate-100 px-4 py-3.5 sm:px-6 sm:py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
