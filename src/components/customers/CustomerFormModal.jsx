import { useState } from 'react'
import Modal from '../ui/Modal'
import Field, { inputClass } from '../ui/Field'
import GarmentFieldsSection from '../garments/GarmentFieldsSection'
import { useI18n } from '../../i18n/I18nContext'
import { emptyGarmentFields, pickGarmentFields } from '../../utils/garmentFields'

const emptyForm = { serialNumber: '', name: '', phone: '', notes: '', ...emptyGarmentFields }

export default function CustomerFormModal({ open, onClose, onSubmit, initialCustomer, nextSerialNumber = 1 }) {
  const { t } = useI18n()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  // Reset/populate the form whenever the modal transitions from closed to
  // open. Done during render (not an effect) per React's guidance on
  // adjusting state when a prop changes.
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      if (initialCustomer) {
        setForm({
          serialNumber: initialCustomer.serialNumber || '',
          name: initialCustomer.name || '',
          phone: initialCustomer.phone || '',
          notes: initialCustomer.notes || '',
          ...pickGarmentFields(initialCustomer),
        })
      } else {
        setForm({ ...emptyForm, serialNumber: String(nextSerialNumber) })
      }
      setErrors({})
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setGarmentField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = t('common.required')
    if (!form.phone.trim()) next.phone = t('common.required')
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    try {
      await onSubmit(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialCustomer ? t('customers.editCustomer') : t('customers.addCustomer')}
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            form="customer-form"
            disabled={saving}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label={t('orders.serialNumber')}>
            <input
              className={`${inputClass} sm:max-w-[160px]`}
              value={form.serialNumber}
              onChange={set('serialNumber')}
            />
          </Field>
        </div>

        <Field label={t('common.name')} required error={errors.name}>
          <input className={inputClass} value={form.name} onChange={set('name')} />
        </Field>
        <Field label={t('common.phone')} required error={errors.phone}>
          <input className={inputClass} value={form.phone} onChange={set('phone')} />
        </Field>

        <p className="sm:col-span-2 -mt-1 mb-2 text-xs text-slate-400">{t('customers.garmentDefaultsHint')}</p>
        <GarmentFieldsSection values={form} onChange={setGarmentField} />

        <div className="sm:col-span-2 mt-2 border-t border-slate-100 pt-4">
          <Field label={t('orders.notes')}>
            <textarea className={inputClass} rows={2} value={form.notes} onChange={set('notes')} />
          </Field>
        </div>
      </form>
    </Modal>
  )
}
