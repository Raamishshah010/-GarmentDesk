import { useI18n } from '../../i18n/I18nContext'
import { formatCurrency, formatDateTime } from '../../utils/format'

export default function PrintableOrdersTable({ orders }) {
  const { t } = useI18n()

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-black">
          {t('appName')} — {t('orders.title')}
        </h1>
        <p className="text-sm text-black">{new Date().toLocaleDateString()}</p>
      </div>
      <table className="w-full border-collapse text-xs text-black">
        <thead>
          <tr>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.serialNumber')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.orderNo')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.customer')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('common.phone')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.service')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.status')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.payment')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.dueDate')}</th>
            <th className="border border-slate-400 px-2 py-1 text-end">{t('orders.total')}</th>
            <th className="border border-slate-400 px-2 py-1 text-start">{t('orders.store')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={10} className="border border-slate-400 px-2 py-4 text-center">
                {t('common.noResults')}
              </td>
            </tr>
          )}
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td className="border border-slate-400 px-2 py-1">{order.serialNumber || index + 1}</td>
              <td className="border border-slate-400 px-2 py-1">{order.orderNo}</td>
              <td className="border border-slate-400 px-2 py-1">{order.customerName}</td>
              <td className="border border-slate-400 px-2 py-1">{order.customerPhone}</td>
              <td className="border border-slate-400 px-2 py-1">
                {t(`orders.serviceTypes.${order.serviceType}`)}
              </td>
              <td className="border border-slate-400 px-2 py-1">
                {t(`orders.statuses.${order.status}`, order.status)}
              </td>
              <td className="border border-slate-400 px-2 py-1">
                {t(`orders.paymentStatuses.${order.paymentStatus}`)}
              </td>
              <td className="border border-slate-400 px-2 py-1">{formatDateTime(order.dueDate)}</td>
              <td className="border border-slate-400 px-2 py-1 text-end">{formatCurrency(order.total)}</td>
              <td className="border border-slate-400 px-2 py-1">{order.store}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
