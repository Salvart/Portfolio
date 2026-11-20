// Poses de cámara y recorrido zoom-out → desplazamiento → zoom-in.

import * as THREE from 'three'

export const TRANSITION_MS = 1400

// Posición de cada chip sobre la placa (coincide con Motherboard.js).
export const CHIP_POSITIONS = {
  cpu: new THREE.Vector3(-6.0, 0.42, 0.4),
  graphics: new THREE.Vector3(-2.0, 0.45, -1.1),
  memory: new THREE.Vector3(2.0, 0.4, 0.9),
  io: new THREE.Vector3(6.0, 0.4, -0.5)
}

const view = (chip, camera, look) => ({ chip, camera: new THREE.Vector3(...camera), look: new THREE.Vector3(...look) })

// Vista casi cenital: la cámara queda apenas desplazada en Z respecto al chip,
// mirando hacia abajo con una inclinación de ~8° respecto a la vertical.
// Distancia al chip duplicada respecto a la versión anterior: se ve más placa y los
// chips ocupan menos pantalla, conservando la inclinación de ~8° respecto a la vertical.
export const VIEWS = [
  view('cpu', [-6.0, 9.45, 1.7], [-6.0, 0.35, 0.4]),
  view('graphics', [-2.0, 9.6, 0.2], [-2.0, 0.4, -1.1]),
  view('memory', [2.0, 9.35, 2.2], [2.0, 0.35, 0.9]),
  view('io', [6.0, 9.45, 0.8], [6.0, 0.35, -0.5])
]

// Smootherstep: posición, velocidad y aceleración cero en los extremos.
// Evita el arranque y el frenado bruscos al entrar o salir de cada recorrido.
const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10)

// Parábola invertida: 0 al empezar, 1 en el punto medio y 0 al terminar.
// Aplicada al tiempo suavizado, describe el arco de alejamiento y acercamiento.
const parabola = (u) => 4 * u * (1 - u)

// Retroceso máximo en el vértice de la parábola. Nunca cruza el objetivo,
// para que la cámara no dé un giro de 180° al mirar siempre al chip.
const PULL_BACK_Y = 6.4
const PULL_BACK_Z = 4.4

export function createJourney(fromIndex, toIndex) {
  const from = VIEWS[fromIndex]
  const to = VIEWS[toIndex]

  return {
    duration: TRANSITION_MS,
    fromCamera: from.camera,
    toCamera: to.camera,
    fromLook: from.look,
    toLook: to.look,
    fromChip: from.chip,
    chip: to.chip
  }
}

const scratchPosition = new THREE.Vector3()
const scratchLook = new THREE.Vector3()

export function sampleJourney(journey, elapsed) {
  const progress = Math.min(1, Math.max(0, elapsed / journey.duration))
  const u = smootherstep(progress)
  const pull = parabola(u)

  // Desplazamiento lateral continuo entre chips, sin pausas intermedias.
  scratchPosition.copy(journey.fromCamera).lerp(journey.toCamera, u)
  scratchPosition.y += PULL_BACK_Y * pull
  scratchPosition.z += PULL_BACK_Z * pull

  scratchLook.copy(journey.fromLook).lerp(journey.toLook, u)

  return { position: scratchPosition, lookAt: scratchLook, progress }
}
