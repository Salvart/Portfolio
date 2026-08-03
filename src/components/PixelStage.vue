<template>
  <div class="pixel-stage">
    <!-- Top Stage Header Bar -->
    <div class="stage-top-bar">
      <span class="location-tag">
        {{ locationLabel }} {{ currentSection.name }}
      </span>
      <span class="walk-status">{{ stationStatus }}</span>
    </div>

    <!-- Parallax Background Horizon Stage -->
    <div class="viewport-canvas">
      <!-- Sky & Clouds Layer -->
      <div class="sky-layer">
        <div
          class="clouds-track"
          :style="{ transform: `translateX(${-cameraX * 0.2}px)` }"
        >
          <div class="cloud cloud-1">☁️</div>
          <div class="cloud cloud-2">☁️</div>
          <div class="cloud cloud-3">☁️</div>
          <div class="cloud cloud-4">☁️</div>
          <div class="cloud cloud-5">☁️</div>
        </div>
      </div>

      <!-- Distant Hills & Pixel Skyline -->
      <div
        class="mountains-layer"
        :style="{ transform: `translateX(${-cameraX * 0.4}px)` }"
      >
        <div class="mountain-range">
          <div v-for="n in 12" :key="n" class="pixel-peak"></div>
        </div>
      </div>

      <!-- World Track: Landmarks + Character -->
      <div
        class="world-track"
        :style="{ transform: `translateX(${-cameraX}px)` }"
      >
        <!-- Ground Level Track -->
        <div class="ground-line"></div>

        <!-- Landmark Signs for Each Section -->
        <div
          v-for="(sec, idx) in sections"
          :key="sec.id"
          class="landmark-sign"
          :style="{ left: `${idx * 550 + 120}px` }"
        >
          <div class="sign-board">
            <span class="sign-icon">{{ sec.icon }}</span>
            <span class="sign-title">{{ sec.name }}</span>
          </div>
          <div class="sign-post"></div>
        </div>

        <!-- Pixel Character Sprite — static, always at a fixed screen position -->
        <div
          class="character-wrapper"
          :class="{ jumping: isJumping }"
          :style="{ left: `${characterWorldX}px` }"
        >
          <!-- Speech Bubble -->
          <div v-if="typewriterText" class="speech-bubble">
            {{ typewriterText }}
          </div>

          <div class="pixel-hero">
            <!-- Hat / Cap -->
            <div class="hero-cap"></div>
            <!-- Head / Face -->
            <div class="hero-head">
              <div class="hero-eye"></div>
            </div>
            <!-- Body / Torso -->
            <div class="hero-body"></div>
            <!-- Legs -->
            <div class="hero-legs">
              <div class="leg leg-left"></div>
              <div class="leg leg-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Section Content -->
    <div class="content-display-area">
      <div class="section-content-wrapper">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { playArrivalSFX, playTextBlipSFX, playJumpSFX } from '../utils/retroAudio.js'
import { lang, t } from '../utils/i18n.js'
import InfoSection from './sections/InfoSection.vue'
import TechSection from './sections/TechSection.vue'
import StudiesSection from './sections/StudiesSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'

const props = defineProps({
  targetIndex: {
    type: Number,
    default: 0
  },
  sections: {
    type: Array,
    required: true
  },
  characterAction: {
    type: Object,
    default: () => ({ type: '', id: 0 })
  }
})

// i18n labels
const locationLabel = t('📍 LOCALIZACIÓN:', '📍 LOCATION:')
const stationStatus = t('🛑 EN ESTACIÓN', '🛑 AT STATION')

// State
const cameraX = ref(0)
const typewriterText = ref('')
const isJumping = ref(false)

// The character is static: its world position tracks the camera so it always
// stays at the same screen position (CHARACTER_OFFSET) while the world scrolls.
const CHARACTER_OFFSET = 290
const characterWorldX = computed(() => cameraX.value + CHARACTER_OFFSET)

const currentSection = computed(() => props.sections[props.targetIndex] || props.sections[0])

const activeComponent = computed(() => {
  switch (props.targetIndex) {
    case 0: return InfoSection
    case 1: return TechSection
    case 2: return StudiesSection
    case 3: return ProjectsSection
    default: return InfoSection
  }
})

function getTargetCameraX(idx) {
  return idx * 550
}

function triggerTypewriter(text) {
  typewriterText.value = ''
  let i = 0
  const interval = setInterval(() => {
    if (i < text.length) {
      typewriterText.value += text.charAt(i)
      if (i % 3 === 0) playTextBlipSFX()
      i++
    } else {
      clearInterval(interval)
    }
  }, 40)
}

