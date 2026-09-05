import LanguageSwitcher from './LanguageSwitcher'
import NotificationBell from './NotificationBell'

export default function PageHeader({ title, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6 sm:gap-4">
      <h1 className="text-xl font-extrabold text-slate-800 sm:text-2xl">{title}</h1>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {actions}
        <LanguageSwitcher />
        <NotificationBell count={2} />
      </div>
    </div>
  )
}
