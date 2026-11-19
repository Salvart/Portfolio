import React, { useState, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { useI18n } from '../../utils/i18n.jsx'
import './ProjectsSection.css'

export default function ProjectsSection() {
  const { lang, t } = useI18n()
  const [activeProject, setActiveProject] = useState(null)
  const [currentFilter, setCurrentFilter] = useState('all')

  const artStationProfile = 'https://www.artstation.com/salv_art'
  const artStationProfileLabel = t('Ver Perfil en ArtStation', 'View ArtStation Profile')
  const vaultLabel = t('PROYECTOS & PRODUCCIONES', 'PROJECTS & PRODUCTIONS')
  const noLinkLabel = t('No hay enlace directo disponible', 'No direct link available')
  const viewDetailsLabel = t('Ver Detalles', 'View Details')
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
      tags: ['Unreal Engine 4', '3ds Max', 'ZBrush', 'Substance', 'Rigging'],
      links: [
        { label: 'PlayStation Store', url: 'https://store.playstation.com/es-es/product/EP0811-CUSA25829_00-6756474835074646' },
        { label: 'Nintendo Switch', url: 'https://www.nintendo.com/es-es/Juegos/Programas-descargables-Nintendo-Switch/Insomnis-2281154.html?srsltid=AfmBOoqsdivojGRs0CYNu4T8-pkKgbf9J1dJqWRYVnTtNj9HADPuuLJP' },
        { label: 'Steam', url: 'https://store.steampowered.com/app/1000700/Insomnis/?l=spanish' },
        { label: 'ArtStation', url: 'https://www.artstation.com/artwork/Oygnvy' }
      ]
    },
    {
      id: 2,
      title: 'WEWORK FACTORY',
      icon: '◈',
      date: '2023',
      category: 'env',
      genre: { es: 'Escenas Demo Quixel / Entorno', en: 'Quixel Demo Scenes / Environment' },
      description: {
        es: 'Escenas demo de entorno con Quixel Megascans de la WeWork Factory: creación de escenarios modulares con iluminación y material setup para su visualización en tiempo real.',
        en: 'Environment demo scenes with Quixel Megascans of the WeWork Factory: creation of modular sets with lighting and material setup for real-time visualization.'
      },
      highlights: {
        es: [
          'Montaje de escenas con Quixel Megascans',
          'Entornos modulares para visualización en tiempo real',
          'Iluminación y set-up de materiales',
          'Optimización gráfica en Unreal Engine'
        ],
        en: [
          'Scene assembly with Quixel Megascans',
          'Modular environments for real-time visualization',
          'Lighting and material setup',
          'Graphical optimization in Unreal Engine'
        ]
      },
      tags: ['Unreal Engine', 'Quixel', '3ds Max', 'Material Setup'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/w8zvNV' }]
    },
    {
      id: 3,
      title: 'Warzone Abandoned',
      icon: '★',
      date: '2023',
      category: 'env',
      genre: { es: 'Environment Art', en: 'Environment Art' },
      description: {
        es: 'Entorno bélico abandonado: modelado de escenario y props, composición de iluminación dramática y texturizado para conseguir una atmósfera de guerra post-apocalíptica.',
        en: 'Abandoned war environment: set and props modeling, dramatic lighting composition and texturing to achieve a post-apocalyptic war atmosphere.'
      },
      highlights: {
        es: [
          'Escenario y props de zona de guerra',
          'Iluminación dramática y atmósfera',
          'Modelado + texturizado completo',
          'Presentado en ArtStation'
        ],
        en: [
          'War zone set and props',
          'Dramatic lighting and atmosphere',
          'Full modeling + texturing',
          'Featured on ArtStation'
        ]
      },
      tags: ['3ds Max', 'ZBrush', 'Substance', 'Unreal Engine'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/1xL1wZ' }]
    },
    {
      id: 4,
      title: 'Medical Horror Kit',
      icon: '❖',
      date: '2021',
      category: 'props',
      genre: { es: 'Props / Pack de Terror', en: 'Props / Horror Asset Pack' },
      description: {
        es: 'Kit de props médicos con estética de terror, diseñados para el universo de INSOMNIS: instrumental quirúrgico envejecido y mobiliario hospitalario de alta poligonización.',
        en: 'Medical props kit with a horror aesthetic, designed for the INSOMNIS universe: aged surgical instruments and high-poly hospital furniture.'
      },
      highlights: {
        es: [
          'Instrumental médico horror y mobiliario',
          'High poly con detalle de desgaste',
          'Texturizado PBR en Substance Painter',
          'Render de presentación en Marmoset'
        ],
        en: [
          'Horror medical instruments and furniture',
          'High poly with wear detail',
          'PBR texturing in Substance Painter',
          'Presentation render in Marmoset'
        ]
      },
      tags: ['3ds Max', 'ZBrush', 'Substance Painter', 'Marmoset'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/klZ0bd' }]
    },
    {
      id: 5,
      title: 'Apartment Level VR',
      icon: '◈',
      date: '2018',
      category: 'games',
      genre: { es: 'Entorno VR', en: 'VR Environment' },
      description: {
        es: 'Nivel de apartamento para realidad virtual desarrollado durante mi etapa en LEVEL-VR: modelado, texturizado con Substance y optimización gráfica para UE4.',
        en: 'Apartment level for virtual reality developed during my time at LEVEL-VR: modeling, Substance texturing and graphical optimization for UE4.'
      },
      highlights: {
        es: [
          'Escenario VR de apartamento',
          'Modelado 3D y texturizado Substance',
          'Materiales de arquitectura en Unreal',
          'Optimización gráfica para VR'
        ],
        en: [
          'VR apartment environment',
          '3D modeling and Substance texturing',
          'Architecture materials in Unreal',
          'Graphical optimization for VR'
        ]
      },
      tags: ['Unreal Engine 4', '3ds Max', 'Substance', 'VR'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Yk2yb' }]
    },
    {
      id: 6,
      title: 'Valdecarros Digital Twin (PPG Studios)',
      icon: '⚙',
      date: '2023 - Actualidad',
      category: 'games',
      genre: { es: 'Gemelo Digital / Arquitectura en Tiempo Real', en: 'Digital Twin / Real-Time Architecture' },
      description: {
        es: 'Gemelo digital creado con Unreal Engine 5 para el proyecto de construcción del barrio de Valdecarros, el primer desarrollo urbano que puede recorrerse virtualmente. Rol de Senior Technical Artist / Programador de software.',
        en: 'Digital twin created with Unreal Engine 5 for the construction project of the Valdecarros neighborhood, the first urban development that can be toured virtually. Role of Senior Technical Artist / Software Programmer.'
      },
      highlights: {
        es: [
          'Gemelo digital en Unreal Engine 5',
          'Primer desarrollo urbano que puede recorrerse virtualmente',
          'Aplicaciones de visualización con base de datos para clientes',
          'Rol: Senior Technical Artist / Programador de software'
        ],
        en: [
          'Digital twin in Unreal Engine 5',
          'First urban development that can be toured virtually',
          'Visualization applications with client database',
          'Role: Senior Technical Artist / Software Programmer'
        ]
      },
      tags: ['Unreal Engine 5', '3ds Max', 'SQL Server', 'C++', 'Python', 'React'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Rq36kA' }]
    },
    {
      id: 7,
      title: 'M4A1 Assault Rifle',
      icon: '✦',
      date: '2023',
      category: 'props',
      genre: { es: 'Modelo de Arma / Hard Surface', en: 'Weapon Model / Hard Surface' },
      description: {
        es: 'Modelo high y low poly del fusil M4A1: modelado hard surface, texturizado PBR y render de presentación.',
        en: 'High and low poly model of the M4A1 rifle: hard surface modeling, PBR texturing and presentation render.'
      },
      highlights: {
        es: ['Modelado hard surface', 'Low poly con bake de texturas', 'Texturizado PBR en Substance Painter'],
        en: ['Hard surface modeling', 'Low poly with texture baking', 'PBR texturing in Substance Painter']
      },
      tags: ['3ds Max', 'ZBrush', 'Substance Painter', 'Hard Surface'],
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
        es: ['Modelado low poly', 'Topología optimizada para juegos', 'Unwrap de UVs'],
        en: ['Low poly modeling', 'Game-ready topology', 'UV unwrapping']
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
      genre: { es: 'Comercial / Animación TV', en: 'Commercial / Christmas Animation' },
      description: {
        es: 'Participación en el anuncio de Navidad de Campofrío: creación de entornos y props navideños para el spot publicitario.',
        en: 'Work on the Campofrío Christmas ad: creation of Christmas environments and props for the commercial spot.'
      },
      highlights: {
        es: ['Entornos y props para spot publicitario', 'Estética navideña retro', 'Producción para TV'],
        en: ['Environments and props for a TV spot', 'Retro Christmas aesthetic', 'TV production']
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
        es: 'Versión navideña nevada del entorno de WEWORK Factory: nieve, decoración navideña e iluminación festiva.',
        en: 'Snowy Christmas version of the WEWORK Factory environment: snow, Christmas decoration and festive lighting.'
      },
      highlights: {
        es: ['Escena invernal con nieve', 'Decoración navideña', 'Iluminación festiva'],
        en: ['Winter scene with snow', 'Christmas decoration', 'Festive lighting']
      },
      tags: ['Unreal Engine', 'Quixel', '3ds Max', 'Iluminación'],
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
        es: 'Props especiales de la edición de Halloween de Insomnis: objetos de terror con estética envejecida.',
        en: 'Special props for the Halloween edition of Insomnis: horror props with an aged aesthetic.'
      },
      highlights: {
        es: ['Props temáticos de Halloween', 'Texturizado envejecido', 'Ambientación de terror'],
        en: ['Halloween themed props', 'Aged texturing', 'Horror atmosphere']
      },
      tags: ['3ds Max', 'Substance', 'Insomnis', 'Props'],
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
        es: 'Proyector antiguo para el universo de Insomnis: modelado detallado y texturizado con desgaste del tiempo.',
        en: 'Old projector for the Insomnis universe: detailed modeling and aged texturing.'
      },
      highlights: {
        es: ['Prop high poly detallado', 'Texturizado de desgaste', 'Integrado en Insomnis'],
        en: ['Detailed high poly prop', 'Wear texturing', 'Integrated in Insomnis']
      },
      tags: ['3ds Max', 'ZBrush', 'Substance', 'Insomnis'],
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
        es: 'Colección de puertas antiguas para la mansión de Insomnis: modelado y texturizado con aspecto deteriorado.',
        en: 'Collection of old doors for the Insomnis mansion: modeling and texturing with a weathered look.'
      },
      highlights: {
        es: ['Varias puertas con variaciones', 'Estética deteriorada', 'Listas para el juego'],
        en: ['Multiple door variations', 'Weathered aesthetic', 'Game-ready']
      },
      tags: ['3ds Max', 'Substance', 'Insomnis', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Qzz4Nx' }]
    },
    {
      id: 14,
      title: 'Old Lamps – Insomnis',
      icon: '✦',
      date: '2018',
      category: 'props',
      genre: { es: 'Props / Insomnis', en: 'Props / Insomnis' },
      description: {
        es: 'Lámparas antiguas para Insomnis: props de iluminación con materiales y desgaste de época.',
        en: 'Old lamps for Insomnis: lighting props with period materials and wear.'
      },
      highlights: {
        es: ['Props de iluminación antiguos', 'Materiales de época', 'Texturizado con desgaste'],
        en: ['Old lighting props', 'Period materials', 'Aged texturing']
      },
      tags: ['3ds Max', 'Substance', 'Insomnis', 'Props'],
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
        es: 'Entorno modular creado en Unreal Engine 4: kit de piezas para construir escenarios de forma flexible y optimizada.',
        en: 'Modular environment built in Unreal Engine 4: a kit of pieces to build sets flexibly and efficiently.'
      },
      highlights: {
        es: ['Kit modular de piezas', 'Ensamblaje en UE4', 'Optimización de assets'],
        en: ['Modular kit of pieces', 'UE4 assembly', 'Asset optimization']
      },
      tags: ['Unreal Engine 4', '3ds Max', 'Modular', 'Environment'],
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
        es: 'Marcos antiguos para las paredes de la mansión de Insomnis: variaciones con cuadros y texturizado desgastado.',
        en: 'Old frames for the walls of the Insomnis mansion: variations with paintings and weathered texturing.'
      },
      highlights: {
        es: ['Marcos con variaciones', 'Cuadros integrados', 'Estética desgastada'],
        en: ['Frames with variations', 'Integrated paintings', 'Weathered aesthetic']
      },
      tags: ['3ds Max', 'Substance', 'Insomnis', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/0XXWLV' }]
    },
    {
      id: 17,
      title: 'Low Poly Cardboard Boxes & Paper Cards',
      icon: '❖',
      date: '2018',
      category: 'props',
      genre: { es: 'Props Low Poly / Insomnis', en: 'Low Poly Props / Insomnis' },
      description: {
        es: 'Cajas de cartón y cartas de papel low poly para Insomnis: props ligeros y optimizados para el juego.',
        en: 'Low poly cardboard boxes and paper cards for Insomnis: light props optimized for the game.'
      },
      highlights: {
        es: ['Props low poly', 'Cajas y cartas de papel', 'Optimizados para juegos'],
        en: ['Low poly props', 'Boxes and paper cards', 'Game optimized']
      },
      tags: ['3ds Max', 'Low Poly', 'Insomnis', 'Props'],
      links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/588GPJ' }]
    },
    {
      id: 18,
      title: 'Laptop Hard Surface',
      icon: '⚙',
      date: '2018',
      category: 'props',
      genre: { es: 'Prop / Hard Surface', en: 'Prop / Hard Surface' },
      description: {
        es: 'Portátil modelado como prop hard surface: detalle de teclado, bisagras y texturizado realista.',
        en: 'Laptop modeled as a hard surface prop: keyboard detail, hinges and realistic texturing.'
      },
      highlights: {
        es: ['Modelado hard surface', 'Detalle de teclado y bisagras', 'Texturizado realista'],
        en: ['Hard surface modeling', 'Keyboard and hinge detail', 'Realistic texturing']
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
      genre: { es: 'Prop / Insomnis', en: 'Prop / Insomnis' },
      description: {
        es: 'Jaula antigua para Insomnis: prop metálico con óxido y detalle de época.',
        en: 'Old cage for Insomnis: metal prop with rust and period detail.'
      },
      highlights: {
        es: ['Prop metálico detallado', 'Texturizado con óxido', 'Estética de época'],
        en: ['Detailed metal prop', 'Rust texturing', 'Period aesthetic']
      },
      tags: ['3ds Max', 'Substance', 'Insomnis', 'Props'],
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
        es: 'Escena de templo antiguo: composición de entorno con columnas, iluminación volumétrica y atmósfera.',
        en: 'Ancient temple scene: environment composition with columns, volumetric lighting and atmosphere.'
      },
      highlights: {
        es: ['Entorno de templo antiguo', 'Iluminación volumétrica', 'Composición de escena'],
        en: ['Ancient temple environment', 'Volumetric lighting', 'Scene composition']
      },
      tags: ['3ds Max', 'Substance', 'Environment', 'Iluminación'],
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

  const hasArtStationLink = activeProject
    ? activeProject.links.some((l) => l.url.includes('artstation.com'))
    : false

  return (
    <div className="projects-container glass-panel">
      {/* Header Badge */}
      <div className="card-header">
        <div className="tech-badge">
          <span className="pulse-dot"></span>
          <span>VAULT // {projects.length} {vaultLabel}</span>
        </div>
        <div className="filter-group">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn ${currentFilter === f.id ? 'active' : ''}`}
              onClick={() => setCurrentFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => setActiveProject(project)}
          >
            <div className="card-top">
              <div className="card-identity">
                <span className="project-icon">{project.icon}</span>
                <span className="project-date">{project.date}</span>
              </div>
              <span className="genre-pill">{project.genre}</span>
            </div>

            <div className="card-main">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
            </div>

            <div className="card-tags">
              {project.tags.slice(0, 3).map((t) => (
                <span key={t} className="project-tag">
                  {t}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="project-tag more-tag">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>

            <div className="card-footer">
              <span className="inspect-text">
                <span>{viewDetailsLabel}</span>
                <span className="arrow-icon">→</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
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
