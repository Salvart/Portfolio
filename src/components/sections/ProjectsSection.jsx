import React, { useState, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { useI18n } from '../../utils/i18n.jsx'
import './ProjectsSection.css'

const ITEMS_PER_PAGE = 6

export default function ProjectsSection() {
  const { lang, t } = useI18n()
  const [activeProject, setActiveProject] = useState(null)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const artStationProfile = 'https://www.artstation.com/salv_art'
  const artStationProfileLabel = t('Ver Perfil en ArtStation', 'View ArtStation Profile')
  const vaultLabel = t('PROYECTOS', 'PROJECTS')
  const noLinkLabel = t('No hay enlace directo disponible', 'No direct link available')
  const highlightsLabel = t('Aspectos destacados', 'Key Highlights')

  const filterOptions = [
    { id: 'all', label: t('Todos', 'All') },
    { id: 'games', label: t('Juegos / VR', 'Games / VR') },
    { id: 'env', label: t('Entornos 3D', '3D Environments') },
    { id: 'props', label: t('Props & Armas', 'Props & Weapons') }
  ]

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    })
  }

  const projectsDef = [
    {
      id: 1,
      title: 'INSOMNIS (PS4 / PS5 / Steam)',
      icon: '✦',
      date: '2021',
      category: 'games',
      genre: { es: 'Juego de Terror / Environment Art', en: 'Horror Game / Environment Art' },
      description: {
        es: 'Videojuego de terror publicado en PlayStation 4, PlayStation 5 y Steam en el que trabajé como Environment Artist creando los escenarios y props de la mansión encantada.',
        en: 'Horror game published on PlayStation 4, PlayStation 5 and Steam where I worked as an Environment Artist creating the sets and props of the haunted mansion.'
      },
      highlights: {
        es: [
          'Modelado High & Low Poly de escenarios y props de terror',
          'Texturizado, rigging, shaders y animación de props',
          'Pipeline completo en Unreal Engine 4',
          'Publicado en PS4, PS5, Steam y Nintendo Switch'
        ],
        en: [
          'High & Low Poly modeling of horror sets and props',
          'Texturing, rigging, shaders and prop animation',
          'Full pipeline in Unreal Engine 4',
          'Published on PS4, PS5, Steam and Nintendo Switch'
        ]
      },
      tags: ['Unreal Engine 4', '3ds Max', 'ZBrush', 'Substance'],
      links: [
        { label: 'PlayStation Store', url: 'https://store.playstation.com/es-es/product/EP0811-CUSA25829_00-6756474835074646' },
        { label: 'Nintendo Switch', url: 'https://www.nintendo.com/es-es/Juegos/Programas-descargables-Nintendo-Switch/Insomnis-2281154.html?srsltid=AfmBOoqsdivojGRs0CYNu4T8-pkKgbf9J1dJqWRYVnTtNj9HADPuuLJP' },
        { label: 'Steam', url: 'https://store.steampowered.com/app/1000700/Insomnis/?l=spanish' },
        { label: 'ArtStation', url: 'https://www.artstation.com/artwork/Oygnvy' }
      ]
    },
    {
      id: 2,
      title: 'Valdecarros Digital Twin (PPG Studios)',
      icon: '⚙',
      date: '2023 - Act.',
      category: 'games',
      genre: { es: 'Gemelo Digital / Tiempo Real', en: 'Digital Twin / Real-Time' },
      description: {
        es: 'Gemelo digital creado con Unreal Engine 5 para el proyecto de desarrollo urbano de Valdecarros. Senior Technical Artist y programador.',
        en: 'Digital twin created with Unreal Engine 5 for the Valdecarros urban development. Senior Technical Artist and programmer.'
      },
      highlights: {
        es: ['Gemelo digital en Unreal Engine 5', 'Entorno urbano navegable', 'C++, Python y React'],
        en: ['Digital twin in Unreal Engine 5', 'Interactive urban environment', 'C++, Python and React']
      },
      tags: ['Unreal Engine 5', '3ds Max', 'C++', 'Python'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Rq36kA' }]
    },
    {
      id: 3,
      title: 'WEWORK FACTORY',
      icon: '◈',
      date: '2023',
      category: 'env',
      genre: { es: 'Escenas Quixel / Entorno', en: 'Quixel Scenes / Environment' },
      description: {
        es: 'Escenas demo de entorno con Quixel Megascans de la WeWork Factory: escenarios modulares con iluminación y materiales en tiempo real.',
        en: 'Environment demo scenes with Quixel Megascans of WeWork Factory: modular sets with lighting and real-time materials.'
      },
      highlights: {
        es: ['Escenarios modulares en UE', 'Iluminación y shaders Quixel', 'Optimización gráfica'],
        en: ['Modular environments in UE', 'Quixel lighting and shaders', 'Graphical optimization']
      },
      tags: ['Unreal Engine', 'Quixel', '3ds Max'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/w8zvNV' }]
    },
    {
      id: 4,
      title: 'Warzone Abandoned',
      icon: '★',
      date: '2023',
      category: 'env',
      genre: { es: 'Environment Art', en: 'Environment Art' },
      description: {
        es: 'Entorno bélico abandonado: modelado de escenario y props, composición de iluminación dramática y texturizado post-apocalíptico.',
        en: 'Abandoned war environment: set and props modeling, dramatic lighting composition and post-apocalyptic texturing.'
      },
      highlights: {
        es: ['Escenario bélico y props', 'Iluminación volumétrica', 'PBR en Substance'],
        en: ['Warzone set and props', 'Volumetric lighting', 'PBR in Substance']
      },
      tags: ['3ds Max', 'ZBrush', 'Substance', 'UE'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/1xL1wZ' }]
    },
    {
      id: 5,
      title: 'Medical Horror Kit',
      icon: '❖',
      date: '2021',
      category: 'props',
      genre: { es: 'Props / Terror', en: 'Props / Horror' },
      description: {
        es: 'Kit de props médicos con estética de terror diseñados para INSOMNIS: instrumental quirúrgico envejecido y mobiliario.',
        en: 'Medical props kit with horror aesthetic designed for INSOMNIS: aged surgical instruments and furniture.'
      },
      highlights: {
        es: ['High poly con desgaste', 'Texturizado PBR', 'Marmoset Toolbag render'],
        en: ['High poly with wear', 'PBR texturing', 'Marmoset Toolbag render']
      },
      tags: ['3ds Max', 'ZBrush', 'Substance', 'Marmoset'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/klZ0bd' }]
    },
    {
      id: 6,
      title: 'Apartment Level VR',
      icon: '◈',
      date: '2018',
      category: 'games',
      genre: { es: 'Entorno VR', en: 'VR Environment' },
      description: {
        es: 'Nivel de apartamento para realidad virtual desarrollado durante mi etapa en LEVEL-VR: modelado, texturizado y optimización gráfica en UE4.',
        en: 'Apartment level for VR developed at LEVEL-VR: modeling, texturing and graphical optimization for UE4.'
      },
      highlights: {
        es: ['Escenario VR en Unreal Engine 4', 'Materiales arquitectónicos', 'Optimización 90fps VR'],
        en: ['VR environment in UE4', 'Architectural materials', '90fps VR optimization']
      },
      tags: ['Unreal Engine 4', '3ds Max', 'Substance', 'VR'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Yk2yb' }]
    },
    {
      id: 7,
      title: 'M4A1 Assault Rifle',
      icon: '✦',
      date: '2023',
      category: 'props',
      genre: { es: 'Arma / Hard Surface', en: 'Weapon / Hard Surface' },
      description: {
        es: 'Modelo high y low poly del fusil M4A1: modelado hard surface, texturizado PBR y render de presentación.',
        en: 'High and low poly model of the M4A1 rifle: hard surface modeling, PBR texturing and presentation render.'
      },
      highlights: {
        es: ['Modelado hard surface', 'Bake de texturas', 'Texturizado PBR'],
        en: ['Hard surface modeling', 'Texture baking', 'PBR texturing']
      },
      tags: ['3ds Max', 'ZBrush', 'Substance Painter'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/4JzRW' }]
    },
    {
      id: 8,
      title: 'Gun Low Poly Model',
      icon: '✦',
      date: '2023',
      category: 'props',
      genre: { es: 'Modelo Low Poly / Arma', en: 'Low Poly Model / Weapon' },
      description: {
        es: 'Pistola low poly optimizada para videojuegos: topología limpia, UVs y texturizado ligero.',
        en: 'Low poly gun optimized for games: clean topology, UVs and light texturing.'
      },
      highlights: {
        es: ['Topología limpia para juegos', 'Unwrap de UVs', 'Texturizado optimizado'],
        en: ['Clean game topology', 'UV unwrapping', 'Optimized texturing']
      },
      tags: ['3ds Max', 'Low Poly', 'UV Mapping'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/X0Xxl' }]
    },
    {
      id: 9,
      title: '"FAKE ME" – Campofrío Navidad',
      icon: '★',
      date: '2019',
      category: 'env',
      genre: { es: 'Comercial / Animación TV', en: 'Commercial / TV Animation' },
      description: {
        es: 'Entornos y props navideños para el spot publicitario de Campofrío "FAKE ME".',
        en: 'Christmas environments and props for Campofrío commercial spot "FAKE ME".'
      },
      highlights: {
        es: ['Entornos para spot publicitario', 'Estética navideña', 'Producción para TV'],
        en: ['Sets for commercial spot', 'Christmas aesthetic', 'TV production']
      },
      tags: ['3ds Max', 'Substance', 'Set Design'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/RY4ane' }]
    },
    {
      id: 10,
      title: 'Let It Snow on WEWORK!',
      icon: '◈',
      date: '2019',
      category: 'env',
      genre: { es: 'Escena Navideña / Entorno', en: 'Christmas Scene / Environment' },
      description: {
        es: 'Versión invernal con nieve, decoración navideña e iluminación festiva del entorno WEWORK Factory.',
        en: 'Winter snowy version with Christmas decoration and festive lighting of WEWORK Factory.'
      },
      highlights: {
        es: ['Escena invernal con nieve', 'Iluminación festiva', 'Quixel Megascans'],
        en: ['Winter snowy environment', 'Festive lighting', 'Quixel Megascans']
      },
      tags: ['Unreal Engine', 'Quixel', '3ds Max'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/A9bgvo' }]
    },
    {
      id: 11,
      title: 'Insomnis – Halloween Edition Props',
      icon: '✦',
      date: '2018',
      category: 'props',
      genre: { es: 'Props / Terror', en: 'Props / Horror' },
      description: {
        es: 'Props temáticos especiales para la edición de Halloween de Insomnis con estética envejecida.',
        en: 'Special themed props for the Halloween edition of Insomnis with aged aesthetic.'
      },
      highlights: {
        es: ['Objetos de terror envejecidos', 'PBR texturing', 'In-game ready'],
        en: ['Aged horror objects', 'PBR texturing', 'In-game ready']
      },
      tags: ['3ds Max', 'Substance', 'Insomnis'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/3ooRzY' }]
    },
    {
      id: 12,
      title: 'Old Projector – Insomnis',
      icon: '▶',
      date: '2018',
      category: 'props',
      genre: { es: 'Prop / Insomnis', en: 'Prop / Insomnis' },
      description: {
        es: 'Proyector antiguo para Insomnis: modelado detallado y texturizado con desgaste del tiempo.',
        en: 'Old projector for Insomnis: detailed modeling and aged texturing.'
      },
      highlights: {
        es: ['High poly detallado', 'Textura con pátina de tiempo', 'Integrado en juego'],
        en: ['Detailed high poly', 'Weathered patina texture', 'In-game integrated']
      },
      tags: ['3ds Max', 'ZBrush', 'Substance'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/dOONNe' }]
    },
    {
      id: 13,
      title: 'Old Doors – Insomnis',
      icon: '◈',
      date: '2018',
      category: 'props',
      genre: { es: 'Props / Insomnis', en: 'Props / Insomnis' },
      description: {
        es: 'Colección de puertas antiguas deterioradas para la mansión de Insomnis.',
        en: 'Collection of weathered old doors for the Insomnis mansion.'
      },
      highlights: {
        es: ['Variaciones modulares', 'Desgaste en madera y herrajes', 'Optimizado'],
        en: ['Modular variations', 'Wood and metal wear', 'Optimized']
      },
      tags: ['3ds Max', 'Substance', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Qzz4Nx' }]
    },
    {
      id: 14,
      title: 'Old Lamps – Insomnis',
      icon: '✦',
      date: '2018',
      category: 'props',
      genre: { es: 'Props / Iluminación', en: 'Props / Lighting' },
      description: {
        es: 'Lámparas de época victorianas para Insomnis con materiales translúcidos y desgaste.',
        en: 'Victorian lamps for Insomnis with translucent materials and aged brass.'
      },
      highlights: {
        es: ['Shaders de cristal y latón', 'Iluminación de época', 'Game-ready'],
        en: ['Glass and brass shaders', 'Period lighting', 'Game-ready']
      },
      tags: ['3ds Max', 'Substance', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/rRR3v2' }]
    },
    {
      id: 15,
      title: 'Modular Environment – UE4',
      icon: '⬢',
      date: '2023',
      category: 'env',
      genre: { es: 'Entorno Modular / UE4', en: 'Modular Environment / UE4' },
      description: {
        es: 'Kit de piezas modulares para construcción rápida de escenarios flexibles en Unreal Engine 4.',
        en: 'Kit of modular pieces for fast, flexible environment assembly in Unreal Engine 4.'
      },
      highlights: {
        es: ['Kit modular de piezas', 'Snap de rejilla perfecto', 'Optimización de draw calls'],
        en: ['Modular pieces kit', 'Grid-snapping', 'Draw call optimization']
      },
      tags: ['Unreal Engine 4', '3ds Max', 'Modular'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/8nmnw' }]
    },
    {
      id: 16,
      title: 'Old Frames – Insomnis',
      icon: '◈',
      date: '2018',
      category: 'props',
      genre: { es: 'Props / Insomnis', en: 'Props / Insomnis' },
      description: {
        es: 'Marcos y lienzos antiguos para ambientar la mansión de Insomnis.',
        en: 'Old frames and canvas paintings for the Insomnis mansion atmosphere.'
      },
      highlights: {
        es: ['Marcos con variaciones', 'Texturas de óleo envejecido', 'Props ligeros'],
        en: ['Frame variations', 'Aged oil painting textures', 'Lightweight props']
      },
      tags: ['3ds Max', 'Substance', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/0XXWLV' }]
    },
    {
      id: 17,
      title: 'Low Poly Boxes & Cards',
      icon: '❖',
      date: '2018',
      category: 'props',
      genre: { es: 'Props Low Poly', en: 'Low Poly Props' },
      description: {
        es: 'Cajas de cartón y cartas de papel optimizadas para rendimiento en Insomnis.',
        en: 'Cardboard boxes and paper cards optimized for high performance in Insomnis.'
      },
      highlights: {
        es: ['Ultra low poly', 'Atlases de textura compactos', 'Físicas integradas'],
        en: ['Ultra low poly', 'Compact texture atlases', 'Physics ready']
      },
      tags: ['3ds Max', 'Low Poly', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/588GPJ' }]
    },
    {
      id: 18,
      title: 'Laptop Hard Surface',
      icon: '⚙',
      date: '2018',
      category: 'props',
      genre: { es: 'Hard Surface', en: 'Hard Surface' },
      description: {
        es: 'Portátil modelado hard surface con detalle de puertos, teclado y bisagras.',
        en: 'Hard surface laptop modeled with port, keyboard and hinge detail.'
      },
      highlights: {
        es: ['Hard surface preciso', 'Materiales PBR metálicos y plásticos', 'Render Marmoset'],
        en: ['Precise hard surface', 'Metallic & plastic PBR materials', 'Marmoset render']
      },
      tags: ['3ds Max', 'Substance', 'Hard Surface'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/zoAZ4' }]
    },
    {
      id: 19,
      title: 'Old Cage',
      icon: '✦',
      date: '2017',
      category: 'props',
      genre: { es: 'Prop / Terror', en: 'Prop / Horror' },
      description: {
        es: 'Jaula metálica con óxido y pátina de época para Insomnis.',
        en: 'Metal cage with rust and period patina for Insomnis.'
      },
      highlights: {
        es: ['Modelado de barrotes y cerradura', 'Texturas de óxido realista', 'Ambiente tétrico'],
        en: ['Bars and lock modeling', 'Realistic rust textures', 'Gloomy atmosphere']
      },
      tags: ['3ds Max', 'Substance', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/qR5wR' }]
    },
    {
      id: 20,
      title: 'Temple Scene',
      icon: '🏛',
      date: '2017',
      category: 'env',
      genre: { es: 'Escena / Entorno', en: 'Scene / Environment' },
      description: {
        es: 'Escena de templo antiguo con columnas de piedra e iluminación volumétrica dramática.',
        en: 'Ancient temple scene with stone columns and dramatic volumetric lighting.'
      },
      highlights: {
        es: ['Composición e iluminación volumétrica', 'Modelado arquitectónico', 'Atmósfera'],
        en: ['Composition & volumetric lighting', 'Architectural modeling', 'Atmosphere']
      },
      tags: ['3ds Max', 'Substance', 'Environment'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/KByVx' }]
    }
  ]

  const projects = useMemo(
    () =>
      projectsDef.map((p) => ({
        ...p,
        genre: p.genre[lang],
        description: p.description[lang],
        highlights: p.highlights ? p.highlights[lang] : [],
        links: p.links || []
      })),
    [lang]
  )

  const filteredProjects = useMemo(() => {
    if (currentFilter === 'all') return projects
    return projects.filter((p) => p.category === currentFilter)
  }, [currentFilter, projects])

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProjects, currentPage])

  const handleFilterChange = (filterId) => {
    setCurrentFilter(filterId)
    setCurrentPage(1)
  }

  const hasArtStationLink = activeProject
    ? activeProject.links.some((l) => l.url.includes('artstation.com'))
    : false

  return (
    <div className="projects-container glass-panel">
      {/* Header */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>{vaultLabel} // {filteredProjects.length} PRODUCCIONES</span>
        </div>
        <div className="filter-group">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn ${currentFilter === f.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact 3x2 Grid */}
      <div className="projects-compact-grid">
        {paginatedProjects.map((project) => (
          <div
            key={project.id}
            className="project-compact-card"
            onClick={() => setActiveProject(project)}
          >
            <div className="card-top">
              <span className="project-icon">{project.icon}</span>
              <span className="genre-mini-pill">{project.genre}</span>
              <span className="date-tag">{project.date}</span>
            </div>

            <h3 className="project-title">{project.title}</h3>
            <p className="project-summary">{project.description}</p>

            <div className="card-bottom">
              <div className="mini-tags">
                {project.tags.slice(0, 2).map((t) => (
                  <span key={t} className="mini-tag">{t}</span>
                ))}
              </div>
              <span className="inspect-btn">Ver ↗</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="page-nav-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </button>
          <div className="page-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`page-dot ${currentPage === idx + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(idx + 1)}
                aria-label={`Página ${idx + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="page-nav-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </button>
        </div>
      )}

      {/* Modal */}
      {activeProject && (
        <div className="modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-tag">
                  {activeProject.genre} &bull; {activeProject.date}
                </span>
                <h2 className="modal-title">{activeProject.title}</h2>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setActiveProject(null)}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">{activeProject.description}</p>

              {activeProject.highlights && activeProject.highlights.length > 0 && (
                <div className="modal-highlights">
                  <h4 className="highlights-title">{highlightsLabel}:</h4>
                  <ul className="highlights-list">
                    {activeProject.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-tags-row">
                {activeProject.tags.map((tag) => (
                  <span key={tag} className="modal-tag-chip">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Link Buttons */}
              <div className="modal-actions">
                {!activeProject.links.length && <p className="no-link">{noLinkLabel}</p>}
                {activeProject.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn link-btn"
                    onClick={triggerConfetti}
                  >
                    <span>{link.label}</span>
                    <span className="external-icon">↗</span>
                  </a>
                ))}

                {hasArtStationLink && (
                  <a
                    href={artStationProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn fallback-btn"
                    onClick={triggerConfetti}
                  >
                    <span>{artStationProfileLabel}</span>
                    <span className="external-icon">↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
