import React from 'react'
import { useI18n } from '../../utils/i18n.jsx'
import './StudiesSection.css'

export default function StudiesSection() {
  const { lang, t } = useI18n()

  const studies = [
    {
      id: 1,
      step: '01',
      period: '2008 - 2010',
      title: {
        es: 'Equipos Electrónicos de Consumo',
        en: 'Consumer Electronic Equipment'
      },
      institution: 'I.E.S. Santa María del Castillo',
      summary: {
        es: 'Hardware, soldadura PCB de precisión y diagnóstico de circuitos.',
        en: 'Hardware, precision PCB soldering and circuit diagnostics.'
      },
      skills: ['Soldadura PCB', 'Hardware', 'Microelectrónica']
    },
    {
      id: 2,
      step: '02',
      period: '2007 - 2009',
      title: {
        es: 'Administración de Sistemas en Red (ASIR)',
        en: 'Network Systems Administration'
      },
      institution: 'IES Santa María del Castillo',
      summary: {
        es: 'Administración de servidores, redes, seguridad y bases de datos.',
        en: 'Server administration, networking, security and databases.'
      },
      skills: ['Redes & Servidores', 'Seguridad', 'Bases de Datos']
    },
    {
      id: 3,
      step: '03',
      period: '2011 - 2017',
      title: {
        es: 'Diseño y Desarrollo de Videojuegos',
        en: 'Video Game Design & Development'
      },
      institution: 'ESNE (Madrid)',
      summary: {
        es: 'Producción de videojuegos, programación C++/C#, Unreal Engine, Unity, 3ds Max y ZBrush.',
        en: 'Video game production, C++/C# scripting, Unreal Engine, Unity, 3ds Max and ZBrush.'
      },
      skills: ['Unreal Engine', 'C++ / C#', '3ds Max / ZBrush', 'Game Design']
    }
  ]

  return (
    <div className="studies-container glass-panel">
      {/* Header */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>TIMELINE // FORMACIÓN TÉCNICA &amp; UNIVERSITARIA</span>
        </div>
        <span className="timeline-subtitle">{t('3 Titulaciones Oficiales', '3 Official Degrees')}</span>
      </div>

      {/* Horizontal Stepper Timeline */}
      <div className="horizontal-timeline">
        <div className="timeline-track-line"></div>
        {studies.map((item) => (
          <div key={item.id} className="timeline-step">
            <div className="step-node">
              <span className="node-number">{item.step}</span>
              <span className="node-dot"></span>
            </div>

            <div className="step-card">
              <span className="step-period">{item.period}</span>
              <h3 className="step-title">{item.title[lang]}</h3>
              <span className="step-institution">{item.institution}</span>
              <p className="step-summary">{item.summary[lang]}</p>
              <div className="step-tags">
                {item.skills.map((s) => (
                  <span key={s} className="step-tag">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
