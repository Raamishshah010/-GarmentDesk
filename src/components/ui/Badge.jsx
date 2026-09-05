const VARIANTS = {
  service: 'bg-[var(--color-pill-service-bg)] text-[var(--color-pill-service-text)]',
  unpaid: 'bg-[var(--color-pill-unpaid-bg)] text-[var(--color-pill-unpaid-text)]',
  depositPaid: 'bg-[var(--color-pill-deposit-bg)] text-[var(--color-pill-deposit-text)]',
  paid: 'bg-[var(--color-pill-paid-bg)] text-[var(--color-pill-paid-text)]',
  neutral: 'bg-slate-100 text-slate-600',
}

export default function Badge({ variant = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${VARIANTS[variant] || VARIANTS.neutral}`}
    >
      {children}
    </span>
  )
}
