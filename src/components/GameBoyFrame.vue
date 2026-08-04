<template>
  <div :class="['fullscreen-gameboy', currentThemeClass]">
    <!-- 1. FIXED TOP HEADER BAR -->
    <header class="top-header-bar">
      <div class="header-left">
        <div class="power-indicator">
          <span :class="['power-led', { active: isPowered }]"></span>
          <span class="power-text">POWER</span>
        </div>
      </div>

      <div class="header-center">
        <h1 class="brand-main">SALVADOR RUIZ PORTFOLIO</h1>
        <span class="matrix-text">DOT MATRIX WITH STEREO SOUND</span>
      </div>

      <div class="header-right">
        <button 
          class="top-btn sound-toggle" 
          :title="soundTitle"
          @click="onToggleMute"
        >
          {{ isMuted ? '[x] MUTE' : '[+] SFX' }}
        </button>
      </div>
    </header>

    <!-- 2. MAIN FULLSCREEN LCD DISPLAY AREA (MIDDLE) -->
    <main class="main-lcd-viewport scanlines pixel-grid">
      <!-- Left Vertical Menu Box -->
      <NavigationSidebar 
        :activeIndex="activeIndex"
        :menuItems="sections"
        @select="handleMenuSelect"
      />

      <!-- Right Interactive Stage Canvas & Content -->
      <PixelStage 
        :targetIndex="activeIndex"
        :sections="sections"
        :characterAction="characterAction"
      />
    </main>

    <!-- 3. FIXED STATIC BOTTOM CONTROLS BAR (NEVER DISAPPEARS) -->
    <footer class="bottom-controls-bar">
      <div class="bar-left">
        <!-- Directional D-Pad -->
        <div class="dpad">
          <button class="dpad-btn dpad-up" @click="navigateDpad(-1)" :title="dpadUp">▲</button>
          <div class="dpad-middle">
            <button class="dpad-btn dpad-left" @click="navigateDpad(-1)" :title="dpadLeft">◀</button>
            <div class="dpad-center"></div>
            <button class="dpad-btn dpad-right" @click="navigateDpad(1)" :title="dpadRight">▶</button>
          </div>
          <button class="dpad-btn dpad-down" @click="navigateDpad(1)" :title="dpadDown">▼</button>
        </div>
      </div>

      <div class="bar-center">
        <!-- SELECT & START Pill Buttons -->
        <div class="pill-buttons">
          <div class="pill-wrapper">
            <button class="pill-btn" @click="cycleTheme">SELECT</button>
            <span class="pill-text">{{ themeLabel }} ({{ themes[currentThemeIdx].name }})</span>
          </div>
          <div class="pill-wrapper">
            <button class="pill-btn" @click="onToggleBGM">START</button>
            <span class="pill-text">{{ musicLabel }} ({{ isBgmOn ? 'ON' : 'OFF' }})</span>
          </div>
        </div>
      </div>

      <div class="bar-right">
        <!-- Action Buttons A & B -->
        <div class="action-buttons">
          <div class="btn-cluster">
            <button class="round-btn btn-b" @click="onPressB">
              <span class="btn-label">B</span>
            </button>
            <span class="btn-text">LANG: {{ langLabel }}</span>
          </div>
          <div class="btn-cluster">
            <button class="round-btn btn-a" @click="onPressA">
              <span class="btn-label">A</span>
            </button>
            <span class="btn-text">JUMP</span>
          </div>
        </div>

        <!-- Speaker Lines Grill -->
        <div class="speaker-grill">
          <div v-for="n in 5" :key="n" class="speaker-line"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavigationSidebar from './NavigationSidebar.vue'
import PixelStage from './PixelStage.vue'
import { playSelectSFX, toggleMute, toggleBGM } from '../utils/retroAudio.js'
import { lang, toggleLang, t } from '../utils/i18n.js'

const activeIndex = ref(0)
const isPowered = ref(true)
const isMuted = ref(false)
const isBgmOn = ref(false)
const characterAction = ref({ type: '', id: 0 })

const themes = [
  { id: 'dmg', name: 'DMG Green', class: '' },
  { id: 'pocket', name: 'GBP Grey', class: 'theme-pocket' },
  { id: 'gbc', name: 'GBC Purple', class: 'theme-gbc' },
  { id: 'cyber', name: 'Cyberpunk', class: 'theme-cyber' }
]

const currentThemeIdx = ref(0)
const currentThemeClass = ref('')

const sectionDefs = [
  { id: 'info', icon: '✦', name: { es: 'Información', en: 'Info' } },
  { id: 'tech', icon: '⚙', name: { es: 'Tecnologías', en: 'Tech' } },
  { id: 'studies', icon: '📜', name: { es: 'Estudios', en: 'Studies' } },
  { id: 'projects', icon: '🎮', name: { es: 'Proyectos', en: 'Projects' } }
]

const sections = computed(() =>
  sectionDefs.map((s) => ({ id: s.id, icon: s.icon, name: s.name[lang.value] }))
)

