import PageHeader from '../components/layout/PageHeader'
import { useI18n } from '../i18n/I18nContext'

export default function Settings() {
  const { t, lang, setLang } = useI18n()

  return (
    <div>
      <PageHeader title={t('user.settings')} />
      <div className="max-w-md rounded-2xl border border-slate-100 bg-white p-6">
        <p className="mb-3 text-sm font-medium text-slate-700">{t('common.language')}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              lang === 'en' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-200 text-slate-600'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('ur')}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              lang === 'ur' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-200 text-slate-600'
            }`}
          >
            اردو
          </button>
        </div>
      </div>
    </div>
  )
}
