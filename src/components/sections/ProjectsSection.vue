<template>
  <div class="projects-section">
    <!-- Header -->
    <div class="section-badge">
      <span class="badge-title">GAME VAULT ({{ vaultLabel }})</span>
      <span class="badge-level">GAMES: {{ projects.length }}</span>
    </div>

    <!-- Cartridge Grid -->
    <div class="projects-grid">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="cartridge-card"
        @click="selectProject(project)"
      >
        <!-- Game Boy Cartridge Shape -->
        <div class="cartridge-top">
          <span class="notch"></span>
          <span class="cart-label">GAME CARTRIDGE</span>
        </div>

        <div class="cartridge-body">
          <div class="cart-sticker">
            <div class="sticker-art">
              <span class="art-emoji">{{ project.icon }}</span>
            </div>
            <div class="sticker-meta">
              <h4 class="project-title">{{ project.title }}</h4>
              <span class="project-genre">{{ project.genre }}</span>
            </div>
          </div>

          <div class="cart-footer">
            <span class="tech-tag" v-for="t in project.tags.slice(0, 2)" :key="t">{{ t }}</span>
            <span class="play-btn">PRESS A ▶</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Detail Modal (Game Screen View) -->
    <div v-if="activeProject" class="modal-overlay" @click.self="activeProject = null">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title">▶ {{ activeProject.title }}</span>
          <button class="close-btn" @click="activeProject = null">✖ ESC</button>
        </div>

        <div class="modal-body">
          <div class="preview-banner">
            <span class="banner-icon">{{ activeProject.icon }}</span>
            <div class="banner-info">
              <span class="banner-genre">{{ activeProject.genre }}</span>
              <span class="banner-date">{{ activeProject.date }}</span>
            </div>
          </div>

          <p class="project-description">{{ activeProject.description }}</p>

          <div class="highlights-box">
            <span class="box-label">{{ keyFeaturesLabel }}:</span>
            <ul class="highlights-list">
              <li v-for="h in activeProject.highlights" :key="h">✔ {{ h }}</li>
            </ul>
          </div>

          <div class="tech-stack-row">
            <span class="stack-label">STACK:</span>
            <div class="stack-chips">
              <span class="chip" v-for="tag in activeProject.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <a 
            :href="activeProject.demoUrl !== '#' ? activeProject.demoUrl : null" 
            :target="activeProject.demoUrl !== '#' ? '_blank' : null"
            rel="noopener noreferrer"
            class="action-btn demo-btn"
            :class="{ disabled: activeProject.demoUrl === '#' }"
            @click="activeProject.demoUrl !== '#' ? triggerConfetti() : null"
          >
            🚀 {{ demoLabel }}
          </a>
          <a 
            :href="activeProject.repoUrl !== 'https://github.com' ? activeProject.repoUrl : null"
            :target="activeProject.repoUrl !== 'https://github.com' ? '_blank' : null"
            rel="noopener noreferrer"
            class="action-btn repo-btn"
            :class="{ disabled: activeProject.repoUrl === 'https://github.com' }"
          >
            👾 {{ sourceCodeLabel }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import { lang, t } from '../../utils/i18n.js'

const activeProject = ref(null)

const vaultLabel = t('PROYECTOS', 'PROJECTS')
const keyFeaturesLabel = t('CARACTERÍSTICAS CLAVE', 'KEY FEATURES')
const demoLabel = t('PROBAR DEMO', 'TRY DEMO')
const sourceCodeLabel = t('CÓDIGO FUENTE', 'SOURCE CODE')

function selectProject(proj) {
  activeProject.value = proj
}

function triggerConfetti() {
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
    icon: '👻',
    date: '2021',
    genre: { es: 'Juego de Terror / Environment Art', en: 'Horror Game / Environment Art' },
    description: {
      es: 'Videojuego de terror publicado en PlayStation 4, PlayStation 5 y Steam (oct 2021 / ene 2022) en el que trabajé como Environment Artist creando los escenarios y props de la mansión encantada.',
      en: 'Horror game published on PlayStation 4, PlayStation 5 and Steam (Oct 2021 / Jan 2022) where I worked as an Environment Artist creating the sets and props of the haunted mansion.'
    },
    highlights: {
      es: [
        'Modelado High & Low Poly de escenarios y props de terror',
        'Texturizado, rigging, shaders y animación de props',
        'Pipeline completo en Unreal Engine 4',
        'Publicado en PS4, PS5 y Steam'
      ],
      en: [
        'High & Low Poly modeling of horror sets and props',
        'Texturing, rigging, shaders and prop animation',
        'Full pipeline in Unreal Engine 4',
        'Published on PS4, PS5 and Steam'
      ]
    },
    tags: ['Unreal Engine 4', '3ds Max', 'ZBrush', 'Substance', 'Rigging'],
    demoUrl: '#',
    repoUrl: 'https://github.com'
  },
  {
    id: 2,
    title: 'WEWORK FACTORY',
    icon: '🏢',
    date: '2023',
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
    demoUrl: '#',
    repoUrl: 'https://github.com'
  },
  {
    id: 3,
    title: 'Warzone Abandoned',
    icon: '🎖️',
    date: '2023',
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
    demoUrl: '#',
    repoUrl: 'https://github.com'
  },
  {
    id: 4,
    title: 'Medical Horror Kit',
    icon: '🏥',
    date: '2021',
    genre: { es: 'Props / Pack de Activos de Terror', en: 'Props / Horror Asset Pack' },
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
    demoUrl: '#',
    repoUrl: 'https://github.com'
  },
  {
    id: 5,
    title: 'Apartment Level VR',
    icon: '🥽',
    date: '2018',
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
    demoUrl: '#',
    repoUrl: 'https://github.com'
  }
]

