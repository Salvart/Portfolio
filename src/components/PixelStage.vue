<template>
  <div class="pixel-stage">
    <!-- Top Stage Header Bar -->
    <div class="stage-top-bar">
      <span class="location-tag">
        {{ locationLabel }} {{ currentSection.name }}
      </span>
      <span class="walk-status" :class="{ walking: isWalking }">
        {{ isWalking ? walkingStatus : stationStatus }}
      </span>
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
        :style="{ transform: `translateX(${-cameraX}px)`, width: `${trackWidth}px` }"
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

        <!-- Pixel Character Sprite — the character has its own position in the
             world; camera and location text follow it -->
        <div
          class="character-wrapper"
          :class="{ walking: isWalking, jumping: isJumping }"
          :style="{ left: `${characterX}px` }"
        >
          <!-- Speech Bubble -->
          <div v-if="!isWalking && typewriterText" class="speech-bubble">
            {{ typewriterText }}
          </div>

          <div class="pixel-hero" :style="{ transform: heroTransform }">
            <!-- Hat / Cap -->
            <div class="hero-cap"></div>
            <!-- Head / Face -->
            <div class="hero-head">
              <div class="hero-eye"></div>
            </div>
            <!-- Body / Torso -->
            <div class="hero-body"></div>
            <!-- Animated Legs — only step while walking; on arrival the legs
                 snap back to a neutral standing pose -->
            <div class="hero-legs" :class="isWalking ? `step-${legPhase}` : ''">
              <div class="leg leg-left"></div>
              <div class="leg leg-right"></div>
            </div>
          </div>

          <div v-if="landingDust" class="landing-dust"></div>
        </div>
      </div>
    </div>

    <!-- Active Section Content (follows the character's current position) -->
    <div class="content-display-area">
      <div class="section-content-wrapper">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  playStepSFX,
  playArrivalSFX,
  playTextBlipSFX,
  playJumpSFX,
  playLandingSFX
} from '../utils/retroAudio.js'
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
const locationLabel = t('◈ LOCALIZACIÓN:', '◈ LOCATION:')
const walkingStatus = t('► CAMINANDO...', '► WALKING...')
const stationStatus = t('■ EN ESTACIÓN', '■ AT STATION')

// ===== The character drives everything =====
// characterX is the character's own world position. The camera keeps the
// character at a fixed screen offset, and the location text/content derive
// from where the character actually is.
const CHARACTER_OFFSET = 290
const SECTION_SPACING = 550
const characterX = ref(props.targetIndex * SECTION_SPACING + CHARACTER_OFFSET)
const cameraX = computed(() => characterX.value - CHARACTER_OFFSET)

// Track width adapts to the number of sections so the character never walks
// past the end of the world if sections are added later.
const trackWidth = computed(() => props.sections.length * SECTION_SPACING + 900)

const currentSectionIndex = computed(() => {
  if (isWalking.value) return arrivedIndex.value
  const raw = Math.round((characterX.value - CHARACTER_OFFSET) / SECTION_SPACING)
  const max = props.sections.length - 1
  return Math.max(0, Math.min(raw, max))
})
const currentSection = computed(() => props.sections[currentSectionIndex.value] || props.sections[0])

const activeComponent = computed(() => {
  switch (currentSectionIndex.value) {
    case 0: return InfoSection
    case 1: return TechSection
    case 2: return StudiesSection
    case 3: return ProjectsSection
    default: return InfoSection
  }
})

// State
const isWalking = ref(false)
const isJumping = ref(false)
const legPhase = ref(0)
const typewriterText = ref('')

// The last section the character fully arrived at. While walking, the shown
// section stays fixed (departure) and only switches once the character stops.
const arrivedIndex = ref(props.targetIndex)

let animFrameId = null
let legIntervalId = null
let typewriterIntervalId = null
let stepAudioCounter = 0

