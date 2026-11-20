// Contenido del portfolio. Es la única fuente de texto de la web.
// Cada chip de la placa corresponde a una entrada de este array.

export const sections = [
  {
    id: 'intro',
    chip: 'cpu',
    name: { es: 'Introducción', en: 'Introduction' },
    layout: 'vertical',
    top: {
      es: ['SALVADOR RUIZ', 'Technical Artist & Software Programmer'],
      en: ['SALVADOR RUIZ', 'Technical Artist & Software Programmer']
    },
    bottom: {
      es: [
        'Apasionado por los videojuegos, el arte 3D y el código limpio.',
        'Madrid, España · Disponible para proyectos'
      ],
      en: [
        'Passionate about games, 3D art and clean code.',
        'Madrid, Spain · Available for projects'
      ]
    }
  },
  {
    id: 'profile',
    chip: 'graphics',
    name: { es: 'Perfil y stack', en: 'Profile & stack' },
    layout: 'horizontal',
    left: {
      label: { es: 'PERFIL', en: 'PROFILE' },
      lines: {
        es: [
          'Desarrollador y Technical Artist especializado en la convergencia entre programación y arte 3D. Experiencia integral con C++, Blueprints, Unreal Engine, Unity y tecnologías web modernas.',
          'Combino modelado de alta fidelidad, shaders y optimización gráfica con arquitectura de software limpia.'
        ],
        en: [
          'Developer and Technical Artist specialized in the convergence of programming and 3D art. Full-pipeline experience with C++, Blueprints, Unreal Engine, Unity and modern web technologies.',
          'I combine high-fidelity 3D modeling, shaders and real-time graphics optimization with clean software architecture.'
        ]
      }
    },
    right: {
      label: { es: 'STACK', en: 'STACK' },
      lines: {
        es: [
          '3D Y MOTORES — Unreal Engine 4/5 · Unity · 3ds Max · ZBrush · Substance Painter · High/Low Poly · Rigging · Shaders',
          'CÓDIGO — C++ · C# · TypeScript · React · Vue 3 · Node.js · SQL · REST APIs',
          'HERRAMIENTAS — Git · Vite · Marmoset · Figma · Photoshop · After Effects'
        ],
        en: [
          '3D & ENGINES — Unreal Engine 4/5 · Unity · 3ds Max · ZBrush · Substance Painter · High/Low Poly · Rigging · Shaders',
          'CODE — C++ · C# · TypeScript · React · Vue 3 · Node.js · SQL · REST APIs',
          'TOOLS — Git · Vite · Marmoset · Figma · Photoshop · After Effects'
        ]
      }
    }
  },
  {
    id: 'studies',
    chip: 'memory',
    name: { es: 'Formación', en: 'Education' },
    layout: 'horizontal',
    left: {
      label: { es: 'FORMACIÓN', en: 'EDUCATION' },
      lines: {
        es: ['Tres titulaciones entre hardware, redes y desarrollo de videojuegos.'],
        en: ['Three degrees across hardware, networks and game development.']
      }
    },
    right: {
      label: { es: 'TRAYECTORIA', en: 'BACKGROUND' },
      studies: [
        {
          period: '2011 — 2017',
          title: {
            es: 'Diseño y Desarrollo de Videojuegos · ESNE',
            en: 'Game Design & Development · ESNE'
          },
          detail: {
            es: 'C++/C#, Unreal Engine, Unity, 3ds Max y ZBrush.',
            en: 'C++/C#, Unreal Engine, Unity, 3ds Max and ZBrush.'
          }
        },
        {
          period: '2008 — 2010',
          title: {
            es: 'Equipos Electrónicos de Consumo · I.E.S. Santa María del Castillo',
            en: 'Consumer Electronic Equipment · I.E.S. Santa María del Castillo'
          },
          detail: {
            es: 'Hardware, soldadura PCB de precisión y diagnóstico de circuitos.',
            en: 'Hardware, precision PCB soldering and circuit diagnostics.'
          }
        },
        {
          period: '2007 — 2009',
          title: {
            es: 'Administración de Sistemas en Red (ASIR)',
            en: 'Network Systems Administration (ASIR)'
          },
          detail: {
            es: 'Servidores, redes, seguridad y bases de datos.',
            en: 'Servers, networking, security and databases.'
          }
        }
      ]
    }
  },
  {
    id: 'projects',
    chip: 'io',
    name: { es: 'Proyectos', en: 'Projects' },
    layout: 'horizontal',
    left: {
      label: { es: 'PROYECTOS', en: 'PROJECTS' },
      lines: {
        es: ['Una selección de trabajos comerciales y personales como Technical Artist y programador.'],
        en: ['A selection of commercial and personal work as Technical Artist and programmer.']
      },
      link: {
        label: { es: 'ArtStation completo ↗', en: 'Full ArtStation ↗' },
        url: 'https://www.artstation.com/salv_art'
      }
    },
    right: {
      label: { es: 'DESTACADOS', en: 'SELECTED' },
      projects: [
        {
          title: 'INSOMNIS',
          year: '2021',
          links: [
            { label: 'PlayStation', url: 'https://store.playstation.com/es-es/product/EP0811-CUSA25829_00-6756474835074646' },
            { label: 'Steam', url: 'https://store.steampowered.com/app/1000700/Insomnis/?l=spanish' },
            { label: 'Switch', url: 'https://www.nintendo.com/es-es/Juegos/Programas-descargables-Nintendo-Switch/Insomnis-2281154.html' }
          ]
        },
        {
          title: 'Valdecarros Digital Twin',
          year: '2023',
          links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Rq36kA' }]
        },
        {
          title: 'WEWORK FACTORY',
          year: '2023',
          links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/w8zvNV' }]
        },
        {
          title: 'Warzone Abandoned',
          year: '2023',
          links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/1xL1wZ' }]
        },
        {
          title: 'Medical Horror Kit',
          year: '2021',
          links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/klZ0bd' }]
        },
        {
          title: 'Apartment Level VR',
          year: '2018',
          links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/Yk2yb' }]
        },
        {
          title: 'M4A1 Assault Rifle',
          year: '2023',
          links: [{ label: 'ArtStation', url: 'https://www.artstation.com/artwork/4JzRW' }]
        }
      ],
      more: {
        es: '+ otros 13 trabajos en ArtStation',
        en: '+ 13 more works on ArtStation'
      }
    }
  }
]

export const sectionCount = sections.length
