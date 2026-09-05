import { useState } from 'react'
import { Download, Scissors, Shirt, Wrench } from 'lucide-react'
import Modal from '../ui/Modal'
import Field, { inputClass } from '../ui/Field'
import GarmentFieldsSection from '../garments/GarmentFieldsSection'
import { useI18n } from '../../i18n/I18nContext'
import { toDateInputValue } from '../../utils/format'
import { emptyGarmentFields, pickGarmentFields } from '../../utils/garmentFields'

const STATUS_OPTIONS_BY_SERVICE = {
  bespoke: ['measurement', 'cutting', 'fitting1', 'finalFitting', 'completed'],
  alteration: ['received', 'inProgress', 'readyForPickup', 'completed'],
  repair: ['received', 'inProgress', 'readyForPickup', 'completed'],
}

const SERVICE_TYPES = [
  { key: 'bespoke', icon: Shirt, activeClass: 'bg-brand-purple text-white border-brand-purple' },
  { key: 'alteration', icon: Scissors, activeClass: 'bg-brand-blue text-white border-brand-blue' },
  { key: 'repair', icon: Wrench, activeClass: 'bg-brand-orange text-white border-brand-orange' },
]

const emptyForm = {
  orderNo: '',
  customerName: '',
  customerPhone: '',
  serviceType: 'bespoke',
  status: STATUS_OPTIONS_BY_SERVICE.bespoke[0],
  paymentStatus: 'unpaid',
  dueDate: '',
  total: '',
  storeId: '',
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
  stores = [],
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
        // Older orders may only have a free-text store name saved (from
        // before stores were linked). Try to resolve it to a real store id
        // so the dropdown pre-selects correctly; otherwise leave it blank.
        const resolvedStoreId =
          initialOrder.storeId || stores.find((s) => s.name === initialOrder.store)?.id || ''
        setForm({
          ...emptyForm,
          ...initialOrder,
          storeId: resolvedStoreId,
          dueDate: toDateInputValue(initialOrder.dueDate),
          total: initialOrder.total ?? '',
        })
      } else {
        const serviceType = defaultServiceType || 'bespoke'
        setForm({ ...emptyForm, serviceType, status: STATUS_OPTIONS_BY_SERVICE[serviceType][0] })
      }
      setErrors({})
      setLoadStatus(null)
    }
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setGarmentField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const statusOptions = STATUS_OPTIONS_BY_SERVICE[form.serviceType] || STATUS_OPTIONS_BY_SERVICE.bespoke

  const handleServiceTypeChange = (serviceType) => {
    setForm((f) => {
      const options = STATUS_OPTIONS_BY_SERVICE[serviceType] || STATUS_OPTIONS_BY_SERVICE.bespoke
      return {
        ...f,
        serviceType,
        status: options.includes(f.status) ? f.status : options[0],
      }
    })
  }

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
    if (stores.length > 0 && !form.storeId) next.storeId = t('common.required')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const selectedStore = stores.find((s) => s.id === form.storeId)
    setSaving(true)
    try {
      await onSubmit({
        ...form,
        total: Number(form.total),
        dueDate: new Date(form.dueDate).toISOString(),
        storeId: selectedStore?.id || '',
        store: selectedStore?.name || form.store || '',
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
        {/* Service type: one segmented control instead of three separate buttons */}
        <div className="sm:col-span-2 mb-4">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{t('orders.service')}</span>
          <div className="flex gap-2">
            {SERVICE_TYPES.map(({ key, icon: Icon, activeClass }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleServiceTypeChange(key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  form.serviceType === key
                    ? activeClass
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} />
                {t(`orders.serviceTypes.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <p className="sm:col-span-2 -mb-2 text-sm font-semibold text-slate-600">
          {t('orders.customerSection')}
        </p>
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

        <p className="sm:col-span-2 -mb-2 text-sm font-semibold text-slate-600">
          {t('orders.detailsSection')}
        </p>

        <Field label={t('orders.status')}>
          <select className={inputClass} value={form.status} onChange={set('status')}>
            {statusOptions.map((s) => (
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
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 1500"
            className={inputClass}
            value={form.total}
            onChange={set('total')}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label={t('orders.store')} required={stores.length > 0} error={errors.storeId}>
            {stores.length > 0 ? (
              <select className={inputClass} value={form.storeId} onChange={set('storeId')}>
                <option value="">{t('orders.selectStore')}</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400">
                {t('orders.noStoresAvailable')}
              </p>
            )}
          </Field>
        </div>

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
