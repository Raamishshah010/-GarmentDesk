import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../i18n/I18nContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useI18n()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-400">
        {t('common.loading')}
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />
  }

  return children
}
