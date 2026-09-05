import LanguageSwitcher from './LanguageSwitcher'
import NotificationBell from './NotificationBell'

export default function PageHeader({ title, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-extrabold text-slate-800">{title}</h1>
      <div className="flex flex-wrap items-center gap-3">
        {actions}
        <LanguageSwitcher />
        <NotificationBell count={2} />
      </div>
    </div>
  )
}