const WALK_SPEED = 300 // px/s per section — speed scales with distance so travel time stays constant

function getTargetX(idx) {
  return idx * SECTION_SPACING + CHARACTER_OFFSET
}

function startTravel(targetIdx) {
  const targetX = getTargetX(targetIdx)
  const diff = targetX - characterX.value

  if (Math.abs(diff) < 2) {
    onArrived()
    return
  }

  isWalking.value = true
  typewriterText.value = ''

  if (!legIntervalId) {
    legIntervalId = setInterval(() => {
      legPhase.value = (legPhase.value + 1) % 4
      stepAudioCounter++
      if (stepAudioCounter % 2 === 0) {
        playStepSFX()
      }
    }, 150)
  }

  cancelAnimationFrame(animFrameId)
  function step() {
    const remaining = targetX - characterX.value
    const dist = Math.abs(remaining)
    // Proportional speed: N sections away → Nx speed, so any trip takes the same time
    const baseStep = WALK_SPEED * (1 / 60)
    const distanceStep = WALK_SPEED * (dist / SECTION_SPACING) * (1 / 60)
    const stepSize = Math.max(baseStep, distanceStep)

    if (dist <= stepSize) {
      characterX.value = targetX
      onArrived()
    } else {
      characterX.value += Math.sign(remaining) * stepSize
      animFrameId = requestAnimationFrame(step)
    }
  }
  animFrameId = requestAnimationFrame(step)
}

function onArrived() {
  const raw = Math.round((characterX.value - CHARACTER_OFFSET) / SECTION_SPACING)
  const max = props.sections.length - 1
  arrivedIndex.value = Math.max(0, Math.min(raw, max))
  isWalking.value = false
  if (legIntervalId) {
    clearInterval(legIntervalId)
    legIntervalId = null
  }
  legPhase.value = 0
  playArrivalSFX()
  triggerTypewriter(
    lang.value === 'es'
      ? `¡Llegaste a ${currentSection.value.name}!`
      : `Welcome to ${currentSection.value.name}!`
  )
}

function triggerTypewriter(text) {
  if (typewriterIntervalId) {
    clearInterval(typewriterIntervalId)
    typewriterIntervalId = null
  }
  typewriterText.value = ''
  let i = 0
  typewriterIntervalId = setInterval(() => {
    if (i < text.length) {
      typewriterText.value += text.charAt(i)
      if (i % 3 === 0) playTextBlipSFX()
      i++
    } else {
      clearInterval(typewriterIntervalId)
      typewriterIntervalId = null
    }
  }, 40)
}

// Jump with A — physics-based hop in place with squash & stretch
const JUMP_VELOCITY = 430 // px/s launch speed
const GRAVITY = 2000 // px/s² — gravity makes the arc feel natural
const jumpHeight = ref(0)
const heroScaleY = ref(1)
const heroScaleX = ref(1)
const landingDust = ref(false)

let jumpAnimId = null

const heroTransform = computed(() =>
  `translateY(${-jumpHeight.value}px) scaleX(${heroScaleX.value}) scaleY(${heroScaleY.value})`
)

function clampScale(v) {
  return Math.max(0.7, Math.min(1.35, v))
}

