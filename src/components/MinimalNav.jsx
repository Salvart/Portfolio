import React from 'react'

export default function MinimalNav({ index, count, goTo, lang, setLang }) {
  return (
    <nav className="minimal-nav" aria-label="Navegación de secciones">
      <button type="button" className="nav-brand" onClick={() => goTo(0)}>
        SALVADOR RUIZ
      </button>

      <div className="nav-right">
        <div className="nav-dots">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`nav-index ${i === index ? 'active' : ''}`}
              aria-label={`Sección ${i + 1} de ${count}`}
              aria-current={i === index ? 'step' : undefined}
              onClick={() => goTo(i)}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
        <div className="lang">
          <button
            type="button"
            className={lang === 'es' ? 'active' : ''}
            aria-pressed={lang === 'es'}
            onClick={() => setLang('es')}
          >
            ES
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </div>

      <div className="nav-cue" aria-hidden="true">
        SCROLL ↓
      </div>
    </nav>
  )
}
