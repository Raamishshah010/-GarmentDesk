import Modal from './Modal'
import { useI18n } from '../../i18n/I18nContext'

export default function ConfirmDialog({ open, onCancel, onConfirm, title, body, busy }) {
  const { t } = useI18n()
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title || t('common.confirmDeleteTitle')}
      maxWidth="max-w-sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {t('common.delete')}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-500">{body || t('common.confirmDeleteBody')}</p>
    </Modal>
  )
}
