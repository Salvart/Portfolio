import React from 'react'
import { useI18n } from '../../utils/i18n.jsx'
import './InfoSection.css'

export default function InfoSection() {
  const { t } = useI18n()

  const aboutLabel = t('SOBRE MÍ', 'ABOUT ME')
  const bio1 = t(
    'Desarrollador y Technical Artist especializado en la convergencia entre programación y arte 3D. Experiencia integral en pipelines de desarrollo con C++, Blueprints, Unreal Engine, Unity y tecnologías web modernas.',
    'Developer and Technical Artist specialized in the convergence of programming and 3D art. Full-pipeline experience with C++, Blueprints, Unreal Engine, Unity and modern web technologies.'
  )
  const bio2 = t(
    'Combino modelado de alta fidelidad, shaders y optimización gráfica con una arquitectura de software limpia para crear experiencias interactivas memorables.',
    'I combine high-fidelity 3D modeling, shaders, and real-time graphics optimization with clean software architecture to build memorable interactive experiences.'
  )
  const locationFact = t('Madrid, España', 'Madrid, Spain')
  const statusFact = t('Disponible para proyectos', 'Available for projects')
  const specialtyFact = t('Technical Artist / Programador', 'Technical Artist / Programmer')

  return (
    <div className="info-container glass-panel">
      {/* Top Status Header */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>{specialtyFact}</span>
        </div>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">{statusFact}</span>
        </div>
      </div>

      {/* Main Profile Identity */}
      <div className="profile-hero">
        <div className="profile-avatar-wrapper">
          <div className="avatar-ring">
            <div className="avatar-core">
              <span className="avatar-initials">SR</span>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <h1 className="dev-name">SALVADOR RUIZ</h1>
          <h2 className="dev-title">Technical Artist &amp; Software Programmer</h2>
          <div className="location-chip">
            <span className="pin-icon">📍</span>
            <span>{locationFact}</span>
          </div>
        </div>
      </div>

      {/* Bio Description Section */}
      <div className="bio-wrapper">
        <div className="bio-header-badge">
          <span className="badge-icon">◈</span>
          <span className="badge-text">{aboutLabel}</span>
        </div>
        <p className="bio-paragraph">{bio1}</p>
        <p className="bio-paragraph">{bio2}</p>
      </div>

      {/* Quick Tags */}
      <div className="quick-facts-row">
        <span className="fact-chip">Unreal Engine 5</span>
        <span className="fact-chip">Unity 3D</span>
        <span className="fact-chip">C++ &bull; C#</span>
        <span className="fact-chip">3ds Max &bull; ZBrush</span>
        <span className="fact-chip">React &bull; Web</span>
      </div>
    </div>
  )
}
