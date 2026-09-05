import PageHeader from '../components/layout/PageHeader'
import { useI18n } from '../i18n/I18nContext'

export default function ComingSoon({ titleKey, Icon }) {
  const { t } = useI18n()
  return (
    <div>
      <PageHeader title={t(titleKey)} />
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-24 text-center">
        {Icon && <Icon size={40} className="mb-4 text-slate-300" />}
        <p className="text-sm text-slate-400">{t('common.comingSoon')}</p>
      </div>
    </div>
  )
}
