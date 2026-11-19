import React, { useMemo } from 'react'
import { useI18n } from '../../utils/i18n.jsx'
import './InfoSection.css'

const BIRTH_YEAR = 1990
const BIRTH_MONTH = 11 // diciembre (0-indexado)
const BIRTH_DAY = 15

export default function InfoSection() {
  const { t } = useI18n()

  const playerLevel = useMemo(() => {
    const now = new Date()
    let level = now.getFullYear() - BIRTH_YEAR
    const hasHadBirthday =
      now.getMonth() > BIRTH_MONTH ||
      (now.getMonth() === BIRTH_MONTH && now.getDate() >= BIRTH_DAY)
    if (!hasHadBirthday) level--
    return level
  }, [])

  const aboutLabel = t('SOBRE MÍ', 'ABOUT ME')
  const tagline = t(
    '« Apasionado por los videojuegos, el arte 3D y el código limpio »',
    '« Passionate about videogames, 3D art and clean code »'
  )
  const bio1 = t(
    '¡Hola! Soy un desarrollador que trabaja programando y haciendo 3D. Me adapto a cualquier pipeline de trabajo: C++, Blueprints, web y mucho más.',
    'Hi! I am a developer who works programming and doing 3D. I adapt to any pipeline: C++, Blueprints, web and much more.'
  )
  const bio2 = t(
    'Me encanta combinar modelado y arte 3D con arquitectura de software limpia para crear experiencias interactivas memorables.',
    'I love combining 3D modeling and art with clean software architecture to create memorable interactive experiences.'
  )
  const locationFact = t('Ubicación: Madrid, España', 'Location: Madrid, Spain')
  const statusFact = t('Disponible para proyectos', 'Available for projects')
  const specialtyFact = t('Especialidad: Web & Game Dev', 'Specialty: Web & Game Dev')

  return (
    <div className="info-container glass-panel">
      {/* Top Status Header */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>SYSTEM ONLINE // LVL. {playerLevel}</span>
        </div>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">{statusFact}</span>
        </div>
      </div>

      {/* Main Profile Identity Grid */}
      <div className="profile-hero">
        <div className="profile-avatar-wrapper">
          <div className="avatar-ring">
            <div className="avatar-core">
              <span className="avatar-initials">SR</span>
            </div>
          </div>
          <span className="role-pill">TECH ARTIST</span>
        </div>

        <div className="profile-main">
          <h1 className="dev-name">SALVADOR RUIZ</h1>
          <h2 className="dev-title">Technical Artist &amp; Software Programmer</h2>
          <p className="tagline">{tagline}</p>

          {/* Dynamic Tech Metrics / Telemetry */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-info">
                <span className="metric-label">HP // ALTURA</span>
                <span className="metric-val">183 cm</span>
              </div>
              <div className="meter-bar">
                <div className="meter-fill hp-fill" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span className="metric-label">MP // IQ</span>
                <span className="metric-val">123 pts</span>
              </div>
              <div className="meter-bar">
                <div className="meter-fill mp-fill" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-info">
                <span className="metric-label">EXP // CREATIVIDAD</span>
                <span className="metric-val">MAX</span>
              </div>
              <div className="meter-bar">
                <div className="meter-fill exp-fill" style={{ width: '95%' }}></div>
              </div>
            </div>
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

      {/* Quick Facts Telemetry */}
      <div className="quick-facts-row">
        <div className="fact-chip">
          <span className="fact-icon">📍</span>
          <span className="fact-val">{locationFact}</span>
        </div>
        <div className="fact-chip">
          <span className="fact-icon">💻</span>
          <span className="fact-val">{specialtyFact}</span>
        </div>
        <div className="fact-chip">
          <span className="fact-icon">🎮</span>
          <span className="fact-val">Unreal Engine &bull; Unity &bull; Web</span>
        </div>
      </div>
    </div>
  )
}
