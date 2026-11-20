// Poses de cámara y recorrido zoom-out → desplazamiento → zoom-in.

import * as THREE from 'three'

export const TRANSITION_MS = 1900

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

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Se retrocede alejando la cámara del chip (+Z), nunca cruzando por detrás:
// cruzar el objetivo provocaría un giro brusco de 180° al mirar siempre al chip.
const pulledBack = (vector) => new THREE.Vector3(vector.x, vector.y + 6.4, vector.z + 4.4)
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
