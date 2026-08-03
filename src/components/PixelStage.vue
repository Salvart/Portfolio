<template>
  <div class="pixel-stage" ref="stageContainer">
    <!-- Top Stage Header Bar -->
    <div class="stage-top-bar">
      <span class="location-tag">
        {{ locationLabel }} {{ currentSection.name }}
      </span>

      <!-- Hearts Bar (center) -->
      <div class="top-center">
        <div v-if="!isDead" class="hearts-bar">
          <div v-for="i in 5" :key="i" class="heart-cell">
            <span class="heart-bg">🖤</span>
            <span class="heart-fg" :style="{ width: heartWidth(i) }">❤️</span>
          </div>
        </div>
        <span v-else class="respawn-timer">⏳ {{ reviveCountdown }}s</span>
      </div>

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

      <!-- World Track: Landmarks + Character + Enemies together -->
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

        <!-- Enemy Sprites -->
        <div
          v-for="enemy in enemies"
          :key="enemy.id"
          class="enemy-wrapper"
          :class="{ killed: enemy.state === 'killed' }"
          :style="{ left: `${enemy.x}px` }"
        >
          <div class="enemy-sprite">👾</div>
        </div>

        <!-- Tombstone (when dead) — appears over the corpse -->
        <div
          v-if="isDead && dyingStage === 'done'"
          class="tombstone"
          :style="{ left: `${characterWorldX}px` }"
        >
          🪦
        </div>

        <!-- Pixel Character Sprite — fixed in place, walks in the spot -->
        <div
          class="character-wrapper"
          :class="{
            walking: isWalking,
            'facing-left': facingLeft,
            jumping: isJumping,
            hurt: isHurt,
            dying: isDead,
            sunk: isDead && (dyingStage === 'sunk' || dyingStage === 'done'),
            emerging: isEmerging
          }"
          :style="{ left: `${characterWorldX}px` }"
        >
          <!-- Speech Bubble when stationary -->
          <div v-if="!isWalking && !isDead && typewriterText" class="speech-bubble">
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
            <!-- Animated Legs Cycle -->
            <div class="hero-legs" :class="`step-${legPhase}`">
              <div class="leg leg-left"></div>
              <div class="leg leg-right"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Level Complete Banner (viewport overlay) -->
      <div v-if="levelComplete" class="level-complete-banner">
        🏆 {{ levelCompleteLabel }}
      </div>
    </div>

    <!-- Active Section Dialog & Content Box -->
    <div class="content-display-area" :class="{ dim: isWalking }">
      <div v-if="isWalking" class="walking-overlay">
        <span class="walking-msg">{{ walkingMsg }}</span>
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
import {
  playStepSFX,
  playArrivalSFX,
  playTextBlipSFX,
  playJumpSFX,
  playHurtSFX,
  playDeathSFX,
  playKillSFX,
  playReviveSFX
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

const emit = defineEmits(['arrival'])

// i18n labels
const locationLabel = t('📍 LOCALIZACIÓN:', '📍 LOCATION:')
const walkingStatus = t('🚶 CAMINANDO...', '🚶 WALKING...')
const stationStatus = t('🛑 EN ESTACIÓN', '🛑 AT STATION')
const walkingMsg = t('🚶 CAMINANDO...', '🚶 WALKING...')
const levelCompleteLabel = t('¡NIVEL COMPLETADO!', 'LEVEL COMPLETE')

// State Variables
const cameraX = ref(0)
const isWalking = ref(false)
const facingLeft = ref(false)
const legPhase = ref(0)
const typewriterText = ref('')
const isJumping = ref(false)
const isHurt = ref(false)

const currentSectionIndex = ref(0)

// Character X in world coordinates: to the RIGHT of the landmark sign.
// Landmark left edge is at idx*550+120 and the sign board is ~144px wide
// (spans +120..+264), so the character stands at +290 (right of the board).
const CHARACTER_OFFSET = 290
const characterWorldX = computed(() => currentSectionIndex.value * 550 + CHARACTER_OFFSET)

const currentSection = computed(() => props.sections[currentSectionIndex.value] || props.sections[0])

const activeComponent = computed(() => {
  switch (props.targetIndex) {
    case 0: return InfoSection
    case 1: return TechSection
    case 2: return StudiesSection
    case 3: return ProjectsSection
    default: return InfoSection
  }
})

// ============ Combat / Health System ============
const MAX_HEALTH_UNITS = 10 // 5 hearts x 2 half-units
const healthUnits = ref(MAX_HEALTH_UNITS)
const isDead = ref(false)
const dyingStage = ref('') // '' | 'fall' | 'sunk' | 'done'
const reviveCountdown = ref(0)
const isEmerging = ref(false)
const killCount = ref(0)
const levelComplete = ref(false)
const KILLS_TO_WIN = 5

const enemies = ref([])
let enemyId = 0

const ENEMY_SPEED = 45
const KILL_WINDOW = 32
const HIT_WINDOW = 14
const SPAWN_INTERVAL = 7000
const MAX_ALIVE_ENEMIES = 3

function heartWidth(i) {
  const units = Math.max(0, Math.min(2, healthUnits.value - (i - 1) * 2))
  return (units / 2) * 100 + '%'
}

function takeDamage() {
  if (isDead.value || isHurt.value) return
  healthUnits.value = Math.max(0, healthUnits.value - 1)
  playHurtSFX()
  isHurt.value = true
  setTimeout(() => { isHurt.value = false }, 350)
  if (healthUnits.value <= 0) {
    startDeath()
  }
}

function startDeath() {
  isDead.value = true
  isWalking.value = false
  facingLeft.value = false
  clearLegInterval()
  playDeathSFX()
  dyingStage.value = 'fall'
  setTimeout(() => { if (dyingStage.value === 'fall') dyingStage.value = 'sunk' }, 900)
  setTimeout(() => { if (dyingStage.value === 'sunk') dyingStage.value = 'done' }, 1800)

  reviveCountdown.value = 120
  if (!reviveIntervalId) {
    reviveIntervalId = setInterval(() => {
      reviveCountdown.value -= 1
      if (reviveCountdown.value <= 0) {
        revive()
      }
    }, 1000)
  }
}

function revive() {
  clearInterval(reviveIntervalId)
  reviveIntervalId = null
  isDead.value = false
  dyingStage.value = ''
  healthUnits.value = MAX_HEALTH_UNITS
  isEmerging.value = true
  playReviveSFX()
  setTimeout(() => { isEmerging.value = false }, 700)
  triggerTypewriter(lang.value === 'es' ? '¡Has revivido!' : 'You revived!')
}

function spawnEnemy() {
  const cx = characterWorldX.value
  const dir = Math.random() < 0.5 ? -1 : 1
  enemies.value.push({
    id: ++enemyId,
    x: cx + dir * (300 + Math.random() * 200),
    dir,
    state: 'walking',
    killedAt: 0
  })
}

function updateEnemies(dt) {
  const cx = characterWorldX.value
  let nearestX = null
  let nearestDist = Infinity

  for (const e of enemies.value) {
    if (e.state === 'killed') continue

    // Passed enemies keep walking in their direction and leave the screen
    if (e.state === 'passed') {
      e.x += e.dir * ENEMY_SPEED * dt
      continue
    }

    const dx = cx - e.x
    e.dir = dx > 0 ? 1 : -1
    e.x += e.dir * ENEMY_SPEED * dt

    if (Math.abs(dx) < nearestDist) {
      nearestDist = Math.abs(dx)
      nearestX = e.x
    }

    // While dead the enemies walk past the grave without damaging
    if (isDead.value && Math.abs(e.x - cx) < HIT_WINDOW) {
      e.state = 'passed'
      continue
    }

    // Stomp kill while jumping
    if (isJumping.value && Math.abs(e.x - cx) < KILL_WINDOW) {
      e.state = 'killed'
      e.killedAt = Date.now()
      killCount.value += 1
      playKillSFX()
      if (killCount.value >= KILLS_TO_WIN) {
        levelComplete.value = true
      }
      continue
    }

    // Enemy reaches the character -> damage (if alive)
    if (Math.abs(e.x - cx) < HIT_WINDOW) {
      takeDamage()
      e.state = 'passed'
    }
  }

  if (isDead.value) {
    facingLeft.value = false
  } else if (nearestX !== null) {
    facingLeft.value = nearestX < cx
  }

  enemies.value = enemies.value.filter((e) => {
    if (e.state === 'killed') return Date.now() - e.killedAt < 500
    if (e.state === 'passed') return Math.abs(e.x - characterWorldX.value) < 1000
    return true
  })
}

// ============ Walk-in-place (no travel) ============
let animFrameId = null
let legIntervalId = null
let stepAudioCounter = 0
let reviveIntervalId = null

let spawnTimer = 3000
let lastTime = null

function getTargetCameraX(idx) {
  return idx * 550
}

function startWalkInPlace() {
  if (isDead.value) return
  isWalking.value = true
  typewriterText.value = ''
  clearLegInterval()

  legIntervalId = setInterval(() => {
    legPhase.value = (legPhase.value + 1) % 4
    stepAudioCounter++
    if (stepAudioCounter % 2 === 0) {
      playStepSFX()
    }
  }, 140)

  setTimeout(() => {
    if (isWalking.value) {
      finishWalkInPlace()
    }
  }, 1000)
}

function finishWalkInPlace() {
  isWalking.value = false
  clearLegInterval()
  playArrivalSFX()
  triggerTypewriter(
    lang.value === 'es'
      ? `¡Llegaste a ${currentSection.value.name}!`
      : `Welcome to ${currentSection.value.name}!`
  )
  emit('arrival', props.targetIndex)
}

function clearLegInterval() {
  if (legIntervalId) {
    clearInterval(legIntervalId)
    legIntervalId = null
  }
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

// Handle characterAction prop changes (jump only — no attack)
watch(() => props.characterAction, (action) => {
  if (!action || !action.type) return
  if (action.type === 'jump' && !isJumping.value && !isWalking.value && !isDead.value) {
    isJumping.value = true
    playJumpSFX()
    setTimeout(() => { isJumping.value = false }, 500)
  }
})

// Section change: snap camera + brief walk-in-place animation (no travel)
watch(() => props.targetIndex, (newVal) => {
  currentSectionIndex.value = newVal
  cameraX.value = getTargetCameraX(newVal)
  startWalkInPlace()
})

// Game loop (enemies + spawns)
function gameLoop(timestamp) {
  if (lastTime === null) lastTime = timestamp
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
  lastTime = timestamp

  if (!isDead.value && !levelComplete.value) {
    spawnTimer += dt * 1000
    const aliveCount = enemies.value.filter((e) => e.state === 'walking').length
    if (spawnTimer >= SPAWN_INTERVAL && aliveCount < MAX_ALIVE_ENEMIES) {
      spawnEnemy()
      spawnTimer = 4000 + Math.random() * 3000
    }
  }

  updateEnemies(dt)
  animFrameId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  cameraX.value = getTargetCameraX(props.targetIndex)
  currentSectionIndex.value = props.targetIndex
  triggerTypewriter(lang.value === 'es'
    ? '¡Bienvenido! Salta sobre los enemigos con A'
    : 'Welcome! Stomp enemies by jumping with A')
  animFrameId = requestAnimationFrame(gameLoop)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  clearLegInterval()
  if (reviveIntervalId) clearInterval(reviveIntervalId)
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
  gap: 8px;
}

.top-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hearts-bar {
  display: flex;
  gap: 2px;
  align-items: center;
}

.heart-cell {
  position: relative;
  width: 18px;
  height: 18px;
}

.heart-bg {
  font-size: 12px;
  line-height: 18px;
  display: block;
}

.heart-fg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}

.respawn-timer {
  color: #ffd700;
  font-size: 12px;
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

/* =============================================
   ENEMIES
   ============================================= */
.enemy-wrapper {
  position: absolute;
  bottom: 22px;
  z-index: 10;
  transition: left 0.05s linear;
}

.enemy-sprite {
  font-size: 20px;
  line-height: 1;
  animation: enemy-bob 0.4s infinite alternate;
}

.enemy-wrapper.killed .enemy-sprite {
  animation: enemy-squash 0.45s ease-out forwards;
}

@keyframes enemy-bob {
  from { transform: translateY(0); }
  to { transform: translateY(-3px); }
}

@keyframes enemy-squash {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  40%  { opacity: 1; transform: translateY(6px) scale(1.6, 0.35); }
  100% { opacity: 0; transform: translateY(12px) scale(1.2, 0.15); }
}

/* Tombstone — rises over the corpse, centered on the character position */
.tombstone {
  position: absolute;
  bottom: 22px;
  transform: translateX(-50%);
  font-size: 26px;
  z-index: 14;
  animation: tombstone-rise 0.5s ease-out;
}

@keyframes tombstone-rise {
  0%   { transform: translateX(-50%) translateY(26px) scale(0.4); opacity: 0; }
  70%  { transform: translateX(-50%) translateY(-4px) scale(1.1); opacity: 1; }
  100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
}

/* Level Complete Banner */
.level-complete-banner {
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-darkest);
  color: #ffd700;
  border: 3px solid var(--bg-dark);
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  z-index: 30;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
  animation: banner-pop 0.5s ease-out;
}

@keyframes banner-pop {
  0% { transform: translateX(-50%) scale(0.4); opacity: 0; }
  60% { transform: translateX(-50%) scale(1.1); }
  100% { transform: translateX(-50%) scale(1); opacity: 1; }
}

/* =============================================
   CHARACTER — fixed in place
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

.character-wrapper.facing-left .pixel-hero {
  transform: scaleX(-1);
}

.character-wrapper.facing-left .speech-bubble {
  transform: scaleX(-1);
}

/* Jump animation */
.character-wrapper.jumping .pixel-hero {
  animation: jump 0.5s ease-out;
}

@keyframes jump {
  0%   { transform: translateY(0); }
  35%  { transform: translateY(-36px); }
  70%  { transform: translateY(-18px); }
  100% { transform: translateY(0); }
}

/* Damage flash */
.character-wrapper.hurt .pixel-hero {
  animation: hurtflash 0.35s steps(2) 2;
  filter: invert(0.7);
}

@keyframes hurtflash {
  0%   { filter: invert(0.7); }
  50%  { filter: invert(0); }
  100% { filter: invert(0.7); }
}

/* Death sequence */
.character-wrapper.dying .pixel-hero {
  animation: fall-over 0.8s ease-out forwards;
}

.character-wrapper.sunk .pixel-hero {
  animation: sink 0.8s ease-in forwards;
}

@keyframes fall-over {
  0%   { transform: rotate(0deg) translateY(0); opacity: 1; }
  100% { transform: rotate(90deg) translateY(6px); opacity: 1; }
}

@keyframes sink {
  0%   { transform: rotate(90deg) translateY(6px); opacity: 1; }
  100% { transform: rotate(90deg) translateY(60px); opacity: 0; }
}

/* Revive: character emerges from the grave */
.character-wrapper.emerging .pixel-hero {
  animation: emerge 0.7s ease-out;
}

@keyframes emerge {
  0%   { transform: translateY(60px); opacity: 0; }
  70%  { transform: translateY(-6px); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
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
