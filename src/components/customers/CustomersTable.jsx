import { Pencil, Trash2 } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext'
import { formatCurrency } from '../../utils/format'

function RowActions({ customer, onEdit, onDelete, t }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(customer)}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        title={t('common.edit')}
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(customer)}
        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
        title={t('common.delete')}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export default function CustomersTable({ customers, loading, onEdit, onDelete }) {
  const { t } = useI18n()
  const showEmptyState = loading || customers.length === 0

  return (
    <>
      {/* Card list — small/medium screens */}
      <div className="space-y-3 lg:hidden">
        {showEmptyState ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-5 py-10 text-center text-sm text-slate-400">
            {loading ? t('common.loading') : t('common.noResults')}
          </div>
        ) : (
          customers.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-700">{c.name}</p>
                <p className="text-sm text-slate-400">{c.phone}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {c.ordersCount} {t('customers.ordersCount').toLowerCase()} · {formatCurrency(c.totalSpent)}
                </p>
              </div>
              <RowActions customer={c} onEdit={onEdit} onDelete={onDelete} t={t} />
            </div>
          ))
        )}
      </div>

      {/* Table — large screens */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 bg-white lg:block">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('common.name')}
              </th>
              <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('common.phone')}
              </th>
              <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('customers.ordersCount')}
              </th>
              <th className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('customers.totalSpent')}
              </th>
              <th className="px-5 py-3.5 text-end text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                  {t('common.loading')}
                </td>
              </tr>
            )}
            {!loading && customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
            {!loading &&
              customers.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-semibold text-slate-700">{c.name}</td>
                  <td className="px-5 py-4 text-slate-500">{c.phone}</td>
                  <td className="px-5 py-4 text-slate-500">{c.ordersCount}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <RowActions customer={c} onEdit={onEdit} onDelete={onDelete} t={t} />
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