const langLabel = computed(() => (lang.value === 'es' ? 'ES' : 'EN'))
const soundTitle = computed(() => (lang.value === 'es' ? (isMuted.value ? 'Activar sonido' : 'Silenciar') : (isMuted.value ? 'Enable sound' : 'Mute')))
const dpadUp = t('Arriba', 'Up')
const dpadLeft = t('Izquierda', 'Left')
const dpadRight = t('Derecha', 'Right')
const dpadDown = t('Abajo', 'Down')
const themeLabel = t('TEMA', 'THEME')
const musicLabel = t('MÚSICA', 'MUSIC')

function handleMenuSelect(idx) {
  activeIndex.value = idx
}

function navigateDpad(dir) {
  playSelectSFX()
  const next = (activeIndex.value + dir + sections.value.length) % sections.value.length
  activeIndex.value = next
}

function onPressA() {
  characterAction.value = { type: 'jump', id: Date.now() }
}

function onPressB() {
  toggleLang()
}

function onToggleMute() {
  isMuted.value = toggleMute()
}

function onToggleBGM() {
  isBgmOn.value = toggleBGM()
}

function cycleTheme() {
  playSelectSFX()
  currentThemeIdx.value = (currentThemeIdx.value + 1) % themes.length
  currentThemeClass.value = themes[currentThemeIdx.value].class
}
</script>

<style scoped>
.fullscreen-gameboy {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--shell-color);
  overflow: hidden;
  position: relative;
}

/* 1. TOP FIXED HEADER BAR */
.top-header-bar {
  height: 64px;
  background: var(--shell-dark);
  border-bottom: 4px solid var(--shell-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  z-index: 60;
  box-shadow: 0 3px 6px rgba(0,0,0,0.3);
}

.header-left {
  display: flex;
  align-items: center;
}

.power-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
}

.power-led {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #444;
}

.power-led.active {
  background: #ff2200;
  box-shadow: 0 0 10px #ff2200;
}

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.brand-main {
  font-family: var(--font-pixel);
  font-size: 18px;
  color: var(--bg-darkest);
  text-shadow: 1px 1px 0 var(--bg-lightest);
  letter-spacing: 1px;
}

@media (max-width: 700px) {
  .brand-main {
    font-size: 13px;
  }
}

.matrix-text {
  font-size: 9px;
  color: #8b1d42;
  letter-spacing: 1px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}

.top-btn {
  font-family: var(--font-pixel);
  font-size: 11px;
  background: var(--shell-color);
  color: var(--bg-darkest);
  border: 2px solid var(--shell-border);
  padding: 7px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

/* 2. MAIN FULLSCREEN LCD VIEWPORT (MIDDLE) */
.main-lcd-viewport {
  flex: 1;
  display: flex;
  background: var(--bg-lightest);
  overflow: hidden;
  position: relative;
}

@media (max-width: 650px) {
  .main-lcd-viewport {
    flex-direction: column;
  }
}

/* 3. FIXED STATIC BOTTOM CONTROLS BAR */
.bottom-controls-bar {
  min-height: 130px;
  background: var(--shell-color);
  border-top: 4px solid var(--shell-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 36px;
  flex-shrink: 0;
  z-index: 60;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.35);
}

@media (max-width: 650px) {
  .bottom-controls-bar {
    min-height: 140px;
    padding: 12px 14px;
  }
}

.bar-left {
  display: flex;
  align-items: center;
  padding: 4px;
}

.dpad {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dpad-middle {
  display: flex;
  align-items: center;
}

.dpad-btn {
  width: 36px;
  height: 36px;
  background: #2b2b2b;
  border: 2px solid #111;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 1px 1px 0 #555;
  transition: background 0.1s ease;
}

.dpad-btn:active {
  background: #111;
}

.dpad-up { border-radius: 5px 5px 0 0; }
.dpad-down { border-radius: 0 0 5px 5px; }
.dpad-left { border-radius: 5px 0 0 5px; }
.dpad-right { border-radius: 0 5px 5px 0; }

.dpad-center {
  width: 36px;
  height: 36px;
  background: #2b2b2b;
  border: 1px solid #111;
}

.bar-center {
  display: flex;
  align-items: center;
}

.pill-buttons {
  display: flex;
  gap: 20px;
  transform: rotate(-10deg);
}

.pill-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pill-btn {
  font-family: var(--font-pixel);
  font-size: 8px;
  background: #777b8e;
  border: 2px solid #3d404d;
  color: #fff;
  width: 55px;
  height: 16px;
  border-radius: 8px;
  cursor: pointer;
}

.pill-text {
  font-size: 8px;
  font-weight: bold;
  color: var(--screen-bezel);
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-buttons {
  display: flex;
  gap: 14px;
  transform: rotate(-10deg);
}

.btn-cluster {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.round-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #8b1d42;
  border: 3px solid #4a0c20;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 3px 0 rgba(0,0,0,0.4);
}

.round-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.4);
}

.btn-label {
  color: #ff94b4;
  font-family: var(--font-pixel);
  font-size: 12px;
  font-weight: bold;
}

.btn-text {
  font-size: 8px;
  font-weight: bold;
  color: var(--screen-bezel);
}

.speaker-grill {
  display: flex;
  gap: 5px;
  transform: rotate(-25deg);
}

@media (max-width: 700px) {
  .speaker-grill {
    display: none;
  }
}

.speaker-line {
  width: 6px;
  height: 40px;
  background: var(--shell-dark);
  border-radius: 3px;
  box-shadow: inset 1px 1px 2px rgba(0,0,0,0.4);
}
</style>
