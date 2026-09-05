import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import CustomerFormModal from '../components/customers/CustomerFormModal'
import { useI18n } from '../i18n/I18nContext'
import { useCustomers } from '../hooks/useCustomers'
import { useOrders } from '../hooks/useOrders'
import { formatCurrency } from '../utils/format'

export default function Customers() {
  const { t } = useI18n()
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const { orders } = useOrders()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [deletingCustomer, setDeletingCustomer] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return customers
      .filter((c) => !term || c.name?.toLowerCase().includes(term) || c.phone?.includes(term))
      .map((c) => {
        const customerOrders = orders.filter(
          (o) => o.customerPhone === c.phone || o.customerName === c.name
        )
        const totalSpent = customerOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
        return { ...c, ordersCount: customerOrders.length, totalSpent }
      })
  }, [customers, orders, search])

  const openAddModal = () => {
    setEditingCustomer(null)
    setFormOpen(true)
  }

  const openEditModal = (customer) => {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, data)
    } else {
      await addCustomer(data)
    }
  }

  const confirmDelete = async () => {
    if (!deletingCustomer) return
    setDeleting(true)
    try {
      await deleteCustomer(deletingCustomer.id)
      setDeletingCustomer(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t('customers.title')}
        actions={
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            {t('customers.addCustomer')}
          </button>
        }
      />

      <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-4">
        <div className="relative max-w-sm">
          <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('customers.searchPlaceholder')}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 ps-9 pe-3 text-sm text-slate-700 outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
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
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-semibold text-slate-700">{c.name}</td>
                  <td className="px-5 py-4 text-slate-500">{c.phone}</td>
                  <td className="px-5 py-4 text-slate-500">{c.ordersCount}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        title={t('common.edit')}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCustomer(c)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                        title={t('common.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <CustomerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialCustomer={editingCustomer}
      />
      <ConfirmDialog
        open={!!deletingCustomer}
        onCancel={() => setDeletingCustomer(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
