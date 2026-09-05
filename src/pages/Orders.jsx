import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import OrderFilters from '../components/orders/OrderFilters'
import OrdersTable from '../components/orders/OrdersTable'
import OrderFormModal from '../components/orders/OrderFormModal'
import OrderViewModal from '../components/orders/OrderViewModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useI18n } from '../i18n/I18nContext'
import { useOrders } from '../hooks/useOrders'
import { useStores } from '../hooks/useStores'
import { useCustomers } from '../hooks/useCustomers'
import { toComparableTime } from '../utils/format'

const ACTION_BUTTONS = [
  { key: 'alteration', labelKey: 'orders.addAlteration', className: 'bg-brand-blue hover:bg-blue-700' },
  { key: 'repair', labelKey: 'orders.addRepair', className: 'bg-brand-orange hover:bg-orange-600' },
  { key: 'bespoke', labelKey: 'orders.addBespoke', className: 'bg-brand-purple hover:bg-purple-700' },
]

export default function Orders() {
  const { t } = useI18n()
  const { orders, loading, error, addOrder, updateOrder, deleteOrder } = useOrders()
  const { stores: storeDocs } = useStores()
  const { customers } = useCustomers()

  const [filters, setFilters] = useState({ search: '', service: 'all', payment: 'all', store: 'all' })
  const [sort, setSort] = useState({ key: 'dueDate', dir: 'asc' })

  const [formOpen, setFormOpen] = useState(false)
  const [formServiceType, setFormServiceType] = useState('bespoke')
  const [editingOrder, setEditingOrder] = useState(null)
  const [viewingOrder, setViewingOrder] = useState(null)
  const [deletingOrder, setDeletingOrder] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const storeNames = useMemo(() => {
    const fromOrders = orders.map((o) => o.store).filter(Boolean)
    const fromStores = storeDocs.map((s) => s.name).filter(Boolean)
    return Array.from(new Set([...fromStores, ...fromOrders])).sort()
  }, [orders, storeDocs])

  const filteredOrders = useMemo(() => {
    const term = filters.search.trim().toLowerCase()
    let list = orders.filter((o) => {
      const matchesSearch =
        !term ||
        o.orderNo?.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term)
      const matchesService = filters.service === 'all' || o.serviceType === filters.service
      const matchesPayment = filters.payment === 'all' || o.paymentStatus === filters.payment
      const matchesStore = filters.store === 'all' || o.store === filters.store
      return matchesSearch && matchesService && matchesPayment && matchesStore
    })

    list = [...list].sort((a, b) => {
      let cmp
      if (sort.key === 'dueDate') cmp = toComparableTime(a.dueDate) - toComparableTime(b.dueDate)
      else if (sort.key === 'total') cmp = (Number(a.total) || 0) - (Number(b.total) || 0)
      else cmp = String(a[sort.key] || '').localeCompare(String(b[sort.key] || ''))
      return sort.dir === 'asc' ? cmp : -cmp
    })

    return list
  }, [orders, filters, sort])

  const handleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  const openAddModal = (serviceType) => {
    setEditingOrder(null)
    setFormServiceType(serviceType)
    setFormOpen(true)
  }

  const openEditModal = (order) => {
    setEditingOrder(order)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data) => {
    if (editingOrder) {
      await updateOrder(editingOrder.id, data)
    } else {
      const prefix = data.serviceType === 'bespoke' ? 'BSP' : data.serviceType === 'alteration' ? 'ALT' : 'RPR'
      const orderNo = data.orderNo || `${prefix}-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, '0')}`
      await addOrder({ ...data, orderNo })
    }
  }

  const confirmDelete = async () => {
    if (!deletingOrder) return
    setDeleting(true)
    try {
      await deleteOrder(deletingOrder.id)
      setDeletingOrder(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t('orders.title')}
        actions={ACTION_BUTTONS.map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => openAddModal(btn.key)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${btn.className}`}
          >
            <Plus size={16} />
            {t(btn.labelKey)}
          </button>
        ))}
      />

      <OrderFilters filters={filters} setFilters={setFilters} stores={storeNames} />

      {error && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error} — check your Firebase configuration in <code>.env</code>.
        </div>
      )}

      <OrdersTable
        orders={filteredOrders}
        sort={sort}
        onSort={handleSort}
        onView={setViewingOrder}
        onEdit={openEditModal}
        onDelete={setDeletingOrder}
        loading={loading}
      />

      <OrderFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialOrder={editingOrder}
        defaultServiceType={formServiceType}
        stores={storeNames}
        customers={customers}
      />

      <OrderViewModal open={!!viewingOrder} onClose={() => setViewingOrder(null)} order={viewingOrder} />

      <ConfirmDialog
        open={!!deletingOrder}
        onCancel={() => setDeletingOrder(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
