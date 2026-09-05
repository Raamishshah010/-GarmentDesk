import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import en from './locales/en.json'
import ur from './locales/ur.json'

const dictionaries = { en, ur }
const RTL_LANGS = new Set(['ur'])
const STORAGE_KEY = 'garmentdesk_lang'

const I18nContext = createContext(null)

function resolve(dict, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict)
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr'
    document.documentElement.classList.toggle('font-urdu', lang === 'ur')
  }, [lang])

  const t = useCallback(
    (key, fallback) => {
      const value = resolve(dictionaries[lang], key)
      if (value !== undefined) return value
      const fallbackValue = resolve(dictionaries.en, key)
      return fallbackValue !== undefined ? fallbackValue : fallback || key
    },
    [lang]
  )

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ur' : 'en'))
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, isRtl: RTL_LANGS.has(lang), t }),
    [lang, toggleLang, t]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- standard context+hook pairing
export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider')
  return ctx
}
