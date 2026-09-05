import { Search } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext'

export default function OrderFilters({ filters, setFilters, stores }) {
  const { t } = useI18n()

  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))

  const hasActiveFilters =
    filters.search || filters.service !== 'all' || filters.payment !== 'all' || filters.store !== 'all'

  const clearFilters = () =>
    setFilters({ search: '', service: 'all', payment: 'all', store: 'all' })

  const selectClass =
    'w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-brand-blue'

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:min-w-[220px] sm:flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={filters.search}
          onChange={update('search')}
          placeholder={t('orders.searchPlaceholder')}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 ps-9 pe-3 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <select value={filters.service} onChange={update('service')} className={selectClass}>
          <option value="all">{t('common.allServices')}</option>
          <option value="bespoke">{t('orders.serviceTypes.bespoke')}</option>
          <option value="alteration">{t('orders.serviceTypes.alteration')}</option>
          <option value="repair">{t('orders.serviceTypes.repair')}</option>
        </select>

        <select value={filters.payment} onChange={update('payment')} className={selectClass}>
          <option value="all">{t('common.allPayments')}</option>
          <option value="unpaid">{t('orders.paymentStatuses.unpaid')}</option>
          <option value="depositPaid">{t('orders.paymentStatuses.depositPaid')}</option>
          <option value="paid">{t('orders.paymentStatuses.paid')}</option>
        </select>

        <select value={filters.store} onChange={update('store')} className={selectClass}>
          <option value="all">{t('common.allStores')}</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-start text-sm font-medium text-brand-blue hover:underline"
          >
            {t('common.clearFilters')}
          </button>
        )}
      </div>
    </div>
  )
}
