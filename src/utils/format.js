export function formatCurrency(amount) {
  const value = Number(amount) || 0
  return `£${value.toFixed(2)}`
}

/**
 * Accepts a Firestore Timestamp, an ISO string, a Date, or millis
 * and returns a "DD-MM-YYYY HH:mm" string, matching the reference design.
 */
export function formatDateTime(value) {
  if (!value) return '—'
  const date = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

export function toDateInputValue(value) {
  if (!value) return ''
  const date = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function toComparableTime(value) {
  if (!value) return 0
  const date = value?.toDate ? value.toDate() : new Date(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

export function paymentVariant(status) {
  if (status === 'paid') return 'paid'
  if (status === 'depositPaid') return 'depositPaid'
  return 'unpaid'
}
