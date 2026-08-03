<template>
  <div class="pixel-stage" ref="stageContainer">
    <!-- Top Stage Header Bar -->
    <div class="stage-top-bar">
      <span class="location-tag">
        📍 LOCALIZACIÓN: {{ currentSection.name }}
      </span>
      <span class="walk-status" :class="{ walking: isWalking }">
        {{ isWalking ? '🚶 CAMINANDO...' : '🛑 EN ESTACIÓN' }}
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

      <!-- World Track: Landmarks + Character together -->
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

          <!-- Pixel Landmark Decor -->
          <div class="landmark-building">
            <div v-if="idx === 0" class="house-pixel">🏡 INFO TOWN</div>
            <div v-if="idx === 1" class="tower-pixel">🗼 TECH TOWER</div>
            <div v-if="idx === 2" class="academy-pixel">🏛️ ACADEMY</div>
            <div v-if="idx === 3" class="castle-pixel">🏰 PROJECT CASTLE</div>
          </div>
        </div>

        <!-- Pixel Character Sprite — positioned AT the current section landmark -->
        <div 
          class="character-wrapper"
          :class="{ 
            walking: isWalking, 
            'facing-left': moveDirection < 0,
            jumping: isJumping,
            attacking: isAttacking
          }"
          :style="{ left: `${characterWorldX}px` }"
        >
          <!-- Speech Bubble when stationary -->
          <div v-if="!isWalking && typewriterText" class="speech-bubble">
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
            <!-- Sword (visible during attack) -->
            <div class="hero-sword">⚔️</div>
            <!-- Animated Legs Cycle -->
            <div class="hero-legs" :class="`step-${legPhase}`">
              <div class="leg leg-left"></div>
              <div class="leg leg-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Section Dialog & Content Box -->
    <div class="content-display-area" :class="{ dim: isWalking }">
      <div v-if="isWalking" class="walking-overlay">
        <span class="walking-msg">🚶 Viajando a {{ targetSection.name }}...</span>
        <div class="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>

      <div v-else class="section-content-wrapper">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { playStepSFX, playArrivalSFX, playTextBlipSFX, playJumpSFX, playSlashSFX } from '../utils/retroAudio.js'
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

const emit = defineEmits(['arrival'])

// State Variables
const cameraX = ref(0)
const isWalking = ref(false)
const moveDirection = ref(1) // 1 = right, -1 = left
const legPhase = ref(0)
const typewriterText = ref('')
const isJumping = ref(false)
const isAttacking = ref(false)

const currentSectionIndex = ref(0)
// Character X in world coordinates: just left of the landmark sign (landmark is idx*550+120)
const CHARACTER_OFFSET = 60  // pixels to the left of each landmark sign
const characterWorldX = computed(() => currentSectionIndex.value * 550 + CHARACTER_OFFSET)

const currentSection = computed(() => props.sections[currentSectionIndex.value] || props.sections[0])
const targetSection = computed(() => props.sections[props.targetIndex] || props.sections[0])

const activeComponent = computed(() => {
  switch (props.targetIndex) {
    case 0: return InfoSection
    case 1: return TechSection
    case 2: return StudiesSection
    case 3: return ProjectsSection
    default: return InfoSection
  }
})

let animFrameId = null
let legIntervalId = null
let stepAudioCounter = 0

// Calculate Target Camera X Offset for milestone index
function getTargetCameraX(idx) {
  return idx * 550
}

// Start Walking Animation towards Target Section
function startTravel(targetIdx) {
  const targetX = getTargetCameraX(targetIdx)
  const diff = targetX - cameraX.value

  if (Math.abs(diff) < 2) {
    onArrived(targetIdx)
    return;
  }

  isWalking.value = true
  moveDirection.value = diff > 0 ? 1 : -1
  typewriterText.value = ''

  // Leg Phase Interval
  if (!legIntervalId) {
    legIntervalId = setInterval(() => {
      legPhase.value = (legPhase.value + 1) % 4
      stepAudioCounter++
      if (stepAudioCounter % 2 === 0) {
        playStepSFX()
      }
    }, 120)
  }

  // Animation Loop for cameraX interpolation
  function step() {
    const remaining = targetX - cameraX.value
    const speed = Math.max(3, Math.abs(remaining) * 0.08)

    if (Math.abs(remaining) <= speed) {
      cameraX.value = targetX
      onArrived(targetIdx)
    } else {
      cameraX.value += moveDirection.value * speed
      // Update character section index smoothly during travel
      // so character visually walks with the world
      currentSectionIndex.value = targetIdx
      animFrameId = requestAnimationFrame(step)
    }
  }

  cancelAnimationFrame(animFrameId)
  animFrameId = requestAnimationFrame(step)
}

