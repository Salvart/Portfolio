import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useI18n } from '../utils/i18n.jsx'
import './RetroComputer.css'

const SCREEN_W = 512
const SCREEN_H = 384

function drawScreen(ctx, lines, visibleCount, cursorOn) {
  ctx.fillStyle = '#2b2b2b'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  // CRT scanlines
  ctx.fillStyle = 'rgba(246, 212, 177, 0.055)'
  for (let y = 0; y < SCREEN_H; y += 4) {
    ctx.fillRect(0, y, SCREEN_W, 2)
  }

  ctx.font = '30px "VT323", "Courier New", monospace'
  ctx.fillStyle = '#f6d4b1'
  ctx.textBaseline = 'top'

  const shown = lines.slice(0, visibleCount)
  shown.forEach((line, i) => {
    ctx.fillText(line, 26, 30 + i * 40)
  })

  if (cursorOn) {
    const lastY = 30 + Math.max(0, shown.length - 1) * 40
    const lastLine = shown[shown.length - 1] || ''
    const width = ctx.measureText(lastLine).width
    ctx.fillRect(26 + width + 4, lastY + 2, 16, 28)
  }
}

function makeShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 6, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(82, 82, 82, 0.38)')
  gradient.addColorStop(1, 'rgba(82, 82, 82, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

export default function RetroComputer() {
  const { lang, t } = useI18n()
  const mountRef = useRef(null)
  const linesRef = useRef([])
  const phaseRef = useRef('idle')
  const bootAtRef = useRef(0)
  const startBootRef = useRef(() => {})
  const [phase, setPhase] = useState('idle')
  const [fallback, setFallback] = useState(false)

  const lines = lang === 'es'
    ? [
        'ARRANCANDO...',
        'MEMORIA 64K OK',
        'CARGANDO PORTAFOLIO...',
        'HOLA, SOY SALVADOR',
        'TECHNICAL ARTIST & DEV'
      ]
    : [
        'BOOTING...',
        'MEMORY CHECK 64K OK',
        'LOADING PORTFOLIO...',
        "HI THERE, I'M SALVADOR",
        'TECHNICAL ARTIST & DEV'
      ]

  useEffect(() => {
    linesRef.current = lines
  }, [lines])

  const startBoot = useCallback(() => {
    if (phaseRef.current !== 'idle') return
    phaseRef.current = 'booting'
    bootAtRef.current = performance.now()
    setPhase('booting')
  }, [])
  startBootRef.current = startBoot

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      setFallback(true)
      return undefined
    }

    linesRef.current = lines
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = 'computer-canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 1.9, 7.6)
    camera.lookAt(0, 1.0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 2.1))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.7)
    keyLight.position.set(3, 6, 5)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6)
    fillLight.position.set(-4, 2, 3)
    scene.add(fillLight)

    // Screen canvas (boot sequence texture)
    const screenCanvas = document.createElement('canvas')
    screenCanvas.width = SCREEN_W
    screenCanvas.height = SCREEN_H
    const ctx = screenCanvas.getContext('2d')
    drawScreen(ctx, linesRef.current, 0, false)
    const screenTexture = new THREE.CanvasTexture(screenCanvas)
    screenTexture.colorSpace = THREE.SRGBColorSpace
    screenTexture.minFilter = THREE.LinearFilter

    // Materials
    const caseMat = new THREE.MeshStandardMaterial({ color: 0xd8bd9c, roughness: 0.95, flatShading: true })
    const caseDarkMat = new THREE.MeshStandardMaterial({ color: 0xc4a582, roughness: 0.95, flatShading: true })
    const inkMat = new THREE.MeshStandardMaterial({ color: 0x525252, roughness: 0.85, flatShading: true })
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x6f6f6f, roughness: 0.9, flatShading: true })
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture })

    const computer = new THREE.Group()

    const addBox = (w, h, d, x, y, z, mat) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      mesh.position.set(x, y, z)
      computer.add(mesh)
      return mesh
    }

    // Keyboard deck and keys
    addBox(3.6, 0.42, 1.75, 0, 0.21, 0.55, caseMat)
    addBox(3.45, 0.06, 1.6, 0, 0.44, 0.55, caseDarkMat)
    const keyGeo = new THREE.BoxGeometry(0.19, 0.075, 0.16)
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 13; col += 1) {
        const key = new THREE.Mesh(keyGeo, keyMat)
        key.position.set(-1.62 + col * 0.27, 0.51, 0.05 + row * 0.29)
        computer.add(key)
      }
    }
    addBox(1.05, 0.075, 0.16, 0, 0.51, 1.28, keyMat)
    addBox(0.95, 0.1, 0.05, 1.05, 0.24, 1.44, inkMat)

    // Monitor stand, body, bezel and CRT
    addBox(0.95, 0.22, 0.55, 0, 0.62, -0.3, caseDarkMat)
    addBox(2.75, 2.05, 1.15, 0, 1.72, -0.35, caseMat)
    addBox(2.52, 1.82, 0.09, 0, 1.74, 0.26, inkMat)
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.18, 1.48), screenMat)
    screen.position.set(0, 1.76, 0.315)
    computer.add(screen)
    addBox(0.45, 0.09, 0.04, 1.0, 0.86, 0.27, caseDarkMat)

    // Feet
    addBox(0.4, 0.12, 0.4, -1.45, -0.05, 1.1, inkMat)
    addBox(0.4, 0.12, 0.4, 1.45, -0.05, 1.1, inkMat)

    // Soft contact shadow on the paper background
    const shadowTexture = makeShadowTexture()
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), shadowMat)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.set(0, -0.12, 0.4)
    scene.add(shadow)

    scene.add(computer)

    if (reduceMotion) {
      drawScreen(ctx, linesRef.current, linesRef.current.length, true)
      screenTexture.needsUpdate = true
      phaseRef.current = 'ready'
      setPhase('ready')
    }

    let visible = true
    let raf = 0
    let targetRotY = 0
    let targetRotX = 0.04
    let currentRotY = 0
    let currentRotX = 0.04
    let dragging = false
    let moved = false
    let lastX = 0
    let lastY = 0
    let lastDrawKey = ''
    let lastCursorToggle = 0

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      if (!clientWidth || !clientHeight) return
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    resize()

    const renderFrame = (now) => {
      // Boot sequence: reveal one line every 420 ms, then show a blinking cursor.
      if (phaseRef.current === 'booting') {
        const elapsed = now - bootAtRef.current
        const total = linesRef.current.length
        const visibleCount = Math.min(total, Math.floor(elapsed / 420))
        const toggle = Math.floor(elapsed / 500) % 2 === 0
        const key = `${visibleCount}-${toggle}`
        if (key !== lastDrawKey) {
          drawScreen(ctx, linesRef.current, visibleCount, toggle)
          screenTexture.needsUpdate = true
          lastDrawKey = key
        }
        if (elapsed > total * 420 + 600) {
          phaseRef.current = 'ready'
          setPhase('ready')
        }
      } else if (phaseRef.current === 'ready') {
        const toggle = Math.floor(now / 520) % 2 === 0
        if (toggle !== lastCursorToggle) {
          drawScreen(ctx, linesRef.current, linesRef.current.length, toggle)
          screenTexture.needsUpdate = true
          lastCursorToggle = toggle
        }
      }

      if (!dragging && !reduceMotion) {
        targetRotY = Math.sin(now * 0.00035) * 0.14
        targetRotX = 0.04 + Math.sin(now * 0.0005) * 0.02
      }
      currentRotY += (targetRotY - currentRotY) * 0.09
      currentRotX += (targetRotX - currentRotX) * 0.09
      computer.rotation.y = currentRotY
      computer.rotation.x = currentRotX
      computer.position.y = reduceMotion ? 0 : Math.sin(now * 0.0008) * 0.035

      renderer.render(scene, camera)
      if (visible) raf = window.requestAnimationFrame(renderFrame)
    }

    const start = () => {
      if (!raf && visible) raf = window.requestAnimationFrame(renderFrame)
    }
    const stop = () => {
      if (raf) window.cancelAnimationFrame(raf)
      raf = 0
    }

    const onPointerDown = (event) => {
      dragging = true
      moved = false
      lastX = event.clientX
      lastY = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
    }
    const onPointerMove = (event) => {
      if (!dragging) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true
      targetRotY += dx * 0.007
      targetRotX = Math.max(-0.18, Math.min(0.3, targetRotX + dy * 0.004))
      lastX = event.clientX
      lastY = event.clientY
    }
    const onPointerUp = (event) => {
      if (!dragging) return
      dragging = false
      if (!moved) startBootRef.current()
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId)
      }
    }
    const onKeyDown = (event) => {
      if (!visible) return
      if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select')) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        startBootRef.current()
      }
    }

    const canvasEl = renderer.domElement
    canvasEl.addEventListener('pointerdown', onPointerDown)
    canvasEl.addEventListener('pointermove', onPointerMove)
    canvasEl.addEventListener('pointerup', onPointerUp)
    canvasEl.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('keydown', onKeyDown)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0.05 }
    )
    intersectionObserver.observe(mount)
    document.fonts?.ready.then(() => { lastDrawKey = '' }).catch(() => {})
    start()

    return () => {
      stop()
      canvasEl.removeEventListener('pointerdown', onPointerDown)
      canvasEl.removeEventListener('pointermove', onPointerMove)
      canvasEl.removeEventListener('pointerup', onPointerUp)
      canvasEl.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      scene.traverse((obj) => {
        if (!obj.isMesh) return
        if (obj.geometry && obj.geometry !== keyGeo) obj.geometry.dispose()
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((mat) => mat?.dispose())
      })
      keyGeo.dispose()
      screenTexture.dispose()
      shadowTexture.dispose()
      renderer.dispose()
      if (canvasEl.parentNode === mount) mount.removeChild(canvasEl)
    }
    // The scene is built once; text updates are pushed through linesRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bootLabel = phase === 'idle'
    ? t('ARRANCAR', 'BOOT')
    : phase === 'booting'
      ? t('CARGANDO...', 'LOADING...')
      : t('SISTEMA LISTO', 'SYSTEM READY')

  return (
    <div className="retro-hero">
      <div className="hero-tag">SALVADOR RUIZ // PORTFOLIO 64K</div>

      <div className="computer-stage" ref={mountRef}>
        {fallback && (
          <div className="computer-fallback" aria-hidden="true">
            <div className="fallback-monitor">
              <div className="fallback-screen">
                {(phase === 'idle' ? lines.slice(0, 1) : lines).map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
            <div className="fallback-keyboard">
              {Array.from({ length: 26 }, (_, i) => <span key={i} />)}
            </div>
          </div>
        )}
      </div>

      <div className="hero-actions">
        <button
          type="button"
          className="retro-btn boot-btn"
          onClick={startBoot}
          disabled={phase !== 'idle'}
        >
          {bootLabel}
        </button>
        <p className="hero-hint">
          {phase === 'ready'
            ? t('Sistema listo. Desliza para ver el portfolio.', 'System ready. Scroll to explore the portfolio.')
            : t('Pulsa para arrancar o arrastra para girar', 'Click to boot or drag to rotate')}
        </p>
      </div>
    </div>
  )
}
