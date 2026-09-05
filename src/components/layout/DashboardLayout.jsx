import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useI18n } from '../../i18n/I18nContext'

export default function DashboardLayout() {
  const { t } = useI18n()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <main className="flex-1 px-6 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-slate-100 bg-white px-8 py-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} {t('appName')}. {t('footer')}
        </footer>
      </div>
    </div>
  )
}
