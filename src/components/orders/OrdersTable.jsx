import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext'
import Badge from '../ui/Badge'
import { formatCurrency, formatDateTime, paymentVariant } from '../../utils/format'

const SORTABLE_COLUMNS = ['orderNo', 'dueDate', 'total', 'paymentStatus']

function SortHeader({ label, sortKey, sort, onSort, className = '' }) {
  const active = sort.key === sortKey
  return (
    <th className={`px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-slate-400 ${className}`}>
      {SORTABLE_COLUMNS.includes(sortKey) ? (
        <button
          type="button"
          onClick={() => onSort(sortKey)}
          className={`flex items-center gap-1 hover:text-slate-600 ${active ? 'text-slate-600' : ''}`}
        >
          {label}
          <ArrowUpDown size={12} />
        </button>
      ) : (
        label
      )}
    </th>
  )
}

function RowActions({ order, onView, onEdit, onDelete, t }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onView(order)}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        title={t('common.view')}
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        onClick={() => onEdit(order)}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        title={t('common.edit')}
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(order)}
        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
        title={t('common.delete')}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

function EmptyState({ loading, t }) {
  if (loading) return <p className="px-5 py-10 text-center text-sm text-slate-400">{t('common.loading')}</p>
  return <p className="px-5 py-10 text-center text-sm text-slate-400">{t('common.noResults')}</p>
}

export default function OrdersTable({ orders, sort, onSort, onView, onEdit, onDelete, loading }) {
  const { t } = useI18n()
  const showEmptyState = loading || orders.length === 0

  return (
    <>
      {/* Card list — small/medium screens */}
      <div className="space-y-3 lg:hidden">
        {showEmptyState ? (
          <div className="rounded-2xl border border-slate-100 bg-white">
            <EmptyState loading={loading} t={t} />
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-brand-blue">
                    {order.serialNumber && <span className="text-slate-400">#{order.serialNumber} · </span>}
                    {order.orderNo}
                  </p>
                  <p className="truncate font-semibold text-slate-700">{order.customerName}</p>
                  <p className="text-sm text-slate-400">{order.customerPhone}</p>
                </div>
                <RowActions order={order} onView={onView} onEdit={onEdit} onDelete={onDelete} t={t} />
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="service">{t(`orders.serviceTypes.${order.serviceType}`)}</Badge>
                <Badge variant={paymentVariant(order.paymentStatus)}>
                  {t(`orders.paymentStatuses.${order.paymentStatus}`)}
                </Badge>
                <span className="text-sm text-slate-500">{t(`orders.statuses.${order.status}`, order.status)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-sm">
                <div>
                  <p className="font-semibold text-red-500">{formatDateTime(order.dueDate)}</p>
                  {order.store && <p className="text-slate-400">{order.store}</p>}
                </div>
                <p className="font-semibold text-slate-700">{formatCurrency(order.total)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table — large screens */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white lg:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('orders.serialNumber')}
              </th>
              <SortHeader label={t('orders.orderNo')} sortKey="orderNo" sort={sort} onSort={onSort} />
              <SortHeader label={t('orders.customer')} sortKey="customerName" sort={sort} onSort={onSort} />
              <SortHeader label={t('orders.service')} sortKey="serviceType" sort={sort} onSort={onSort} />
              <SortHeader label={t('orders.status')} sortKey="status" sort={sort} onSort={onSort} />
              <SortHeader label={t('orders.payment')} sortKey="paymentStatus" sort={sort} onSort={onSort} />
              <SortHeader label={t('orders.dueDate')} sortKey="dueDate" sort={sort} onSort={onSort} />
              <SortHeader label={t('orders.total')} sortKey="total" sort={sort} onSort={onSort} />
              <SortHeader label={t('orders.store')} sortKey="store" sort={sort} onSort={onSort} />
              <th className="px-5 py-3.5 text-end text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('orders.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="px-5 py-10 text-center text-sm text-slate-400">
                  {t('common.loading')}
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={10} className="px-5 py-10 text-center text-sm text-slate-400">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
            {!loading &&
              orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4 align-top text-slate-500">{order.serialNumber}</td>
                  <td className="px-5 py-4 align-top">
                    <span className="font-semibold text-brand-blue">{order.orderNo}</span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold text-slate-700">{order.customerName}</p>
                    <p className="text-sm text-slate-400">{order.customerPhone}</p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Badge variant="service">{t(`orders.serviceTypes.${order.serviceType}`)}</Badge>
                  </td>
                  <td className="px-5 py-4 align-top text-slate-600">
                    {t(`orders.statuses.${order.status}`, order.status)}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Badge variant={paymentVariant(order.paymentStatus)}>
                      {t(`orders.paymentStatuses.${order.paymentStatus}`)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 align-top font-semibold text-red-500">
                    {formatDateTime(order.dueDate)}
                  </td>
                  <td className="px-5 py-4 align-top font-semibold text-slate-700">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-5 py-4 align-top text-slate-500">{order.store}</td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center justify-end">
                      <RowActions order={order} onView={onView} onEdit={onEdit} onDelete={onDelete} t={t} />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
