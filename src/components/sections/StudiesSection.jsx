import React, { useMemo } from 'react'
import { useI18n } from '../../utils/i18n.jsx'
import './StudiesSection.css'

export default function StudiesSection() {
  const { lang, t } = useI18n()

  const rewardsLabel = t('COMPETENCIAS CLAVE', 'KEY COMPETENCIES')
  const sectionSubtitle = t('Formación Técnica & Universitaria', 'Technical & University Degrees')

  const questsDef = [
    {
      id: 1,
      title: {
        es: 'Grado en Diseño y Desarrollo de Videojuegos',
        en: 'Degree in Video Game Design and Development'
      },
      institution: {
        es: 'ESNE – Escuela Universitaria de Diseño, Innovación y Tecnología (Madrid)',
        en: 'ESNE – University School of Design, Innovation and Technology (Madrid)'
      },
      period: '2011 - 2017',
      description: {
        es: 'Formación integral en producción de videojuegos: programación en C, C# y Java, modelado y escultura de personajes, diseño y gamificación, animación 2D/3D, preproducción y producción, arte conceptual y middleware de desarrollo. Staff en eventos oficiales como Madrid Games Week y FICOD.',
        en: 'Comprehensive training in video game production: programming in C, C# and Java, character modeling and sculpting, design and gamification, 2D/3D animation, pre-production and production, concept art and development middleware. Staff at official events such as Madrid Games Week and FICOD.'
      },
      rewards: ['C++ / C# Scripting', '3D Studio Max', 'ZBrush', 'Game Design', '3D Animation', 'Unreal Engine', 'Concept Art']
    },
    {
      id: 2,
      title: {
        es: 'Grado Superior en Administración de Sistemas Informáticos en Red',
        en: 'Higher Degree in Network Computer Systems Administration'
      },
      institution: {
        es: 'IES Santa María del Castillo',
        en: 'IES Santa María del Castillo'
      },
      period: '2007 - 2009',
      description: {
        es: 'Especialización en administración de redes y sistemas: instalación y configuración de servidores, seguridad informática, topologías de redes locales y gestión de infraestructuras informáticas y bases de datos.',
        en: 'Specialization in network and systems administration: server installation and configuration, computer security, local network topologies and management of IT infrastructures and databases.'
      },
      rewards: ['Administración de Redes', 'Sistemas Operativos', 'Ciberseguridad', 'Bases de Datos SQL', 'Infraestructura IT']
    },
    {
      id: 3,
      title: {
        es: 'Grado Medio en Equipos Electrónicos de Consumo',
        en: 'Intermediate Degree in Consumer Electronic Equipment'
      },
      institution: {
        es: 'I.E.S. Santa María del Castillo (Buitrago del Lozoya)',
        en: 'I.E.S. Santa María del Castillo (Buitrago del Lozoya)'
      },
      period: '2008 - 2010',
      description: {
        es: 'Formación técnica en hardware, electricidad y electrónica de consumo: soldadura de precisión en circuitos impresos, análisis de placas base, diagnóstico y reparación de equipos microelectrónicos.',
        en: 'Technical training in hardware, electricity and consumer electronics: precision soldering on PCBs, motherboard analysis, diagnosis and repair of microelectronic equipment.'
      },
      rewards: ['Electrónica de Precisión', 'Soldadura PCB', 'Hardware & Arquitectura', 'Sistemas Electrotécnicos']
    }
  ]

  const quests = useMemo(
    () =>
      questsDef.map((q) => ({
        ...q,
        title: q.title[lang],
        institution: q.institution[lang],
        description: q.description[lang]
      })),
    [lang]
  )

  return (
    <div className="studies-container glass-panel">
      {/* Header Badge */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>ACADEMIC TIMELINE // {quests.length} DEGREES COMPLETED</span>
        </div>
        <div className="education-status">
          <span className="badge-icon">🎓</span>
          <span>{sectionSubtitle}</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="timeline">
        {quests.map((quest, idx) => (
          <div key={quest.id} className="timeline-card">
            {/* Glowing Timeline Node */}
            <div className="timeline-marker">
              <div className="marker-dot">
                <span className="marker-pulse"></span>
              </div>
              {idx < quests.length - 1 && <div className="marker-line"></div>}
            </div>

            {/* Card Content */}
            <div className="timeline-body">
              <div className="timeline-header">
                <div className="degree-info">
                  <span className="quest-index">#0{idx + 1} // FORMACIÓN</span>
                  <h3 className="degree-title">{quest.title}</h3>
                </div>
                <span className="degree-period">{quest.period}</span>
              </div>

              <div className="institution-row">
                <span className="institution-icon">🏛</span>
                <span className="institution-name">{quest.institution}</span>
              </div>

              <p className="degree-description">{quest.description}</p>

              {/* Reward Skills Obtained */}
              <div className="rewards-wrapper">
                <span className="rewards-heading">{rewardsLabel}:</span>
                <div className="rewards-chips">
                  {quest.rewards.map((skill) => (
                    <span key={skill} className="reward-pill">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
