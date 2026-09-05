import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Scissors } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'
import { inputClass } from '../components/ui/Field'
import LanguageSwitcher from '../components/layout/LanguageSwitcher'

export default function Login() {
  const { t } = useI18n()
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (user) {
    return <Navigate to={location.state?.from || '/'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const success = await login(email, password)
    setSubmitting(false)
    if (success) {
      navigate(location.state?.from || '/', { replace: true })
    } else {
      setError(t('auth.invalidCredentials'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="absolute top-6 end-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue via-brand-purple to-brand-orange text-white">
            <Scissors size={22} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800">{t('appName')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('auth.signInSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t('auth.email')}</label>
            <input
              type="email"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t('auth.password')}</label>
            <input
              type="password"
              required
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {t('auth.signInButton')}
          </button>
        </form>
      </div>
    </div>
  )
}
