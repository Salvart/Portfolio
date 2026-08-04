<template>
  <div class="info-section">
    <!-- Header Badge -->
    <div class="section-badge">
      <span class="badge-title">PLAYER STATS</span>
      <span class="badge-level">LVL. {{ playerLevel }}</span>
    </div>

    <!-- Main Character Card -->
    <div class="profile-card">
      <div class="avatar-frame">
        <div class="pixel-avatar">
          <!-- 8-Bit Pixel Character Avatar -->
          <div class="avatar-face">
            <div class="hair"></div>
            <div class="eyes"></div>
            <div class="smile"></div>
            <div class="shirt"></div>
          </div>
        </div>
        <div class="class-title">GAME DEV</div>
      </div>

      <div class="stats-box">
        <h3 class="player-name">TECHNICAL ARTIST & PROGRAMMER</h3>
        <p class="tagline">{{ tagline }}</p>

        <!-- Dynamic Stat Bars -->
        <div class="stat-row">
          <span class="stat-label">HP (ALTURA)</span>
          <div class="stat-bar"><div class="stat-fill hp-fill" style="width: 100%;"></div></div>
          <span class="stat-val">183/183</span>
        </div>

        <div class="stat-row">
          <span class="stat-label">MP (IQ)</span>
          <div class="stat-bar"><div class="stat-fill mp-fill" style="width: 100%;"></div></div>
          <span class="stat-val">123/123</span>
        </div>

        <div class="stat-row">
          <span class="stat-label">EXP (CREATIVITY)</span>
          <div class="stat-bar"><div class="stat-fill exp-fill" style="width: 90%;"></div></div>
          <span class="stat-val">MAX</span>
        </div>
      </div>
    </div>

    <!-- Description & Philosophy -->
    <div class="bio-box">
      <h4 class="bio-header">▶ {{ aboutLabel }}</h4>
      <p class="bio-text">{{ bio1 }}</p>
      <p class="bio-text">{{ bio2 }}</p>
    </div>

    <!-- Quick Info Grid -->
    <div class="quick-facts">
      <div class="fact-item">
        <span class="fact-icon">📍</span>
        <span class="fact-text">{{ locationFact }}</span>
      </div>
      <div class="fact-item">
        <span class="fact-icon">💼</span>
        <span class="fact-text">{{ statusFact }}</span>
      </div>
      <div class="fact-item">
        <span class="fact-icon">⚡</span>
        <span class="fact-text">{{ specialtyFact }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { lang, t } from '../../utils/i18n.js'

const BIRTH_YEAR = 1990
const BIRTH_MONTH = 11 // diciembre (0-indexado)
const BIRTH_DAY = 15

const playerLevel = computed(() => {
  const now = new Date()
  let level = now.getFullYear() - BIRTH_YEAR
  const hasHadBirthday =
    now.getMonth() > BIRTH_MONTH ||
    (now.getMonth() === BIRTH_MONTH && now.getDate() >= BIRTH_DAY)
  if (!hasHadBirthday) level--
  return level
})

const aboutLabel = t('SOBRE MÍ', 'ABOUT ME')
const tagline = t(
  '« Apasionado por los videojuegos, el arte 3D y el código limpio »',
  '« Passionate about videogames, 3D art and clean code »'
)
const bio1 = t(
  '¡Hola! Soy un desarrollador que trabaja programando y haciendo 3D. Me adapto a cualquier pipeline de trabajo: C++, Blueprints, web y mucho más.',
  'Hi! I am a developer who works programming and doing 3D. I adapt to any pipeline: C++, Blueprints, web and much more.'
)
const bio2 = t(
  'Me encanta combinar modelado y arte 3D con arquitectura de software limpia para crear experiencias interactivas memorables.',
  'I love combining 3D modeling and art with clean software architecture to create memorable interactive experiences.'
)
const locationFact = t('Ubicación: Madrid, España', 'Location: Madrid, Spain')
const statusFact = t('Estado: Disponible para proyectos', 'Status: Available for projects')
const specialtyFact = t('Especialidad: Web / Game Dev', 'Specialty: Web / Game Dev')
</script>

<style scoped>
.info-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
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

.profile-card {
  display: flex;
  gap: 16px;
  background: rgba(0, 0, 0, 0.05);
  border: 3px solid var(--bg-darkest);
  padding: 12px;
  border-radius: 4px;
}

@media (max-width: 550px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.avatar-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pixel-avatar {
  width: 72px;
  height: 72px;
  background: var(--bg-darkest);
  border: 3px solid var(--bg-dark);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-face {
  width: 48px;
  height: 52px;
  background: var(--bg-lightest);
  position: relative;
}

.avatar-face .hair {
  position: absolute;
  top: 0; left: 0; right: 0; height: 16px;
  background: var(--bg-darkest);
}

.avatar-face .eyes {
  position: absolute;
  top: 20px; left: 8px; width: 8px; height: 8px;
  background: var(--bg-darkest);
  box-shadow: 24px 0 0 var(--bg-darkest);
}

.avatar-face .smile {
  position: absolute;
  bottom: 12px; left: 16px; width: 16px; height: 4px;
  background: var(--bg-darkest);
}

.avatar-face .shirt {
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 10px;
  background: var(--bg-dark);
}

.class-title {
  font-size: 10px;
  background: var(--bg-dark);
  color: var(--bg-lightest);
  padding: 3px 6px;
}

.stats-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-name {
  font-size: 15px;
  color: var(--bg-darkest);
}

.tagline {
  font-size: 11px;
  opacity: 0.9;
  margin-bottom: 4px;
  line-height: 1.4;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.stat-label {
  width: 120px;
  font-weight: bold;
}

.stat-bar {
  flex: 1;
  height: 12px;
  background: var(--bg-dark);
  border: 2px solid var(--bg-darkest);
  position: relative;
}

.stat-fill {
  height: 100%;
  transition: width 1s ease-in-out;
}

.hp-fill { background: var(--bg-lightest); }
.mp-fill { background: var(--bg-light); }
.exp-fill { background: #ffd700; }

.stat-val {
  font-size: 10px;
  width: 60px;
  text-align: right;
}

.bio-box {
  background: rgba(0, 0, 0, 0.04);
  border: 2px dashed var(--bg-darkest);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bio-header {
  font-size: 13px;
  margin-bottom: 2px;
}

.bio-text {
  font-size: 11px;
  line-height: 1.6;
}

.quick-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}

.fact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 8px 10px;
  font-size: 11px;
  border-radius: 3px;
}

.fact-icon {
  font-size: 14px;
}
</style>
