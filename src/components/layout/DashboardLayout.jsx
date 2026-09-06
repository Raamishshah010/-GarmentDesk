import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import { useI18n } from '../../i18n/I18nContext'

export default function DashboardLayout() {
  const { t } = useI18n()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  // Close the drawer whenever the route changes (e.g. after tapping a nav
  // link). Done during render (not an effect) per React's guidance on
  // adjusting state when a prop/value changes.
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setMobileNavOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 print:block print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto print:overflow-visible">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 lg:hidden print:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="truncate text-base font-extrabold tracking-tight text-slate-800">
            {t('appName')}
          </span>
        </div>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 print:p-0">
          <Outlet />
        </main>
        <footer className="border-t border-slate-100 bg-white px-4 py-4 text-center text-sm text-slate-400 sm:px-8 print:hidden">
          © {new Date().getFullYear()} {t('appName')}. {t('footer')}
        </footer>
      </div>
    </div>
  )
}
