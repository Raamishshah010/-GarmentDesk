import PageHeader from '../components/layout/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'

export default function Profile() {
  const { t } = useI18n()
  const { user } = useAuth()
  const initial = (user?.email || 'T').charAt(0).toUpperCase()

  return (
    <div>
      <PageHeader title={t('user.profile')} />
      <div className="max-w-md rounded-2xl border border-slate-100 bg-white p-6">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-xl font-semibold text-white">
            {initial}
          </div>
          <div>
            <p className="font-semibold text-slate-700">{user?.displayName || 'TailorShop'}</p>
            <p className="text-sm text-slate-400">{user?.email || 'admin@tailorsaas.com'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
