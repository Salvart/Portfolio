import React, { createContext, useContext, useMemo, useState } from 'react'

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('es')
  const toggleLang = () => setLang((prev) => (prev === 'es' ? 'en' : 'es'))
  const t = (es, en) => (lang === 'es' ? es : en)

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
