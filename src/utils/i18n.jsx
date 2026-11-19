import React, { createContext, useContext, useState, useMemo } from 'react'

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('es')

  const toggleLang = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'))
  }

  const isEs = lang === 'es'

  const t = (es, en) => (lang === 'es' ? es : en)

  const value = useMemo(
    () => ({
      lang,
      isEs,
      toggleLang,
      t
    }),
    [lang, isEs]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
