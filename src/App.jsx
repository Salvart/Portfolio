import React, { useEffect } from 'react'
import RetroComputer from './components/RetroComputer.jsx'
import Navbar from './components/Navbar.jsx'
import InfoSection from './components/sections/InfoSection.jsx'
import TechSection from './components/sections/TechSection.jsx'
import StudiesSection from './components/sections/StudiesSection.jsx'
import ProjectsSection from './components/sections/ProjectsSection.jsx'
import './App.css'

function useEntranceAnimation(sectionIds) {
  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-target').forEach((el, i) => {
              el.style.animationDelay = `${i * 0.08}s`
              el.classList.add('section-enter')
            })
          }
        })
      },
      { threshold: 0.4 }
    )

    sections.forEach((sec) => observer.observe(sec))
    return () => observer.disconnect()
  }, [])
}

export default function App() {
  useEntranceAnimation(['info', 'tech', 'studies', 'projects'])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-viewport">
      {/* Persistent Top-Right Contextual Navigation */}
      <Navbar />

      {/* Main Scrollable Content Stream (Snap Viewport) */}
      <main className="content-stream">
        {/* Section 0: Retro computer boot hero */}
        <section id="home" className="snap-section hero-section">
          <div className="section-inner">
            <RetroComputer />
          </div>
        </section>

        {/* Section 1: Información / Sobre mí */}
        <section id="info" className="snap-section">
          <div className="section-inner anim-target">
            <InfoSection />
            <div className="scroll-cue anim-target">
              <span className="cue-label">SCROLL</span>
              <span className="cue-arrow">↓</span>
            </div>
          </div>
        </section>

        {/* Section 2: Tecnologías & Skills */}
        <section id="tech" className="snap-section">
          <div className="section-inner anim-target">
            <TechSection />
          </div>
        </section>

        {/* Section 3: Formación / Estudios */}
        <section id="studies" className="snap-section">
          <div className="section-inner anim-target">
            <StudiesSection />
          </div>
        </section>

        {/* Section 4: Proyectos & Vault */}
        <section id="projects" className="snap-section">
          <div className="section-inner anim-target">
            <ProjectsSection />
            {/* Integrated Minimalist Footer */}
            <div className="compact-footer">
              <span className="footer-dot"></span>
              <span className="footer-copy">
                &copy; {new Date().getFullYear()} Salvador Ruiz &bull; Technical Artist &amp; Software Programmer
              </span>
              <a
                href="https://www.artstation.com/salv_art"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                ArtStation ↗
              </a>
              <button type="button" className="footer-link top-btn" onClick={scrollToTop}>
                Inicio ↑
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
