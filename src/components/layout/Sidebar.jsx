import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Store,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  UserCircle,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { useAuth } from '../../context/AuthContext'

const MAIN_ITEMS = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', key: 'orders', icon: ClipboardList },
  { to: '/customers', key: 'customers', icon: Users },
  { to: '/stores', key: 'stores', icon: Store },
  // { to: '/team', key: 'team', icon: UsersRound },
  // { to: '/calendar', key: 'calendar', icon: Calendar },
  // { to: '/commissions', key: 'commissions', icon: Percent },
  // { to: '/reports', key: 'reports', icon: BarChart2 },
  // { to: '/support', key: 'support', icon: MessageCircle },
]

const ADMIN_ITEMS = [
  // { to: '/garments', key: 'garments', icon: Shirt },
  // { to: '/alterations', key: 'alterations', icon: Scissors },
  // { to: '/coupons', key: 'coupons', icon: Tag },
  // { to: '/permissions', key: 'permissions', icon: Lock },
  // { to: '/billing', key: 'billing', icon: CreditCard },
]

// Labels only hide on desktop when explicitly collapsed (`lg:hidden`) — on
// mobile the drawer is always shown at full width, regardless of the
// desktop collapsed state, since it's a temporary overlay rather than a
// permanently docked rail.
function NavItem({ item, collapsed, t, onNavigate }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-50 text-brand-blue'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`
      }
      title={collapsed ? t(`nav.${item.key}`) : undefined}
    >
      <Icon size={19} strokeWidth={2} className="shrink-0" />
      <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{t(`nav.${item.key}`)}</span>
    </NavLink>
  )
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { t, isRtl } = useI18n()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const CollapseIcon = isRtl ? ChevronRight : ChevronLeft
  const ExpandIcon = isRtl ? ChevronLeft : ChevronRight
  const ToggleIcon = collapsed ? ExpandIcon : CollapseIcon

  const initial = (user?.email || 'T').charAt(0).toUpperCase()

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 flex h-screen w-72 flex-col border-e border-slate-100 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:transition-[width] ${
          mobileOpen ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue via-brand-purple to-brand-orange text-sm font-extrabold text-white">
              G
            </div>
            <span
              className={`truncate text-lg font-extrabold tracking-tight text-slate-800 ${
                collapsed ? 'lg:hidden' : ''
              }`}
            >
              {t('appName')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:block"
            aria-label="Toggle sidebar"
          >
            <ToggleIcon size={18} />
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {MAIN_ITEMS.map((item) => (
            <NavItem key={item.key} item={item} collapsed={collapsed} t={t} onNavigate={onCloseMobile} />
          ))}

          {ADMIN_ITEMS.length > 0 && (
            <div className="pt-4">
              <p
                className={`px-3 pb-2 text-xs font-semibold tracking-wider text-slate-400 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {t('nav.admin').toUpperCase()}
              </p>
              <div className="space-y-1">
                {ADMIN_ITEMS.map((item) => (
                  <NavItem key={item.key} item={item} collapsed={collapsed} t={t} onNavigate={onCloseMobile} />
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
              {initial}
            </div>
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-sm font-semibold text-slate-700">
                {user?.displayName || 'TailorShop'}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email || 'admin@tailorsaas.com'}
              </p>
            </div>
          </div>
          <div className={`flex justify-between px-1 ${collapsed ? 'lg:flex-col lg:items-center lg:gap-2' : ''}`}>
            <NavLink
              to="/settings"
              onClick={onCloseMobile}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              title={t('user.settings')}
            >
              <Settings size={18} />
            </NavLink>
            <NavLink
              to="/profile"
              onClick={onCloseMobile}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              title={t('user.profile')}
            >
              <UserCircle size={18} />
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-red-500"
              title={t('user.logout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
