import { Languages } from 'lucide-react'
import { useI18n } from '../../i18n/I18nContext'

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useI18n()

  return (
    <button
      type="button"
      onClick={toggleLang}
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      title="Switch language / زبان تبدیل کریں"
    >
      <Languages size={16} />
      {lang === 'en' ? 'اردو' : 'English'}
    </button>
  )
}
