import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import { useI18n } from '../../i18n/I18nContext'
import { formatCurrency, formatDateTime, paymentVariant } from '../../utils/format'

export default function StoreOrdersModal({ open, onClose, store, orders }) {
  const { t } = useI18n()
  if (!store) return null

  const storeOrders = orders.filter((o) => o.storeId === store.id)
  const totalRevenue = storeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

  return (
    <Modal open={open} onClose={onClose} title={store.name} maxWidth="max-w-lg">
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm text-slate-400">{t('stores.location')}</p>
          <p className="font-medium text-slate-700">{store.location || '—'}</p>
        </div>
        <div className="text-end">
          <p className="text-sm text-slate-400">{t('dashboard.totalRevenue')}</p>
          <p className="font-semibold text-slate-700">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <p className="mb-2 text-sm font-semibold text-slate-600">
        {storeOrders.length} {t('customers.ordersCount').toLowerCase()}
      </p>

      {storeOrders.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{t('common.noResults')}</p>
      ) : (
        <div className="max-h-[50vh] space-y-2 overflow-y-auto">
          {storeOrders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-100 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="font-semibold text-brand-blue">{order.orderNo}</span>
                <span className="text-sm font-semibold text-slate-700">{formatCurrency(order.total)}</span>
              </div>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-500">
                <span className="truncate">{order.customerName}</span>
                <span className="font-semibold text-red-500">{formatDateTime(order.dueDate)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="service">{t(`orders.serviceTypes.${order.serviceType}`)}</Badge>
                <Badge variant={paymentVariant(order.paymentStatus)}>
                  {t(`orders.paymentStatuses.${order.paymentStatus}`)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
