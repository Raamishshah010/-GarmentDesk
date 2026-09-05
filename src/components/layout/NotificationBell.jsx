import { Bell } from 'lucide-react'

export default function NotificationBell({ count = 0 }) {
  return (
    <button
      type="button"
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      aria-label="Notifications"
    >
      <Bell size={18} />
      {count > 0 && (
        <span className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  )
}
