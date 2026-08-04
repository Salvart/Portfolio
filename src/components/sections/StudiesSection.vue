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
          <span class="quest-icon">★</span>
          <span class="quest-step">QUEST #0{{ idx + 1 }}</span>
        </div>

        <div class="quest-content">
          <div class="quest-header">
            <h4 class="quest-title">{{ quest.title }}</h4>
            <span class="quest-year">{{ quest.period }}</span>
          </div>

          <div class="quest-institution">
            <span class="institution-icon">◈</span>
            <span>{{ quest.institution }}</span>
          </div>

          <p class="quest-desc">{{ quest.description }}</p>

          <div class="rewards-box">
            <span class="reward-label">{{ rewardsLabel }}:</span>
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
import { computed } from 'vue'
import { lang, t } from '../../utils/i18n.js'

const rewardsLabel = t('RECOMPENSAS', 'REWARDS')

const questsDef = [
  {
    id: 1,
    title: { es: 'Grado en Diseño y Desarrollo de Videojuegos', en: 'Degree in Video Game Design and Development' },
    institution: { es: 'ESNE – Escuela Universitaria de Diseño, Innovación y Tecnología (Madrid)', en: 'ESNE – University School of Design, Innovation and Technology (Madrid)' },
    period: '2011 - 2017',
    description: {
      es: 'Formación integral en producción de videojuegos: programación en C, C# y Java, modelado y escultura de personajes, diseño y gamificación, animación 2D/3D, preproducción y producción, arte conceptual y middleware de desarrollo. Staff en eventos como Madrid Games Week y FICOD.',
      en: 'Comprehensive training in video game production: programming in C, C# and Java, character modeling and sculpting, design and gamification, 2D/3D animation, pre-production and production, concept art and development middleware. Staff at events such as Madrid Games Week and FICOD.'
    },
    rewards: ['C++ / C# Scripting', '3D Studio Max', 'ZBrush', 'Game Design', '3D Animation', 'Unreal Engine', 'Concept Art']
  },
  {
    id: 2,
    title: { es: 'Grado Superior en Administración de Sistemas Informáticos en Red', en: 'Higher Degree in Network Computer Systems Administration' },
    institution: { es: 'IES Santa María del Castillo', en: 'IES Santa María del Castillo' },
    period: '2007 - 2009',
    description: {
      es: 'Especialización en administración de redes y sistemas: instalación y configuración de servidores, seguridad, redes locales y gestión de infraestructuras informáticas.',
      en: 'Specialization in network and systems administration: server installation and configuration, security, local networks and management of IT infrastructures.'
    },
    rewards: ['Administración de Redes', 'Sistemas Operativos', 'Seguridad', 'Bases de Datos', 'Infraestructura IT']
  },
  {
    id: 3,
    title: { es: 'Grado Medio en Equipos Electrónicos de Consumo', en: 'Intermediate Degree in Consumer Electronic Equipment' },
    institution: { es: 'I.E.S. Santa María del Castillo (Buitrago del Lozoya)', en: 'I.E.S. Santa María del Castillo (Buitrago del Lozoya)' },
    period: '2008 - 2010',
    description: {
      es: 'Grado Medio en Electricidad y Electrónica de Consumo en el centro I.E.S. Santa María del Castillo (Buitrago del Lozoya).',
      en: 'Intermediate Degree in Electricity and Consumer Electronics at I.E.S. Santa María del Castillo (Buitrago del Lozoya).'
    },
    rewards: ['Electricidad', 'Electrónica de Consumo', 'Hardware', 'Sistemas Electrotécnicos']
  }
]

const quests = computed(() =>
  questsDef.map((q) => ({
    ...q,
    title: q.title[lang.value],
    institution: q.institution[lang.value],
    description: q.description[lang.value]
  }))
)
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
