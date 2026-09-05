import { useMemo } from 'react'
import { ClipboardList, Wallet, AlertCircle, CalendarClock } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Badge from '../components/ui/Badge'
import { useI18n } from '../i18n/I18nContext'
import { useOrders } from '../hooks/useOrders'
import { formatCurrency, formatDateTime, toComparableTime, paymentVariant } from '../utils/format'

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useI18n()
  const { orders, loading } = useOrders()

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    const unpaid = orders.filter((o) => o.paymentStatus === 'unpaid').length
    // eslint-disable-next-line react-hooks/purity -- intentional: "due this week" is relative to wall-clock time
    const now = Date.now()
    const weekAhead = now + 7 * 24 * 60 * 60 * 1000
    const dueThisWeek = orders.filter((o) => {
      const t = toComparableTime(o.dueDate)
      return t >= now && t <= weekAhead
    }).length
    return { totalRevenue, unpaid, dueThisWeek, total: orders.length }
  }, [orders])

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders])

  return (
    <div>
      <PageHeader title={t('dashboard.title')} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label={t('dashboard.totalOrders')}
          value={stats.total}
          tint="bg-blue-50 text-brand-blue"
        />
        <StatCard
          icon={AlertCircle}
          label={t('dashboard.unpaidOrders')}
          value={stats.unpaid}
          tint="bg-pink-50 text-pink-500"
        />
        <StatCard
          icon={Wallet}
          label={t('dashboard.totalRevenue')}
          value={formatCurrency(stats.totalRevenue)}
          tint="bg-emerald-50 text-emerald-500"
        />
        <StatCard
          icon={CalendarClock}
          label={t('dashboard.dueThisWeek')}
          value={stats.dueThisWeek}
          tint="bg-amber-50 text-amber-500"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-700">{t('dashboard.recentOrders')}</h2>
        {loading && <p className="text-sm text-slate-400">{t('common.loading')}</p>}
        {!loading && recentOrders.length === 0 && (
          <p className="text-sm text-slate-400">{t('common.noResults')}</p>
        )}
        <div className="divide-y divide-slate-50">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-brand-blue">{order.orderNo}</p>
                <p className="text-sm text-slate-500">{order.customerName}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-red-500">{formatDateTime(order.dueDate)}</span>
                <Badge variant={paymentVariant(order.paymentStatus)}>
                  {t(`orders.paymentStatuses.${order.paymentStatus}`)}
                </Badge>
                <span className="font-semibold text-slate-700">{formatCurrency(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
