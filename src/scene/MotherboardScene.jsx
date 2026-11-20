import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { BOARD_DEPTH, BOARD_WIDTH, createMotherboard } from './Motherboard.js'
import { VIEWS, createJourney, sampleJourney } from './cameraJourney.js'
import { LensVhsShader } from './lensVhsShader.js'
import { SharpenShader } from './sharpenShader.js'
import { VignetteHorizontalBlurShader, VignetteVerticalBlurShader } from './vignetteBlurShader.js'

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
    renderer.toneMappingExposure = 1.25
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050b09)
    scene.fog = new THREE.FogExp2(0x050b09, 0.018)

    const camera = new THREE.PerspectiveCamera(
      45,
      host.clientWidth / Math.max(1, host.clientHeight),
      0.1,
      100
    )
    camera.position.copy(VIEWS[index].camera)
    camera.lookAt(VIEWS[index].look)

    // Iluminación de fondo muy baja: el foco del cursor es la fuente principal.
    scene.add(new THREE.AmbientLight(0xa9c4b6, 0.3))
    scene.add(new THREE.HemisphereLight(0xd4efe3, 0x0c2018, 0.25))

    const keyLight = new THREE.DirectionalLight(0xffe8c4, 0.7)
    keyLight.position.set(5, 9, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    keyLight.shadow.camera.left = -11
    keyLight.shadow.camera.right = 11
    keyLight.shadow.camera.top = 7
    keyLight.shadow.camera.bottom = -7
    keyLight.shadow.camera.near = 1
    keyLight.shadow.camera.far = 30
    keyLight.shadow.bias = -0.0005
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x74e3c9, 0.25)
    rimLight.position.set(-6, 5, -4)
    scene.add(rimLight)
    const fillLight = new THREE.PointLight(0xffd9a0, 16, 40)
    fillLight.position.set(0, 7, 8)
    scene.add(fillLight)

    // Foco ligado al ratón: no mueve la cámara, ilumina el punto de la placa bajo el cursor.
    const mouseLight = new THREE.SpotLight(0xfff2d8, 35, 14, 0.55, 0.75, 2)
    mouseLight.position.set(0, 3.4, 0)
    mouseLight.castShadow = true
    mouseLight.shadow.mapSize.set(1024, 1024)
    mouseLight.shadow.camera.near = 0.5
    mouseLight.shadow.camera.far = 14
    mouseLight.shadow.bias = -0.0005
    scene.add(mouseLight)
    scene.add(mouseLight.target)

    const board = createMotherboard()
    board.group.traverse((object) => {
      if (!object.isMesh) return
      const material = Array.isArray(object.material) ? object.material[0] : object.material
      object.receiveShadow = true
      object.castShadow = !material.transparent
    })
    scene.add(board.group)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const lensPass = new ShaderPass(LensVhsShader)
    composer.addPass(lensPass)

    // Gaussian blur con viñeta y realce suave.
    const blurX = new ShaderPass(VignetteHorizontalBlurShader)
    const blurY = new ShaderPass(VignetteVerticalBlurShader)
    const sharpenPass = new ShaderPass(SharpenShader)
    sharpenPass.uniforms.uResolution.value = new THREE.Vector2(1, 1)
    composer.addPass(blurX)
    composer.addPass(blurY)
    composer.addPass(sharpenPass)
    composer.addPass(new OutputPass())

    const syncPostProcessing = (width, height, pixelRatio) => {
      const renderWidth = Math.max(1, Math.round(width * pixelRatio))
      const renderHeight = Math.max(1, Math.round(height * pixelRatio))
      blurX.uniforms.uTexel.value = 1 / renderWidth
      blurY.uniforms.uTexel.value = 1 / renderHeight
      sharpenPass.uniforms.uResolution.value.set(renderWidth, renderHeight)
    }
    const initialPixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)
    syncPostProcessing(host.clientWidth, host.clientHeight, initialPixelRatio)

    const state = {
      camera,
      renderer,
      composer,
      lensPass,
      scene,
      board,
      highlights: board.highlights,
      currentIndex: index,
      journey: null,
      pointer: new THREE.Vector2(0, 0),
      raycaster: new THREE.Raycaster(),
      lightPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.18),
      hit: new THREE.Vector3(),
      lightTarget: new THREE.Vector3(0, 0, 0),
      lightDesired: new THREE.Vector3(),
      mouseLight,
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

      current.camera.position.set(position.x, position.y, position.z)
      current.camera.lookAt(lookAt)

      // El cursor se proyecta sobre el plano de la placa; el foco sigue ese punto con inercia.
      current.raycaster.setFromCamera(current.pointer, current.camera)
      if (current.raycaster.ray.intersectPlane(current.lightPlane, current.hit)) {
        const x = THREE.MathUtils.clamp(current.hit.x, -BOARD_WIDTH / 2 + 0.2, BOARD_WIDTH / 2 - 0.2)
        const z = THREE.MathUtils.clamp(current.hit.z, -BOARD_DEPTH / 2 + 0.2, BOARD_DEPTH / 2 - 0.2)
        current.lightTarget.set(x, 0, z)
      }
      const smoothing = reducedMotion ? 1 : 0.12
      current.lightDesired.set(current.lightTarget.x, 3.4, current.lightTarget.z)
      current.mouseLight.position.lerp(current.lightDesired, smoothing)
      current.mouseLight.target.position.lerp(current.lightTarget, smoothing)
      current.mouseLight.target.updateMatrixWorld()

      Object.entries(current.highlights).forEach(([id, material]) => {
        let intensity = 0
        if (id === toChip) intensity = 0.65 * (current.journey ? progress : 1)
        if (id === fromChip && fromChip !== toChip) {
          intensity = Math.max(intensity, current.journey ? 0.65 * (1 - progress) : 0)
        }
        material.emissiveIntensity = intensity > 0 ? intensity + Math.sin(now * 0.003) * 0.06 : 0
      })

      current.lensPass.uniforms.uTime.value = now / 1000
      current.composer.render()
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
      current.pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1)
      )
    }
    const onResize = () => {
      const current = stateRef.current
      if (!current) return
      const width = host.clientWidth
      const height = Math.max(1, host.clientHeight)
      current.camera.aspect = width / height
      current.camera.updateProjectionMatrix()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)
      current.renderer.setPixelRatio(pixelRatio)
      current.renderer.setSize(width, height)
      current.composer.setPixelRatio(pixelRatio)
      current.composer.setSize(width, height)
      syncPostProcessing(width, height, pixelRatio)
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
      current.composer.dispose()
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
