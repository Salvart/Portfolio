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
        <div class="cartridge" :class="{ inserting: phase === 'insert' }">
          <div class="cartridge-body">
            <span class="cartridge-label">CV</span>
          </div>
          <div class="cartridge-grip"></div>
        </div>

        <!-- Top cartridge slot cover (in front of the cartridge) -->
        <div class="gb-top-slot"></div>

        <div class="gb-shell">
          <!-- Screen -->
          <div class="gb-bezel">
            <div class="gb-screen" :class="{ 'screen-on': phase === 'boot' || phase === 'zoom' }">
              <div v-if="phase !== 'idle' && phase !== 'insert'" class="boot-logo-window">
                <div class="boot-logo-text">SALVADOR RUIZ</div>
              </div>
              <div v-if="phase === 'boot' || phase === 'zoom'" class="boot-brand-box">
                <span class="boot-brand-name">GAME BOY</span><span class="boot-brand-tm">TM</span>
              </div>
              <div v-if="phase === 'boot'" class="screen-flash"></div>
            </div>
            <div class="bezel-text">DOT MATRIX WITH STEREO SOUND</div>
          </div>

          <!-- Controls -->
          <div class="gb-controls">
            <div class="gb-dpad">
              <div class="dpad-cross"></div>
            </div>
            <div class="gb-buttons">
              <div class="gb-btn btn-b">B</div>
              <div class="gb-btn btn-a">A</div>
            </div>
          </div>

          <div class="gb-brand-footer">Nintendo GAME BOY™</div>

          <!-- Speaker grill -->
          <div class="gb-speaker">
            <div v-for="n in 6" :key="n" class="speaker-bar"></div>
          </div>
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

/* ---- Game Boy Console ---- */
.gameboy {
  position: relative;
  width: 360px;
  height: 560px;
}

/* Cartridge */
.cartridge {
  position: absolute;
  top: 6px;
  left: 50%;
  z-index: 12;
  transform: translate(-50%, -280px) rotate(-8deg);
  transition: transform 0.55s cubic-bezier(0.35, 0.8, 0.4, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cartridge.inserting {
  transform: translate(-50%, 6px) rotate(0deg);
}

.cartridge-grip {
  width: 74px;
  height: 8px;
  background: #161616;
  border: 2px solid #000;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.cartridge-body {
  width: 120px;
  height: 58px;
  background: #2b2b2b;
  border: 2px solid #0d0d0d;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 0 #4a4a4a;
}

.cartridge-label {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: #d7d3d1;
  letter-spacing: 2px;
  background: #1c1c1c;
  padding: 6px 12px;
  border-radius: 2px;
  border: 1px solid #000;
}

/* Slot cover sits in front of the inserted cartridge */
.gb-top-slot {
  position: absolute;
  top: -4px;
  left: 72px;
  right: 72px;
  height: 30px;
  background: linear-gradient(#b0aaa7, #857f7c);
  border: 2px solid var(--shell-border);
  border-radius: 8px;
  z-index: 14;
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.4), 0 2px 3px rgba(0, 0, 0, 0.3);
}

/* Shell */
.gb-shell {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(160deg, var(--shell-color) 0%, var(--shell-dark) 100%);
  border-radius: 14px 14px 20px 20px;
  border: 2px solid var(--shell-border);
  box-shadow:
    inset 0 -8px 14px rgba(0, 0, 0, 0.25),
    inset 0 4px 6px rgba(255, 255, 255, 0.35),
    0 24px 60px rgba(0, 0, 0, 0.55);
}

/* Screen bezel */
.gb-bezel {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  width: 290px;
  padding: 14px 12px 10px;
  background: var(--screen-bezel);
  border-radius: 8px;
  border: 2px solid #3c3f55;
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.5),
    inset 0 -2px 2px rgba(255, 255, 255, 0.12);
}

.gb-screen {
  position: relative;
  height: 150px;
  background: #0a1a0a;
  border-radius: 3px;
  border: 3px solid #2c2f44;
  overflow: hidden;
}

.gb-screen.screen-on {
  background: linear-gradient(var(--bg-light), var(--bg-lightest));
}

.bezel-text {
  margin-top: 8px;
  font-size: 7px;
  letter-spacing: 1px;
  color: #9aa0c8;
  text-align: center;
  font-family: var(--font-vt);
}

/* Boot logo window (Nintendo-style logo bar) */
.boot-logo-window {
  position: absolute;
  top: 26px;
  left: 18px;
  right: 18px;
  height: 30px;
  border: 2px solid var(--bg-darkest);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
}

.boot-logo-text {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--bg-darkest);
  white-space: nowrap;
  line-height: 26px;
  padding-left: 6px;
  animation: logoSlide 1.15s cubic-bezier(0.2, 0.7, 0.3, 1) both;
}

@keyframes logoSlide {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

/* GAME BOY brand box */
.boot-brand-box {
  position: absolute;
  top: 66px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid var(--bg-darkest);
  padding: 4px 14px 6px;
  background: rgba(0, 0, 0, 0.05);
  animation: brandPop 0.4s ease 1.15s both;
}

.boot-brand-name {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: var(--bg-darkest);
}

.boot-brand-tm {
  font-family: var(--font-vt);
  font-size: 9px;
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

/* Controls */
.gb-controls {
  position: absolute;
  top: 250px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gb-dpad {
  width: 96px;
  height: 96px;
  background: #1d1d1d;
  border-radius: 10px;
  border: 2px solid #0a0a0a;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.08), 0 2px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dpad-cross {
  width: 34px;
  height: 34px;
  background: #2b2b2b;
  border: 2px solid #111;
  position: relative;
}

.dpad-cross::before,
.dpad-cross::after {
  content: '';
  position: absolute;
  background: #2b2b2b;
  border: 2px solid #111;
}

.dpad-cross::before {
  width: 34px;
  height: 60px;
  left: -13px;
  top: -15px;
}

.dpad-cross::after {
  width: 60px;
  height: 34px;
  top: -13px;
  left: -15px;
}

.gb-buttons {
  display: flex;
  gap: 18px;
}

.gb-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-pixel);
  font-size: 12px;
  color: #ff94b4;
  background: #8b1d42;
  border: 3px solid #4a0c20;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.35);
}

.gb-brand-footer {
  position: absolute;
  top: 382px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--font-pixel);
  font-size: 9px;
  color: var(--shell-border);
  letter-spacing: 1px;
}

/* Speaker grill */
.gb-speaker {
  position: absolute;
  bottom: 22px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  transform: rotate(-25deg);
}

.speaker-bar {
  width: 6px;
  height: 34px;
  background: var(--shell-dark);
  border-radius: 3px;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.4);
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