function easeOutBack(x) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function startJump() {
  if (isJumping.value || isWalking.value) return
  isJumping.value = true
  playJumpSFX()
  cancelAnimationFrame(jumpAnimId)

  // Phase 1 — anticipation: quick crouch before springing up
  const PREP_MS = 90
  const prepStart = performance.now()

  function prep(now) {
    const t = Math.min((now - prepStart) / PREP_MS, 1)
    const dip = Math.sin(t * Math.PI)
    heroScaleY.value = clampScale(1 - 0.16 * dip)
    heroScaleX.value = clampScale(1 + 0.16 * dip)
    if (t < 1) {
      jumpAnimId = requestAnimationFrame(prep)
    } else {
      launch()
    }
  }
  jumpAnimId = requestAnimationFrame(prep)

  // Phase 2 — ballistic flight: gravity + stretch proportional to speed
  function launch() {
    let y = 0
    let vy = JUMP_VELOCITY
    let last = performance.now()

    function air(now) {
      let dt = (now - last) / 1000
      last = now
      dt = Math.min(dt, 1 / 30)

      vy -= GRAVITY * dt
      y += vy * dt

      if (y <= 0) {
        y = 0
        land()
        return
      }

      const stretch = 1 + Math.min(Math.abs(vy) / 1300, 1) * 0.16
      heroScaleY.value = clampScale(stretch)
      heroScaleX.value = clampScale(2 - stretch)
      jumpHeight.value = y
      jumpAnimId = requestAnimationFrame(air)
    }
    jumpAnimId = requestAnimationFrame(air)
  }

  // Phase 3 — landing: squash + dust puff, then recover
  function land() {
    jumpHeight.value = 0
    landingDust.value = true
    playLandingSFX()
    const SQUASH_MS = 130
    const l0 = performance.now()

    function squash(now) {
      const t = Math.min((now - l0) / SQUASH_MS, 1)
      if (t >= 1) {
        heroScaleY.value = 1
        heroScaleX.value = 1
        landingDust.value = false
        isJumping.value = false
        return
      }
      const s = clampScale(0.82 + 0.18 * easeOutBack(t))
      heroScaleY.value = s
      heroScaleX.value = clampScale(2 - s)
      jumpAnimId = requestAnimationFrame(squash)
    }
    jumpAnimId = requestAnimationFrame(squash)
  }
}

watch(() => props.characterAction, (action) => {
  if (!action || !action.type) return
  if (action.type === 'jump' && !isJumping.value && !isWalking.value) {
    startJump()
  }
})

// Section change: walk slowly towards it (no teleport)
watch(() => props.targetIndex, (newVal) => {
  startTravel(newVal)
})

onMounted(() => {
  characterX.value = getTargetX(props.targetIndex)
  triggerTypewriter(lang.value === 'es'
    ? '¡Bienvenido! Explora las secciones'
    : 'Welcome! Explore the sections')
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  cancelAnimationFrame(jumpAnimId)
  if (legIntervalId) clearInterval(legIntervalId)
  if (typewriterIntervalId) clearInterval(typewriterIntervalId)
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

.walk-status.walking {
  color: #ffd700;
  animation: blink 0.5s infinite alternate;
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
   CHARACTER — walks slowly through the world
   ============================================= */
.character-wrapper {
  position: absolute;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 15;
}

.speech-bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 6px 10px;
  font-size: 10px;
  border-radius: 4px;
  white-space: nowrap;
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
  transform-origin: 50% 100%;
}

/* Dust puff kicked up on landing */
.landing-dust {
  position: absolute;
  bottom: -6px;
  left: 50%;
  width: 26px;
  height: 10px;
  margin-left: -13px;
  background:
    radial-gradient(circle at 20% 60%, rgba(0, 0, 0, 0.28) 0 3px, transparent 4px),
    radial-gradient(circle at 50% 80%, rgba(0, 0, 0, 0.28) 0 3px, transparent 4px),
    radial-gradient(circle at 80% 55%, rgba(0, 0, 0, 0.22) 0 3px, transparent 4px);
  animation: dustPuff 0.35s ease-out forwards;
  pointer-events: none;
}

@keyframes dustPuff {
  from { opacity: 1; transform: scale(0.6); }
  to { opacity: 0; transform: scale(1.5); }
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

/* Leg Walking Cycle */
.hero-legs.step-1 .leg-left { transform: translateY(-3px); }
.hero-legs.step-2 .leg-right { transform: translateY(-3px); }
.hero-legs.step-3 .leg-left { transform: translateY(-4px); }

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
  height: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0.2; }
}
</style>
