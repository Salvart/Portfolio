// Poses de cámara y recorrido zoom-out → desplazamiento → zoom-in.

import * as THREE from 'three'

export const TRANSITION_MS = 1900

// Posición de cada chip sobre la placa (coincide con Motherboard.js).
export const CHIP_POSITIONS = {
  cpu: new THREE.Vector3(-3.2, 0.42, 0.3),
  graphics: new THREE.Vector3(-1.0, 0.45, -0.6),
  memory: new THREE.Vector3(1.4, 0.4, 0.6),
  io: new THREE.Vector3(3.6, 0.4, -0.2)
}

const view = (chip, camera, look) => ({ chip, camera: new THREE.Vector3(...camera), look: new THREE.Vector3(...look) })

// Vista casi cenital: la cámara queda apenas desplazada en Z respecto al chip,
// mirando hacia abajo con una inclinación de ~8° respecto a la vertical.
export const VIEWS = [
  view('cpu', [-3.2, 4.9, 0.95], [-3.2, 0.35, 0.3]),
  view('graphics', [-1.0, 5.0, 0.05], [-1.0, 0.4, -0.6]),
  view('memory', [1.4, 4.85, 1.25], [1.4, 0.35, 0.6]),
  view('io', [3.6, 4.9, 0.45], [3.6, 0.35, -0.2])
]

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Se retrocede alejando la cámara del chip (+Z), nunca cruzando por detrás:
// cruzar el objetivo provocaría un giro brusco de 180° al mirar siempre al chip.
const pulledBack = (vector) => new THREE.Vector3(vector.x, vector.y + 3.2, vector.z + 2.2)
const boardLevel = (vector) => new THREE.Vector3(vector.x, 0.35, vector.z)

export function createJourney(fromIndex, toIndex) {
  const from = VIEWS[fromIndex]
  const to = VIEWS[toIndex]

  return {
    duration: TRANSITION_MS,
    camera: [from.camera, pulledBack(from.camera), pulledBack(to.camera), to.camera],
    look: [from.look, boardLevel(from.look), boardLevel(to.look), to.look],
    fromChip: from.chip,
    chip: to.chip
  }
}

const scratchPosition = new THREE.Vector3()
const scratchLook = new THREE.Vector3()

export function sampleJourney(journey, elapsed) {
  const progress = Math.min(1, Math.max(0, elapsed / journey.duration))
  const scaled = progress * 3
  const segment = Math.min(2, Math.floor(scaled))
  const local = easeInOutCubic(scaled - segment)

  scratchPosition.copy(journey.camera[segment]).lerp(journey.camera[segment + 1], local)
  scratchLook.copy(journey.look[segment]).lerp(journey.look[segment + 1], local)

  return { position: scratchPosition, lookAt: scratchLook, progress }
}
