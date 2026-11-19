import React, { useState, useEffect } from 'react'
import { useI18n } from '../utils/i18n.jsx'
import './Navbar.css'

export default function Navbar() {
  const { isEs, toggleLang, t } = useI18n()
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'home', icon: '▣', label: t('Inicio', 'Home') },
    { id: 'info', icon: '◈', label: t('Información', 'About') },
    { id: 'tech', icon: '⚡', label: t('Tecnologías', 'Tech') },
    { id: 'studies', icon: '✦', label: t('Estudios', 'Education') },
    { id: 'projects', icon: '⚙', label: t('Proyectos', 'Projects') }
  ]

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -20
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleMobileClick = (id) => {
    scrollToSection(id)
    setMobileOpen(false)
  }

  useEffect(() => {
    const sectionIds = ['home', 'info', 'tech', 'studies', 'projects']
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          })
        },
        {
          rootMargin: '-30% 0px -50% 0px',
          threshold: 0.1
        }
      )

      sections.forEach((sec) => observer.observe(sec))
      return () => observer.disconnect()
    } else {
      const onScroll = () => {
        const scrollPos = window.scrollY + 250
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i])
          if (el && el.offsetTop <= scrollPos) {
            setActiveSection(sectionIds[i])
            break
          }
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className="navbar-wrapper">
      {/* Desktop Navigation Pill */}
      <nav className="nav-pill" aria-label="Navegación principal">
        <button
          type="button"
          className="nav-logo"
          onClick={() => scrollToSection('home')}
          aria-label="Ir al inicio"
        >
          <span className="logo-dot"></span>
          <span className="logo-text">SR</span>
        </button>

        <div className="nav-divider"></div>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-divider"></div>

        {/* Language Toggle */}
        <button
          type="button"
          className="lang-btn"
          onClick={toggleLang}
          title={isEs ? 'Switch to English' : 'Cambiar a Español'}
        >
          <span className="lang-flag">{isEs ? 'EN' : 'ES'}</span>
        </button>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label="Abrir menú de secciones"
        >
          <span className={`hamburger-icon ${mobileOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="mobile-dropdown glass-panel">
          <ul className="mobile-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`mobile-link-btn ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleMobileClick(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {activeSection === item.id && <span className="active-dot"></span>}
                </button>
              </li>
            ))}
          </ul>
          <div className="mobile-footer">
            <button type="button" className="mobile-lang-btn" onClick={toggleLang}>
              🌐 {isEs ? 'English Version' : 'Versión en Español'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
