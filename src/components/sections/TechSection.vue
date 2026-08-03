<template>
  <div class="tech-section">
    <!-- Header -->
    <div class="section-badge">
      <span class="badge-title">INVENTORY & SKILL TREE</span>
      <span class="badge-level">ITEMS: {{ totalSkills }}</span>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :class="['tab-btn', { active: activeTab === cat.id }]"
        @click="activeTab = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Inventory Skill Grid -->
    <div class="skills-grid">
      <div 
        v-for="skill in filteredSkills" 
        :key="skill.name"
        class="skill-card"
      >
        <div class="skill-icon-box">
          <span class="skill-symbol">{{ skill.icon }}</span>
        </div>
        <div class="skill-info">
          <div class="skill-header">
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-lvl">Lvl. {{ skill.level }}</span>
          </div>
          <div class="skill-progress">
            <div class="skill-fill" :style="{ width: skill.percent + '%' }"></div>
          </div>
          <span class="skill-desc">{{ skill.experience }}</span>
        </div>
      </div>
    </div>

    <!-- Equipment / Mastered Stack -->
    <div class="equipment-box">
      <h4 class="box-title">▶ EQUIPAMIENTO PRINCIPAL</h4>
      <div class="equipped-tags">
        <span class="equipped-tag">★ Vue.js 3</span>
        <span class="equipped-tag">★ JavaScript (ES6+)</span>
        <span class="equipped-tag">★ HTML5 & CSS3</span>
        <span class="equipped-tag">★ Node.js / Express</span>
        <span class="equipped-tag">★ Git & GitHub</span>
        <span class="equipped-tag">★ REST APIs</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

const categories = [
  { id: 'all', label: 'TODO' },
  { id: 'frontend', label: 'FRONTEND' },
  { id: 'backend', label: 'BACKEND' },
  { id: 'tools', label: 'TOOLS' }
]

const skills = [
  // Frontend
  { name: 'Vue.js', category: 'frontend', icon: '💚', level: 95, percent: 95, experience: 'Expert' },
  { name: 'JavaScript (ES6+)', category: 'frontend', icon: '⚡', level: 92, percent: 92, experience: 'Advanced' },
  { name: 'HTML5 / CSS3', category: 'frontend', icon: '🎨', level: 96, percent: 96, experience: 'Expert' },
  { name: 'TypeScript', category: 'frontend', icon: '📘', level: 85, percent: 85, experience: 'Proficient' },
  { name: 'Tailwind / Vanilla CSS', category: 'frontend', icon: '✨', level: 90, percent: 90, experience: 'Advanced' },
  
  // Backend
  { name: 'Node.js', category: 'backend', icon: '🟢', level: 88, percent: 88, experience: 'Advanced' },
  { name: 'Express.js', category: 'backend', icon: '🚀', level: 86, percent: 86, experience: 'Advanced' },
  { name: 'REST APIs / JSON', category: 'backend', icon: '🔗', level: 92, percent: 92, experience: 'Expert' },
  { name: 'SQL / Databases', category: 'backend', icon: '🗄️', level: 80, percent: 80, experience: 'Proficient' },
  
  // Tools
  { name: 'Git & GitHub', category: 'tools', icon: '🐙', level: 90, percent: 90, experience: 'Advanced' },
  { name: 'Vite / Webpack', category: 'tools', icon: '⚡', level: 88, percent: 88, experience: 'Advanced' },
  { name: 'Figma / UI Design', category: 'tools', icon: '📐', level: 82, percent: 82, experience: 'Proficient' }
]

const totalSkills = skills.length

const filteredSkills = computed(() => {
  if (activeTab.value === 'all') return skills
  return skills.filter(s => s.category === activeTab.value)
})
</script>

<style scoped>
.tech-section {
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

.category-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tab-btn {
  font-family: var(--font-pixel);
  font-size: 10px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.08);
  border: 2px solid var(--bg-darkest);
  color: var(--bg-darkest);
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.tab-btn:hover, .tab-btn.active {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.04);
  border: 2px solid var(--bg-darkest);
  padding: 8px;
  border-radius: 4px;
}

.skill-icon-box {
  width: 36px;
  height: 36px;
  background: var(--bg-darkest);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: 3px;
}

.skill-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: bold;
}

.skill-lvl {
  font-size: 10px;
  opacity: 0.85;
}

.skill-progress {
  height: 8px;
  background: var(--bg-dark);
  border: 1px solid var(--bg-darkest);
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: var(--bg-lightest);
}

.skill-desc {
  font-size: 9px;
  opacity: 0.8;
}

.equipment-box {
  background: rgba(0, 0, 0, 0.05);
  border: 2px dashed var(--bg-darkest);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.box-title {
  font-size: 12px;
}

.equipped-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.equipped-tag {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 3px;
}
</style>
