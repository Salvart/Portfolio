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
    title: 'Grado en Diseño y Desarrollo de Videojuegos',
    institution: 'ESNE – Escuela Universitaria de Diseño, Innovación y Tecnología (Madrid)',
    period: '2011 - 2017',
    description: 'Formación integral en producción de videojuegos: programación en C, C# y Java, modelado y escultura de personajes, diseño y gamificación, animación 2D/3D, preproducción y producción, arte conceptual y middleware de desarrollo. Staff en eventos como Madrid Games Week y FICOD.',
    rewards: ['C++ / C# Scripting', '3D Studio Max', 'ZBrush', 'Game Design', '3D Animation', 'Unreal Engine', 'Concept Art']
  },
  {
    title: 'Grado Superior en Administración de Sistemas Informáticos en Red',
    institution: 'IES Santa María del Castillo',
    period: '2007 - 2009',
    description: 'Especialización en administración de redes y sistemas: instalación y configuración de servidores, seguridad, redes locales y gestión de infraestructuras informáticas.',
    rewards: ['Administración de Redes', 'Sistemas Operativos', 'Seguridad', 'Bases de Datos', 'Infraestructura IT']
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
