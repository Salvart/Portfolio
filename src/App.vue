<template>
  <!-- Boot sequence first, then the fullscreen Game Boy application -->
  <Transition name="boot-swap" mode="out-in">
    <BootScreen v-if="!booted" @complete="onBootComplete" />
    <GameBoyFrame v-else :start-with-music="true" />
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BootScreen from './components/BootScreen.vue'
import GameBoyFrame from './components/GameBoyFrame.vue'

const booted = ref(false)

function onBootComplete() {
  booted.value = true
}
</script>

<style scoped>
.boot-swap-enter-active {
  transition: opacity 0.45s ease;
}

.boot-swap-leave-active {
  transition: opacity 0.25s ease;
}

.boot-swap-enter-from,
.boot-swap-leave-to {
  opacity: 0;
}
</style>
