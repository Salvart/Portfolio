<template>
  <div class="boot-screen">
    <!-- Game Boy scene that zooms towards the camera -->
    <div class="gameboy-scene" :class="phase">
      <div class="scene-title">
        <span class="title-main">SALVADOR RUIZ</span>
        <span class="title-sub">PORTFOLIO</span>
      </div>

      <div class="gameboy">
        <!-- Cartridge slides into the top slot -->
        <img
          class="cartridge-img"
          :src="cartridgeImg"
          alt="Cartucho CV"
          :class="{ inserting: phase === 'insert' }"
        />

        <!-- Real Game Boy photo -->
        <img class="gameboy-img" :src="gameboyImg" alt="Game Boy" />

        <!-- Screen overlay: boot logo + brand + flash on the photo LCD -->
        <div
          class="screen-overlay"
          :class="{ 'screen-on': phase === 'boot' || phase === 'zoom' }"
        >
          <div v-if="phase !== 'idle' && phase !== 'insert'" class="boot-logo-window">
            <div class="boot-logo-track">
              <img class="boot-logo-img" :src="logoImg" alt="SALVADOR RUIZ" />
            </div>
          </div>
          <div v-if="phase === 'boot' || phase === 'zoom'" class="boot-brand-box">
            <span class="boot-brand-name">GAME BOY</span><span class="boot-brand-tm">TM</span>
          </div>
          <div v-if="phase === 'boot'" class="screen-flash"></div>
        </div>
      </div>
    </div>

    <!-- Button layer (does not zoom with the console) -->
    <div class="boot-foreground" :class="phase">
      <button class="ver-cv-btn" @click="startBoot">
        <span class="btn-hint">{{ insertHint }} ▼</span>
        <span class="btn-main">{{ viewCvLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import gameboyImg from '../assets/gameboy/gameboy.png'
import cartridgeImg from '../assets/gameboy/cartidage.png'
import logoImg from '../assets/gameboy/logo.png'
import { playSelectSFX, playLandingSFX, playBootChimeSFX } from '../utils/retroAudio.js'
import { t } from '../utils/i18n.js'

const emit = defineEmits(['complete'])

const insertHint = t('INSERTA CARTUCHO', 'INSERT CARTUCHO')
const viewCvLabel = t('VER CV', 'VIEW CV')

const phase = ref('idle')

let timers = []

function later(fn, ms) {
  timers.push(setTimeout(fn, ms))
}

function startBoot() {
  if (phase.value !== 'idle') return
  playSelectSFX()
  phase.value = 'insert'

  // Cartridge thud as it slots in
  later(() => playLandingSFX(), 450)

  // Power on: boot logo slides in
  later(() => { phase.value = 'boot' }, 800)

  // Boot chime + GAME BOY box + screen flash
  later(() => playBootChimeSFX(), 1950)

  // Screen rushes towards the camera
  later(() => { phase.value = 'zoom' }, 2750)

  // Swap to the CV experience
  later(() => emit('complete'), 4150)
}

onUnmounted(() => {
  timers.forEach(clearTimeout)
})
</script>

<style scoped>
.boot-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 50% 35%, #232a3d 0%, #12141a 55%, #0b0d14 100%);
  overflow: hidden;
  z-index: 100;
}

.gameboy-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  transform-origin: 50% 50%;
}

.gameboy-scene.zoom {
  animation: zoomIntoCamera 1.4s forwards;
}

@keyframes zoomIntoCamera {
  0%   { transform: scale(1); opacity: 1; }
  55%  { opacity: 1; }
  100% { transform: scale(16); opacity: 0; }
}

/* ---- Title ---- */
.scene-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #8bac0f;
  text-shadow: 0 0 14px rgba(139, 172, 15, 0.35);
}

.title-main {
  font-family: var(--font-pixel);
  font-size: 20px;
  letter-spacing: 2px;
}

.title-sub {
  font-family: var(--font-vt);
  font-size: 16px;
  letter-spacing: 6px;
  opacity: 0.8;
}

/* ---- Game Boy console ---- */
.gameboy {
  position: relative;
  width: 380px;
  filter: drop-shadow(0 26px 45px rgba(0, 0, 0, 0.55));
}

.gameboy-img {
  display: block;
  width: 100%;
  height: auto;
}

/* Cartridge (image) slides into the top slot */
.cartridge-img {
  position: absolute;
  top: -58px;
  left: 50%;
  z-index: 12;
  width: 110px;
  height: auto;
  transform: translate(-50%, -280px) rotate(-8deg);
  transition: transform 0.55s cubic-bezier(0.35, 0.8, 0.4, 1);
  filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.5));
}

.cartridge-img.inserting {
  transform: translate(-50%, 0) rotate(0deg);
}

/* Screen overlay aligned to the LCD in the photo:
   x 95..629 (13.3%..88.3%), y 181..486 (16.1%..43.3%) */
.screen-overlay {
  position: absolute;
  left: 13.34%;
  top: 16.13%;
  width: 75%;
  height: 27.2%;
  background: #0a1a0a;
  border-radius: 2px;
  overflow: hidden;
  z-index: 10;
}

.screen-overlay.screen-on {
  background: linear-gradient(var(--bg-light), var(--bg-lightest));
}

/* Boot logo window (Nintendo-style logo bar) */
.boot-logo-window {
  position: absolute;
  top: 8%;
  left: 6%;
  right: 6%;
  height: 66%;
  border: 2px solid var(--bg-darkest);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
}

.boot-logo-track {
  width: 100%;
  height: 100%;
  animation: logoSlide 1.15s cubic-bezier(0.2, 0.7, 0.3, 1) both;
}

.boot-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes logoSlide {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

/* GAME BOY brand box */
.boot-brand-box {
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid var(--bg-darkest);
  padding: 2px 12px 4px;
  background: rgba(0, 0, 0, 0.05);
  animation: brandPop 0.4s ease 1.15s both;
}

.boot-brand-name {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--bg-darkest);
}

.boot-brand-tm {
  font-family: var(--font-vt);
  font-size: 8px;
  color: var(--bg-darkest);
  vertical-align: super;
  margin-left: 2px;
}

@keyframes brandPop {
  from { opacity: 0; transform: translateX(-50%) scale(0.7); }
  to   { opacity: 1; transform: translateX(-50%) scale(1); }
}

/* Brief white flash like the real boot */
.screen-flash {
  position: absolute;
  inset: 0;
  background: #e8ffce;
  animation: screenFlash 0.3s ease-out 1.15s both;
}

@keyframes screenFlash {
  0%   { opacity: 0; }
  30%  { opacity: 0.85; }
  100% { opacity: 0; }
}

/* ---- Foreground button ---- */
.boot-foreground {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.boot-foreground.zoom,
.boot-foreground.boot {
  opacity: 0;
  pointer-events: none;
}

.ver-cv-btn {
  cursor: pointer;
  background: var(--bg-darkest);
  border: 3px solid var(--bg-light);
  color: var(--bg-lightest);
  font-family: var(--font-pixel);
  padding: 14px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.4);
  transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.15s ease;
}

.ver-cv-btn:hover {
  background: var(--bg-dark);
}

.ver-cv-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
}

.btn-hint {
  font-size: 8px;
  color: var(--bg-light);
  letter-spacing: 1px;
}

.btn-main {
  font-size: 16px;
  letter-spacing: 3px;
}

/* Small screens: scale the whole scene down */
@media (max-width: 620px) {
  .gameboy-scene {
    transform: scale(0.68);
  }
  .boot-foreground {
    bottom: 18px;
  }
}
</style>