function onArrived(targetIdx) {
  isWalking.value = false
  currentSectionIndex.value = targetIdx
  if (legIntervalId) {
    clearInterval(legIntervalId)
    legIntervalId = null
  }
  playArrivalSFX()
  triggerTypewriter(`¡Llegaste a ${props.sections[targetIdx].name}!`)
  emit('arrival', targetIdx)
}

function triggerTypewriter(text) {
  typewriterText.value = ''
  let i = 0;
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

// Handle characterAction prop changes (jump / attack)
watch(() => props.characterAction, (action) => {
  if (!action || !action.type) return

  if (action.type === 'jump' && !isJumping.value && !isWalking.value) {
    isJumping.value = true
    playJumpSFX()
    setTimeout(() => { isJumping.value = false }, 500)
  }

  if (action.type === 'attack' && !isAttacking.value && !isWalking.value) {
    isAttacking.value = true
    playSlashSFX()
    setTimeout(() => { isAttacking.value = false }, 450)
  }
})

watch(() => props.targetIndex, (newVal) => {
  startTravel(newVal)
})

onMounted(() => {
  cameraX.value = getTargetCameraX(props.targetIndex)
  currentSectionIndex.value = props.targetIndex
  triggerTypewriter(`¡Bienvenido! Explora las secciones`)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  if (legIntervalId) clearInterval(legIntervalId)
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

.landmark-building {
  position: absolute;
  bottom: 0;
  right: -100px;
  font-size: 11px;
  background: var(--bg-dark);
  color: var(--bg-lightest);
  padding: 5px 8px;
  border: 2px solid var(--bg-darkest);
  border-radius: 3px;
}

/* =============================================
   CHARACTER — positioned inside world-track
   so it moves with the parallax world
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

.character-wrapper.facing-left {
  transform: scaleX(-1);
}

.character-wrapper.facing-left .speech-bubble {
  transform: scaleX(-1);
}

/* Jump animation */
.character-wrapper.jumping {
  animation: jump 0.5s ease-out;
}

@keyframes jump {
  0%   { transform: translateY(0); }
  35%  { transform: translateY(-36px); }
  70%  { transform: translateY(-18px); }
  100% { transform: translateY(0); }
}

/* Attack animation — don't flip character while facing left during attack */
.character-wrapper.attacking {
  animation: attack-swing 0.45s ease-out;
}

@keyframes attack-swing {
  0%   { transform: translateX(0); }
  30%  { transform: translateX(8px) rotate(3deg); }
  60%  { transform: translateX(12px) rotate(-2deg); }
  100% { transform: translateX(0) rotate(0); }
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

/* Sword — hidden by default, shown during attack */
.hero-sword {
  position: absolute;
  right: -22px;
  top: 20px;
  font-size: 16px;
  opacity: 0;
  transform: rotate(45deg) scale(0.5);
  transition: none;
  pointer-events: none;
}

.attacking .hero-sword {
  opacity: 1;
  animation: sword-appear 0.45s ease-out forwards;
}

@keyframes sword-appear {
  0%   { opacity: 0; transform: rotate(80deg) scale(0.4); }
  20%  { opacity: 1; transform: rotate(20deg) scale(1.1); }
  60%  { opacity: 1; transform: rotate(-10deg) scale(1); }
  100% { opacity: 0; transform: rotate(45deg) scale(0.5); }
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

.content-display-area.dim {
  opacity: 0.6;
}

.walking-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  font-size: 14px;
  font-weight: bold;
  color: var(--bg-darkest);
}

.loading-dots {
  display: flex;
  gap: 6px;
  font-size: 20px;
}

.loading-dots span {
  animation: blink 1s infinite alternate;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

.section-content-wrapper {
  animation: fadeIn 0.3s ease;
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
