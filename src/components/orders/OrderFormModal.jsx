import { useState } from 'react'
import { Download } from 'lucide-react'
import Modal from '../ui/Modal'
import Field, { inputClass } from '../ui/Field'
import GarmentFieldsSection from '../garments/GarmentFieldsSection'
import { useI18n } from '../../i18n/I18nContext'
import { toDateInputValue } from '../../utils/format'
import { emptyGarmentFields, pickGarmentFields } from '../../utils/garmentFields'

const STATUS_OPTIONS = [
  'measurement',
  'cutting',
  'fitting1',
  'finalFitting',
  'received',
  'inProgress',
  'readyForPickup',
  'completed',
]

const emptyForm = {
  orderNo: '',
  customerName: '',
  customerPhone: '',
  serviceType: 'bespoke',
  status: 'measurement',
  paymentStatus: 'unpaid',
  dueDate: '',
  total: '',
  store: '',
  notes: '',
  ...emptyGarmentFields,
}

export default function OrderFormModal({
  open,
  onClose,
  onSubmit,
  initialOrder,
  defaultServiceType,
  stores,
  customers = [],
}) {
  const { t } = useI18n()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const [loadStatus, setLoadStatus] = useState(null) // 'found' | 'notFound' | null

  // Reset the form whenever the modal transitions from closed to open.
  // Done during render (not an effect) per React's guidance on adjusting
  // state when a prop changes.
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      if (initialOrder) {
        setForm({
          ...emptyForm,
          ...initialOrder,
          dueDate: toDateInputValue(initialOrder.dueDate),
          total: initialOrder.total ?? '',
        })
      } else {
        setForm({ ...emptyForm, serviceType: defaultServiceType || 'bespoke' })
      }
      setErrors({})
      setLoadStatus(null)
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setGarmentField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleLoadFromCustomer = () => {
    const phone = form.customerPhone.trim()
    const name = form.customerName.trim().toLowerCase()
    const match = customers.find(
      (c) => (phone && c.phone === phone) || (!phone && name && c.name?.toLowerCase() === name)
    )
    if (match) {
      setForm((f) => ({
        ...f,
        customerName: f.customerName || match.name || '',
        customerPhone: f.customerPhone || match.phone || '',
        ...pickGarmentFields(match),
      }))
      setLoadStatus('found')
    } else {
      setLoadStatus('notFound')
    }
  }

  const validate = () => {
    const next = {}
    if (!form.customerName.trim()) next.customerName = t('common.required')
    if (!form.customerPhone.trim()) next.customerPhone = t('common.required')
    if (!form.dueDate) next.dueDate = t('common.required')
    if (!form.total || Number(form.total) <= 0) next.total = t('common.required')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSubmit({
        ...form,
        total: Number(form.total),
        dueDate: new Date(form.dueDate).toISOString(),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialOrder ? t('orders.editOrder') : t('orders.newOrder')}
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
            form="order-form"
            disabled={saving}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="order-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label={t('orders.customerName')} required error={errors.customerName}>
          <input className={inputClass} value={form.customerName} onChange={set('customerName')} />
        </Field>
        <Field label={t('orders.customerPhone')} required error={errors.customerPhone}>
          <input className={inputClass} value={form.customerPhone} onChange={set('customerPhone')} />
        </Field>

        <div className="sm:col-span-2 -mt-2 mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadFromCustomer}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Download size={14} />
            {t('garmentFields.loadFromCustomer')}
          </button>
          {loadStatus === 'found' && (
            <span className="text-xs text-emerald-600">{t('garmentFields.loadedFromCustomer')}</span>
          )}
          {loadStatus === 'notFound' && (
            <span className="text-xs text-slate-400">{t('garmentFields.noSavedMeasurements')}</span>
          )}
        </div>

        <Field label={t('orders.service')}>
          <select className={inputClass} value={form.serviceType} onChange={set('serviceType')}>
            <option value="bespoke">{t('orders.serviceTypes.bespoke')}</option>
            <option value="alteration">{t('orders.serviceTypes.alteration')}</option>
            <option value="repair">{t('orders.serviceTypes.repair')}</option>
          </select>
        </Field>
        <Field label={t('orders.status')}>
          <select className={inputClass} value={form.status} onChange={set('status')}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {t(`orders.statuses.${s}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('orders.payment')}>
          <select className={inputClass} value={form.paymentStatus} onChange={set('paymentStatus')}>
            <option value="unpaid">{t('orders.paymentStatuses.unpaid')}</option>
            <option value="depositPaid">{t('orders.paymentStatuses.depositPaid')}</option>
            <option value="paid">{t('orders.paymentStatuses.paid')}</option>
          </select>
        </Field>
        <Field label={t('orders.dueDate')} required error={errors.dueDate}>
          <input type="date" className={inputClass} value={form.dueDate} onChange={set('dueDate')} />
        </Field>

        <Field label={t('orders.amount')} required error={errors.total}>
          <input type="number" min="0" step="0.01" className={inputClass} value={form.total} onChange={set('total')} />
        </Field>
        <Field label={t('orders.store')}>
          <input className={inputClass} list="store-options" value={form.store} onChange={set('store')} />
          <datalist id="store-options">
            {stores.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </Field>

        <GarmentFieldsSection values={form} onChange={setGarmentField} />

        <div className="sm:col-span-2">
          <Field label={t('orders.notes')}>
            <textarea className={inputClass} rows={3} value={form.notes} onChange={set('notes')} />
          </Field>
        </div>
      </form>
    </Modal>
  )
}
