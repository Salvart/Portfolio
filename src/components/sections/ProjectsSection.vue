<template>
  <div class="projects-section">
    <!-- Header -->
    <div class="section-badge">
      <span class="badge-title">GAME VAULT (PROYECTOS)</span>
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
            <span class="box-label">CARACTERÍSTICAS CLAVE:</span>
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
          <a :href="activeProject.demoUrl" target="_blank" class="action-btn demo-btn" @click="triggerConfetti">
            🚀 PROBAR DEMO
          </a>
          <a :href="activeProject.repoUrl" target="_blank" class="action-btn repo-btn">
            👾 CÓDIGO SOURCE
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import confetti from 'canvas-confetti'

const activeProject = ref(null)

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

const projects = [
  {
    id: 1,
    title: 'Retro Arcade Portfolio',
    genre: 'Web Application / Canvas',
    icon: '👾',
    date: '2024',
    description: 'Portfolio interactivo en 8-bit inspirado en la clásica consola Game Boy con física de personaje, scroll parallax sincronizado y síntesis de sonido Web Audio.',
    highlights: [
      'Animación de caminata 60 FPS con Sprite / Canvas loop',
      'Desplazamiento horizontal de fondo sincronizado con clics',
      'Efectos de sonido 8-bit sintetizados dinámicamente',
      'Diseño responsivo con carcasas retro intercambiables'
    ],
    tags: ['Vue 3', 'Vite', 'Web Audio API', 'Canvas', 'CSS Pixel'],
    demoUrl: '#',
    repoUrl: 'https://github.com'
  },
  {
    id: 2,
    title: 'Pixel Quest RPG Shop',
    genre: 'E-Commerce / Interactive',
    icon: '⚔️',
    date: '2024',
    description: 'Plataforma de comercio electrónico temática con inventario de pociones y equipamiento en tiempo real, carrito de compras reactivo y animaciones retro.',
    highlights: [
      'Gestión de estado global reactiva',
      'Pasarela de pago simulada con recibo pixel-art',
      'Filtros por categoría y búsqueda instantánea',
      'Soporte completo para dispositivos móviles'
    ],
    tags: ['Vue 3', 'Pinia', 'TailwindCSS', 'REST API'],
    demoUrl: '#',
    repoUrl: 'https://github.com'
  },
  {
    id: 3,
    title: 'Task Hero Manager',
    genre: 'Productivity Tool',
    icon: '🛡️',
    date: '2023',
    description: 'Aplicación de gestión de tareas gamificada donde cada tarea completada otorga puntos de experiencia y sube de nivel a tu héroe digital.',
    highlights: [
      'Persistencia de datos en almacenamiento local y backend',
      'Sistema de logros y medallas desbloqueables',
      'Estadísticas semanales presentadas en gráficos retro',
      'Modo noche y temas personalizables'
    ],
    tags: ['JavaScript', 'Node.js', 'Express', 'LocalStorage'],
    demoUrl: '#',
    repoUrl: 'https://github.com'
  },
  {
    id: 4,
    title: 'Cyber Weather 8-Bit',
    genre: 'Weather Dashboard',
    icon: '🌧️',
    date: '2023',
    description: 'Dashboard meteorológico interactivo que muestra el clima de cualquier ciudad del mundo con animaciones de lluvia pixelada, sol o nieve.',
    highlights: [
      'Integración con OpenWeather API',
      'Geolocalización automática del usuario',
      'Animaciones de partículas meteorológicas en Canvas',
      'Pronóstico a 7 días en tarjetas retro'
    ],
    tags: ['Vue 3', 'Fetch API', 'HTML5 Canvas'],
    demoUrl: '#',
    repoUrl: 'https://github.com'
  }
]
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
</style>
