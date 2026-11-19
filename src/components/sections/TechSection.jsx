import React, { useState, useMemo } from 'react'
import { useI18n } from '../../utils/i18n.jsx'
import './TechSection.css'

export default function TechSection() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('all')

  const categories = useMemo(
    () => [
      { id: 'all', label: t('Todo', 'All') },
      { id: '3d', label: t('3D & Motores', '3D & Engines') },
      { id: 'frontend', label: t('Frontend', 'Frontend') },
      { id: 'backend', label: t('Backend', 'Backend') },
      { id: 'tools', label: t('Herramientas', 'Tools') }
    ],
    [t]
  )

  const skills = [
    // 3D & Engines (Primary specialty)
    { name: 'Unreal Engine 4 & 5', category: '3d', icon: '✦', level: 'Expert' },
    { name: 'Unity 3D', category: '3d', icon: '⬢', level: 'Advanced' },
    { name: 'Autodesk 3ds Max', category: '3d', icon: '◈', level: 'Expert' },
    { name: 'ZBrush (Escultura)', category: '3d', icon: '❖', level: 'Advanced' },
    { name: 'Substance Painter (PBR)', category: '3d', icon: '◈', level: 'Advanced' },
    { name: 'Modelado High/Low Poly', category: '3d', icon: '✦', level: 'Expert' },
    { name: 'Rigging & Shaders', category: '3d', icon: '⚡', level: 'Proficient' },
    { name: 'Photoshop / After Effects', category: '3d', icon: '◈', level: 'Expert' },

    // Frontend
    { name: 'React', category: 'frontend', icon: '⚛', level: 'Advanced' },
    { name: 'Vue.js 3', category: 'frontend', icon: '✦', level: 'Expert' },
    { name: 'JavaScript (ES6+)', category: 'frontend', icon: '⚡', level: 'Advanced' },
    { name: 'HTML5 & CSS3', category: 'frontend', icon: '◈', level: 'Expert' },
    { name: 'TypeScript', category: 'frontend', icon: '◆', level: 'Proficient' },

    // Backend
    { name: 'C++ & C# Scripting', category: 'backend', icon: '⚙', level: 'Advanced' },
    { name: 'Node.js & Express', category: 'backend', icon: '⬢', level: 'Advanced' },
    { name: 'REST APIs & WebSockets', category: 'backend', icon: '❖', level: 'Expert' },
    { name: 'SQL & Databases', category: 'backend', icon: '🗄', level: 'Proficient' },

    // Tools
    { name: 'Git & GitHub', category: 'tools', icon: '❖', level: 'Advanced' },
    { name: 'Vite & Tooling', category: 'tools', icon: '⚡', level: 'Advanced' },
    { name: 'Marmoset Toolbag', category: 'tools', icon: '❖', level: 'Advanced' },
    { name: 'Figma & UI', category: 'tools', icon: '◆', level: 'Proficient' }
  ]

  const filteredSkills = useMemo(() => {
    if (activeTab === 'all') return skills
    return skills.filter((s) => s.category === activeTab)
  }, [activeTab])

  return (
    <div className="tech-container glass-panel">
      {/* Header */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>STACK &amp; SKILLS // {skills.length} TECNOLOGÍAS</span>
        </div>
        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`tab-btn ${activeTab === cat.id ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compressed Skills Grid */}
      <div className="skills-compact-grid">
        {filteredSkills.map((skill) => (
          <div key={skill.name} className="skill-chip">
            <span className="chip-icon">{skill.icon}</span>
            <span className="chip-name">{skill.name}</span>
            <span className={`chip-level ${skill.level.toLowerCase()}`}>{skill.level}</span>
          </div>
        ))}
      </div>

      {/* Main Stack Footer */}
      <div className="equipment-compact-row">
        <span className="equipment-label">STACK CLAVE:</span>
        <div className="equipment-pills">
          {['Unreal Engine 5', 'Unity', '3ds Max', 'ZBrush', 'C++', 'C#', 'React', 'Vue', 'Node.js', 'Git'].map((item) => (
            <span key={item} className="mini-pill">{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