const projects = computed(() =>
  projectsDef.map((p) => ({
    ...p,
    genre: p.genre[lang.value],
    description: p.description[lang.value],
    highlights: p.highlights[lang.value]
  }))
)
</script>

<style scoped>
.projects-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--bg-darkest);
}

.section-badge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 8px 12px;
  border-radius: 3px;
  font-size: 13px;
  border: 2px solid var(--bg-dark);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.cartridge-card {
  background: rgba(0, 0, 0, 0.06);
  border: 3px solid var(--bg-darkest);
  border-radius: 6px 6px 4px 4px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cartridge-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 0 var(--bg-darkest);
}

.cartridge-top {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 5px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 8px;
}

.cartridge-top .notch {
  width: 14px;
  height: 5px;
  background: var(--bg-dark);
  border-radius: 1px;
}

.cartridge-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-sticker {
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(0, 0, 0, 0.05);
  border: 1px dashed var(--bg-darkest);
  padding: 8px;
}

.sticker-art {
  width: 40px;
  height: 40px;
  background: var(--bg-darkest);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.art-emoji {
  font-size: 20px;
}

.sticker-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-title {
  font-size: 11px;
  color: var(--bg-darkest);
}

.project-genre {
  font-size: 9px;
  opacity: 0.85;
}

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
}

.tech-tag {
  background: var(--bg-dark);
  color: var(--bg-lightest);
  padding: 2px 5px;
  border-radius: 2px;
}

.play-btn {
  font-weight: bold;
  color: var(--bg-darkest);
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 14px;
}

.modal-content {
  background: var(--bg-lightest);
  border: 4px solid var(--bg-darkest);
  max-width: 520px;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 8px 8px 0 var(--bg-darkest);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 8px 12px;
  font-size: 12px;
}

.close-btn {
  font-family: var(--font-pixel);
  font-size: 10px;
  background: transparent;
  color: var(--bg-lightest);
  border: none;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border: 2px solid var(--bg-darkest);
}

.banner-icon {
  font-size: 28px;
}

.banner-info {
  display: flex;
  flex-direction: column;
  font-size: 10px;
}

.project-description {
  font-size: 11px;
  line-height: 1.5;
}

.highlights-box {
  background: rgba(0, 0, 0, 0.04);
  padding: 8px;
  border: 1px dashed var(--bg-darkest);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.box-label {
  font-size: 10px;
  font-weight: bold;
}

.highlights-list {
  list-style: none;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tech-stack-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
}

.stack-label {
  font-weight: bold;
}

.stack-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 3px 6px;
  border-radius: 2px;
  font-size: 9px;
}

.modal-footer {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  font-family: var(--font-pixel);
  font-size: 10px;
  text-align: center;
  padding: 10px;
  text-decoration: none;
  border: 2px solid var(--bg-darkest);
  cursor: pointer;
  transition: all 0.1s ease;
}

.demo-btn {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
}

.repo-btn {
  background: transparent;
  color: var(--bg-darkest);
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
