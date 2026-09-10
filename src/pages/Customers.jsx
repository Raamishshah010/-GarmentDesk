import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import CustomerFormModal from '../components/customers/CustomerFormModal'
import CustomersTable from '../components/customers/CustomersTable'
import { useI18n } from '../i18n/I18nContext'
import { useCustomers } from '../hooks/useCustomers'
import { useOrders } from '../hooks/useOrders'

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
        <div className="relative w-full sm:max-w-sm">
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

      <CustomersTable customers={rows} loading={loading} onEdit={openEditModal} onDelete={setDeletingCustomer} />

      <CustomerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialCustomer={editingCustomer}
        nextSerialNumber={customers.length + 1}
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