// Jump with A — simple hop in place (no movement)
watch(() => props.characterAction, (action) => {
  if (!action || !action.type) return
  if (action.type === 'jump' && !isJumping.value) {
    isJumping.value = true
    playJumpSFX()
    setTimeout(() => { isJumping.value = false }, 500)
  }
})

// Section change: only the camera/world scrolls, the character never moves
watch(() => props.targetIndex, (newVal) => {
  cameraX.value = getTargetCameraX(newVal)
  playArrivalSFX()
  triggerTypewriter(
    lang.value === 'es'
      ? `¡Llegaste a ${currentSection.value.name}!`
      : `Welcome to ${currentSection.value.name}!`
  )
})

onMounted(() => {
  cameraX.value = getTargetCameraX(props.targetIndex)
  triggerTypewriter(lang.value === 'es'
    ? '¡Bienvenido! Explora las secciones'
    : 'Welcome! Explore the sections')
})
</script>

<style scoped>
.pixel-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-lightest);
  overflow: hidden;
  position: relative;
}

.stage-top-bar {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 6px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: bold;
  border-bottom: 3px solid var(--bg-dark);
}

/* 8-Bit Canvas Viewport */
.viewport-canvas {
  height: 150px;
  background: linear-gradient(to bottom, var(--bg-light) 0%, var(--bg-lightest) 80%);
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid var(--bg-darkest);
}

/* Parallax Layers */
.sky-layer {
  position: absolute;
  top: 10px;
  left: 0; right: 0;
  height: 40px;
}

.clouds-track {
  display: flex;
  gap: 120px;
  position: absolute;
  white-space: nowrap;
}

.cloud {
  font-size: 24px;
  opacity: 0.85;
}

.mountains-layer {
  position: absolute;
  bottom: 25px;
  left: 0;
}

.mountain-range {
  display: flex;
  gap: 2px;
}

.pixel-peak {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 40px solid var(--bg-dark);
  opacity: 0.45;
}

.world-track {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 3000px;
}

.ground-line {
  position: absolute;
  bottom: 20px;
  left: 0; right: 0;
  height: 6px;
  background: var(--bg-darkest);
}

/* Milestone Signboards */
.landmark-sign {
  position: absolute;
  bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-board {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  border: 2px solid var(--bg-dark);
  padding: 6px 10px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 3px;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
}

.sign-post {
  width: 5px;
  height: 20px;
  background: var(--bg-darkest);
}

/* =============================================
   CHARACTER — static in place
   ============================================= */
.character-wrapper {
  position: absolute;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 15;
  transition: left 0.08s linear;
}

.speech-bubble {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 6px 10px;
  font-size: 10px;
  border-radius: 4px;
  margin-bottom: 6px;
  white-space: nowrap;
  position: relative;
  border: 1px solid var(--bg-dark);
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px 5px 0;
  border-style: solid;
  border-color: var(--bg-darkest) transparent;
}

.pixel-hero {
  width: 28px;
  height: 48px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: idle-bob 2s ease-in-out infinite;
}

/* Subtle idle animation — the character stays in place */
@keyframes idle-bob {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-2px); }
  100% { transform: translateY(0); }
}

/* Hop with A — still in place, no horizontal movement */
.character-wrapper.jumping .pixel-hero {
  animation: jump 0.5s ease-out;
}

@keyframes jump {
  0%   { transform: translateY(0); }
  35%  { transform: translateY(-36px); }
  70%  { transform: translateY(-18px); }
  100% { transform: translateY(0); }
}

.hero-cap {
  width: 24px;
  height: 7px;
  background: var(--bg-darkest);
  border-radius: 3px 3px 0 0;
}

.hero-head {
  width: 20px;
  height: 16px;
  background: var(--bg-lightest);
  border: 2px solid var(--bg-darkest);
  position: relative;
}

.hero-eye {
  width: 4px;
  height: 5px;
  background: var(--bg-darkest);
  position: absolute;
  top: 5px;
  right: 4px;
}

.hero-body {
  width: 22px;
  height: 14px;
  background: var(--bg-dark);
  border: 2px solid var(--bg-darkest);
}

.hero-legs {
  width: 20px;
  height: 8px;
  display: flex;
  justify-content: space-between;
}

.leg {
  width: 8px;
  height: 8px;
  background: var(--bg-darkest);
}

/* Main Section Content Area */
.content-display-area {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  position: relative;
  background: var(--bg-lightest);
}

.section-content-wrapper {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
