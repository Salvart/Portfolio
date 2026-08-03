<template>
  <div class="studies-section">
    <!-- Header -->
    <div class="section-badge">
      <span class="badge-title">QUEST LOG (ESTUDIOS)</span>
      <span class="badge-level">COMPLETED: {{ quests.length }}/{{ quests.length }}</span>
    </div>

    <!-- Timeline Quest List -->
    <div class="quest-list">
      <div 
        v-for="(quest, idx) in quests" 
        :key="quest.title"
        class="quest-card"
      >
        <div class="quest-status">
          <span class="quest-icon">🏆</span>
          <span class="quest-step">QUEST #0{{ idx + 1 }}</span>
        </div>

        <div class="quest-content">
          <div class="quest-header">
            <h4 class="quest-title">{{ quest.title }}</h4>
            <span class="quest-year">{{ quest.period }}</span>
          </div>

          <div class="quest-institution">
            <span class="institution-icon">🏛️</span>
            <span>{{ quest.institution }}</span>
          </div>

          <p class="quest-desc">{{ quest.description }}</p>

          <div class="rewards-box">
            <span class="reward-label">RECOMPENSAS:</span>
            <div class="reward-chips">
              <span v-for="skill in quest.rewards" :key="skill" class="reward-chip">
                + {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const quests = [
  {
    title: 'Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
    institution: 'Centro de Formación Técnica',
    period: '2022 - 2024',
    description: 'Especialización en desarrollo backend, frontend, arquitectura de software, bases de datos relacionales y despliegue de aplicaciones.',
    rewards: ['JavaScript', 'Vue.js', 'Node.js / Express', 'SQL & Databases', 'Git & CI/CD']
  },
  {
    title: 'Especialización en Frontend Moderno & Vue.js 3 Ecosystem',
    institution: 'Platzi / Udemy Academy',
    period: '2023 - 2024',
    description: 'Mastery en reactividad con Composition API, Pinia, Vue Router, TypeScript y optimización de rendimiento en clientes web.',
    rewards: ['Composition API', 'Pinia', 'PWA', 'TypeScript', 'Web Performance']
  },
  {
    title: 'Certificación en Diseño de Interfaces (UI/UX) & Responsive Web',
    institution: 'FreeCodeCamp',
    period: '2023',
    description: 'Formación en accesibilidad web (a11y), HTML5 semántico, diseño adaptativo mobile-first y sistemas de diseño.',
    rewards: ['Responsive Layouts', 'CSS Grid/Flexbox', 'Accessibility A11y', 'Figma Wireframing']
  }
]
</script>

<style scoped>
.studies-section {
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

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.quest-card {
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.04);
  border: 3px solid var(--bg-darkest);
  padding: 10px;
  border-radius: 4px;
  position: relative;
}

@media (max-width: 550px) {
  .quest-card {
    flex-direction: column;
  }
}

.quest-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 8px;
  border-radius: 4px;
  min-width: 90px;
}

.quest-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

.quest-step {
  font-size: 9px;
  font-weight: bold;
}

.quest-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.quest-title {
  font-size: 12px;
  color: var(--bg-darkest);
  line-height: 1.4;
}

.quest-year {
  font-size: 10px;
  background: var(--bg-dark);
  color: var(--bg-lightest);
  padding: 3px 6px;
  border-radius: 3px;
  white-space: nowrap;
}

.quest-institution {
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;
}

.quest-desc {
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.95;
}

.rewards-box {
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.05);
  padding: 6px;
  border: 1px dashed var(--bg-darkest);
}

.reward-label {
  font-size: 9px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
}

.reward-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.reward-chip {
  font-size: 9px;
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 3px 6px;
  border-radius: 2px;
}
</style>
