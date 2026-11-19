import React from 'react'
import PixarBackground from './components/PixarBackground.jsx'
import Navbar from './components/Navbar.jsx'
import InfoSection from './components/sections/InfoSection.jsx'
import TechSection from './components/sections/TechSection.jsx'
import StudiesSection from './components/sections/StudiesSection.jsx'
import ProjectsSection from './components/sections/ProjectsSection.jsx'
import './App.css'

export default function App() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-viewport">
      {/* Fixed Scroll-Driven Pixar Background */}
      <PixarBackground />

      {/* Persistent Top-Right Contextual Navigation */}
      <Navbar />

      {/* Main Scrollable Content Stream (Snap Viewport) */}
      <main className="content-stream">
        {/* Section 1: Información / Sobre mí */}
        <section id="info" className="snap-section">
          <div className="section-inner">
            <InfoSection />
            <div className="scroll-cue">
              <span className="cue-label">SCROLL</span>
              <span className="cue-arrow">↓</span>
            </div>
          </div>
        </section>

        {/* Section 2: Tecnologías & Skills */}
        <section id="tech" className="snap-section">
          <div className="section-inner">
            <TechSection />
          </div>
        </section>

        {/* Section 3: Formación / Estudios */}
        <section id="studies" className="snap-section">
          <div className="section-inner">
            <StudiesSection />
          </div>
        </section>

        {/* Section 4: Proyectos & Vault */}
        <section id="projects" className="snap-section">
          <div className="section-inner">
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
