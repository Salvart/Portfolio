import React, { useState, useMemo } from 'react'
import { useI18n } from '../../utils/i18n.jsx'
import './TechSection.css'

export default function TechSection() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('all')

  const equipmentLabel = t('EQUIPAMIENTO & STACK DOMINADO', 'MASTERED STACK & EQUIPMENT')

  const categories = useMemo(
    () => [
      { id: 'all', label: t('Todo', 'All') },
      { id: 'frontend', label: t('Frontend', 'Frontend') },
      { id: 'backend', label: t('Backend', 'Backend') },
      { id: '3d', label: t('3D & Motores', '3D & Engines') },
      { id: 'tools', label: t('Herramientas', 'Tools') }
    ],
    [t]
  )

  const activeCategoryLabel = useMemo(() => {
    const current = categories.find((c) => c.id === activeTab)
    return current ? current.label : ''
  }, [categories, activeTab])

  const skills = [
    // Frontend
    { name: 'Vue.js 3', category: 'frontend', icon: '✦', percent: 95, experience: 'Expert' },
    { name: 'JavaScript (ES6+)', category: 'frontend', icon: '⚡', percent: 92, experience: 'Advanced' },
    { name: 'HTML5 & CSS3', category: 'frontend', icon: '◈', percent: 96, experience: 'Expert' },
    { name: 'TypeScript', category: 'frontend', icon: '◆', percent: 85, experience: 'Proficient' },
    { name: 'Tailwind / Modern CSS', category: 'frontend', icon: '✦', percent: 90, experience: 'Advanced' },

    // Backend
    { name: 'Node.js & Express', category: 'backend', icon: '⬢', percent: 88, experience: 'Advanced' },
    { name: 'REST APIs & WebSockets', category: 'backend', icon: '❖', percent: 92, experience: 'Expert' },
    { name: 'SQL & Database Systems', category: 'backend', icon: '🗄', percent: 80, experience: 'Proficient' },
    { name: 'C++ & C# Scripting', category: 'backend', icon: '⚙', percent: 85, experience: 'Advanced' },

    // 3D
    { name: 'Unreal Engine 4 & 5', category: '3d', icon: '✦', percent: 92, experience: 'Expert' },
    { name: 'Unity 3D', category: '3d', icon: '⬢', percent: 85, experience: 'Advanced' },
    { name: 'Autodesk 3ds Max', category: '3d', icon: '◈', percent: 92, experience: 'Expert' },
    { name: 'ZBrush (Escultura Digital)', category: '3d', icon: '❖', percent: 86, experience: 'Advanced' },
    { name: 'Photoshop & After Effects', category: '3d', icon: '◈', percent: 90, experience: 'Expert' },
    { name: 'Substance Painter (PBR)', category: '3d', icon: '◈', percent: 88, experience: 'Advanced' },
    { name: 'Modelado High/Low Poly & UV', category: '3d', icon: '✦', percent: 92, experience: 'Expert' },
    { name: 'Rigging, Skeletons & Shaders', category: '3d', icon: '⚡', percent: 82, experience: 'Proficient' },

    // Tools
    { name: 'Git & GitHub Workflow', category: 'tools', icon: '❖', percent: 90, experience: 'Advanced' },
    { name: 'Vite & Modern Tooling', category: 'tools', icon: '⚡', percent: 88, experience: 'Advanced' },
    { name: 'Marmoset Toolbag Rendering', category: 'tools', icon: '❖', percent: 84, experience: 'Advanced' },
    { name: 'Figma & UI Prototyping', category: 'tools', icon: '◆', percent: 82, experience: 'Proficient' }
  ]

  const totalSkills = skills.length

  const filteredSkills = useMemo(() => {
    if (activeTab === 'all') return skills
    return skills.filter((s) => s.category === activeTab)
  }, [activeTab])

  const mainEquipment = [
    'React',
    'Vue.js 3',
    'JavaScript ES6+',
    'Unreal Engine 5',
    'Unity 3D',
    '3ds Max',
    'ZBrush',
    'Substance Painter',
    'Node.js',
    'C++',
    'C#',
    'Git & GitHub',
    'REST APIs',
    'Figma'
  ]

  return (
    <div className="tech-container glass-panel">
      {/* Section Header Badge */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>STACK &amp; SKILLS // {totalSkills} TECHNOLOGIES</span>
        </div>
        <div className="active-category-pill">
          <span>FILTRADO: {activeCategoryLabel}</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
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

      {/* Skills Interactive Grid */}
      <div className="skills-grid">
        {filteredSkills.map((skill) => (
          <div key={skill.name} className="skill-item">
            <div className="skill-top">
              <div className="skill-name-group">
                <span className="skill-icon">{skill.icon}</span>
                <span className="skill-title">{skill.name}</span>
              </div>
              <span className="skill-badge">{skill.experience}</span>
            </div>

            <div className="skill-progress-bar">
              <div className="skill-fill" style={{ width: `${skill.percent}%` }}></div>
            </div>

            <div className="skill-footer">
              <span className="skill-cat-tag">{skill.category.toUpperCase()}</span>
              <span className="skill-percentage">{skill.percent}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Equipped Main Stack */}
      <div className="equipment-section">
        <div className="equipment-title">
          <span className="accent-symbol">✦</span>
          <span>{equipmentLabel}</span>
        </div>
        <div className="tags-cloud">
          {mainEquipment.map((tag) => (
            <span key={tag} className="tech-tag-chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
