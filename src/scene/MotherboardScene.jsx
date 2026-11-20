import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createMotherboard } from './Motherboard.js'
import { VIEWS, createJourney, sampleJourney } from './cameraJourney.js'

export default function MotherboardScene({ index, reducedMotion }) {
  const hostRef = useRef(null)
  const stateRef = useRef(null)
  const [failed, setFailed] = useState(false)

  // Creación y limpieza de la escena. Solo se recrea si cambia la preferencia de movimiento.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch (error) {
      console.warn('WebGL no disponible; se muestra la versión de texto.', error)
      setFailed(true)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setSize(host.clientWidth, Math.max(1, host.clientHeight))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050b09)
    scene.fog = new THREE.FogExp2(0x050b09, 0.035)

    const camera = new THREE.PerspectiveCamera(
      45,
      host.clientWidth / Math.max(1, host.clientHeight),
      0.1,
      100
    )
    camera.position.copy(VIEWS[index].camera)
    camera.lookAt(VIEWS[index].look)

    scene.add(new THREE.AmbientLight(0x7d9a8b, 0.7))
    const keyLight = new THREE.DirectionalLight(0xffe0b0, 1.25)
    keyLight.position.set(4, 8, 6)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x49c9b2, 0.55)
    rimLight.position.set(-6, 4, -5)
    scene.add(rimLight)

    const board = createMotherboard()
    scene.add(board.group)

    const state = {
      camera,
      renderer,
      scene,
      board,
      highlights: board.highlights,
      currentIndex: index,
      journey: null,
      pointer: { x: 0, y: 0, smoothX: 0, smoothY: 0 },
      frame: 0
    }
    stateRef.current = state

    const draw = (now) => {
      const current = stateRef.current
      if (!current) return

      let position = VIEWS[current.currentIndex].camera
      let lookAt = VIEWS[current.currentIndex].look
      let progress = 1
      let fromChip = VIEWS[current.currentIndex].chip
      let toChip = fromChip

      if (current.journey) {
        const sample = sampleJourney(current.journey, now - current.journey.start)
        position = sample.position
        lookAt = sample.lookAt
        progress = sample.progress
        fromChip = current.journey.fromChip
        toChip = current.journey.chip
        if (progress >= 1) current.journey = null
      }

      const { pointer } = current
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.06
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.06
      const driftX = reducedMotion ? 0 : pointer.smoothX * 0.18
      const driftY = reducedMotion ? 0 : pointer.smoothY * 0.12

      current.camera.position.set(position.x + driftX, position.y + driftY, position.z)
      current.camera.lookAt(lookAt)

      Object.entries(current.highlights).forEach(([id, material]) => {
        let intensity = 0
        if (id === toChip) intensity = 0.65 * (current.journey ? progress : 1)
        if (id === fromChip && fromChip !== toChip) {
          intensity = Math.max(intensity, current.journey ? 0.65 * (1 - progress) : 0)
        }
        material.emissiveIntensity = intensity > 0 ? intensity + Math.sin(now * 0.003) * 0.06 : 0
      })

      current.renderer.render(current.scene, current.camera)
      current.frame = requestAnimationFrame(draw)
    }

    const startLoop = () => {
      const current = stateRef.current
      if (!current || current.frame) return
      current.frame = requestAnimationFrame(draw)
    }
    const stopLoop = () => {
      const current = stateRef.current
      if (!current) return
      cancelAnimationFrame(current.frame)
      current.frame = 0
    }

    const onPointerMove = (event) => {
      const current = stateRef.current
      if (!current) return
      current.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      current.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    const onResize = () => {
      const current = stateRef.current
      if (!current) return
      const width = host.clientWidth
      const height = Math.max(1, host.clientHeight)
      current.camera.aspect = width / height
      current.camera.updateProjectionMatrix()
      current.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
      current.renderer.setSize(width, height)
    }
    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else startLoop()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    if (!document.hidden) startLoop()

    return () => {
      stopLoop()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)

      const current = stateRef.current
      stateRef.current = null
      if (!current) return

      current.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (!object.material) return
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (material.map) material.map.dispose()
          material.dispose()
        })
      })
      current.renderer.dispose()
      if (current.renderer.domElement.parentNode === host) {
        host.removeChild(current.renderer.domElement)
      }
    }
    // La escena no se reconstruye al cambiar de sección: solo se mueve la cámara.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  // Coreografía de cámara al cambiar de chip.
  useEffect(() => {
    const current = stateRef.current
    if (!current || current.currentIndex === index) return

    const from = current.currentIndex
    current.currentIndex = index

    if (reducedMotion) {
      current.journey = null
      current.camera.position.copy(VIEWS[index].camera)
      current.camera.lookAt(VIEWS[index].look)
      return
    }

    current.journey = { ...createJourney(from, index), start: performance.now() }
  }, [index, reducedMotion])

  return <div ref={hostRef} className={failed ? 'scene-canvas scene-fallback' : 'scene-canvas'} aria-hidden="true" />
}
