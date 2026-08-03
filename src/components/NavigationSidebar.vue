<template>
  <div class="navigation-sidebar">
    <div class="sidebar-header">
      <span class="header-icon">🕹️</span>
      <span class="header-text">MENÚ</span>
    </div>

    <nav class="vertical-box-menu">
      <button
        v-for="(item, index) in menuItems"
        :key="item.id"
        :class="['menu-item-btn', { active: activeIndex === index }]"
        @click="onSelect(index)"
        @mouseenter="playSelectSFX"
      >
        <span class="cursor-indicator" :class="{ visible: activeIndex === index }">▶</span>
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-label">{{ item.name }}</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <span class="footer-hint">SELECCIONA PARA VIAJAR</span>
    </div>
  </div>
</template>

<script setup>
import { playSelectSFX } from '../utils/retroAudio.js'

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0
  },
  menuItems: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select'])

function onSelect(index) {
  playSelectSFX()
  emit('select', index)
}
</script>

<style scoped>
.navigation-sidebar {
  width: 170px;
  background: rgba(0, 0, 0, 0.08);
  border-right: 3px solid var(--bg-darkest);
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  flex-shrink: 0;
}

@media (max-width: 650px) {
  .navigation-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 3px solid var(--bg-darkest);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  padding: 6px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
}

.vertical-box-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

@media (max-width: 650px) {
  .vertical-box-menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .menu-item-btn {
    flex: 1;
    min-width: 120px;
  }
}

.menu-item-btn {
  font-family: var(--font-pixel);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.04);
  border: 3px solid var(--bg-darkest);
  padding: 10px 8px;
  color: var(--bg-darkest);
  cursor: pointer;
  text-align: left;
  border-radius: 4px;
  transition: all 0.1s ease;
  position: relative;
}

.menu-item-btn:hover {
  background: rgba(0, 0, 0, 0.12);
}

.menu-item-btn.active {
  background: var(--bg-darkest);
  color: var(--bg-lightest);
  border-color: var(--bg-dark);
  box-shadow: 3px 3px 0 var(--bg-dark);
}

.cursor-indicator {
  font-size: 11px;
  opacity: 0;
  color: var(--bg-lightest);
}

.cursor-indicator.visible {
  opacity: 1;
  animation: pulse-cursor 0.6s infinite alternate;
}

@keyframes pulse-cursor {
  0% { transform: translateX(0); }
  100% { transform: translateX(4px); }
}

.menu-icon {
  font-size: 14px;
}

.menu-label {
  font-size: 10px;
  white-space: nowrap;
}

.sidebar-footer {
  font-size: 8px;
  text-align: center;
  opacity: 0.85;
  padding-top: 6px;
  border-top: 2px dashed var(--bg-darkest);
}
</style>
