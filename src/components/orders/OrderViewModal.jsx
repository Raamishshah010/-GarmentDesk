import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import { useI18n } from '../../i18n/I18nContext'
import { formatCurrency, formatDateTime, paymentVariant } from '../../utils/format'
import { GARMENT_FIELDS, hasAnyGarmentField } from '../../utils/garmentFields'

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-700">{children}</span>
    </div>
  )
}

export default function OrderViewModal({ open, onClose, order }) {
  const { t } = useI18n()
  if (!order) return null

  const measurements = GARMENT_FIELDS.filter((f) => f.group === 'measurements' && order[f.key])
  const style = GARMENT_FIELDS.filter((f) => f.group === 'style')

  return (
    <Modal open={open} onClose={onClose} title={order.orderNo} maxWidth="max-w-md">
      <Row label={t('orders.customer')}>{order.customerName}</Row>
      <Row label={t('common.phone')}>{order.customerPhone}</Row>
      <Row label={t('orders.service')}>
        <Badge variant="service">{t(`orders.serviceTypes.${order.serviceType}`)}</Badge>
      </Row>
      <Row label={t('orders.status')}>{t(`orders.statuses.${order.status}`, order.status)}</Row>
      <Row label={t('orders.payment')}>
        <Badge variant={paymentVariant(order.paymentStatus)}>
          {t(`orders.paymentStatuses.${order.paymentStatus}`)}
        </Badge>
      </Row>
      <Row label={t('orders.dueDate')}>{formatDateTime(order.dueDate)}</Row>
      <Row label={t('orders.total')}>{formatCurrency(order.total)}</Row>
      <Row label={t('orders.store')}>{order.store}</Row>

      {hasAnyGarmentField(order) && (
        <div className="pt-3">
          {measurements.length > 0 && (
            <>
              <p className="mb-1 text-sm font-semibold text-slate-600">
                {t('garmentFields.measurementsHeading')}
              </p>
              {measurements.map((f) => (
                <Row key={f.key} label={t(f.labelKey)}>
                  {order[f.key]}
                </Row>
              ))}
            </>
          )}
          {style.length > 0 && (
            <>
              <p className="mb-1 mt-3 text-sm font-semibold text-slate-600">
                {t('garmentFields.styleHeading')}
              </p>
              {style.map((f) => (
                <Row key={f.key} label={t(f.labelKey)}>
                  {order[f.key] === 'yes' ? t('common.yes') : t('common.no')}
                </Row>
              ))}
            </>
          )}
        </div>
      )}

      {order.notes && (
        <div className="pt-3">
          <p className="mb-1 text-sm text-slate-400">{t('orders.notes')}</p>
          <p className="text-sm text-slate-600">{order.notes}</p>
        </div>
      )}
    </Modal>
  )
}
