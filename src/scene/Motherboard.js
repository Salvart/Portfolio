import * as THREE from 'three'

function seededRandom(seed) {
  let value = seed
  return () => {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createSilkscreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1280
  const ctx = canvas.getContext('2d')
  const rand = seededRandom(42)
  const glyphs = '电源时钟数据复位内存总线信号核心接口输入输出地压控使能缓存地址读写同步检测驱动模块主板芯片组供电'

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(226, 214, 180, 0.55)'
  ctx.font = '26px "Microsoft YaHei", "Noto Sans CJK SC", sans-serif'
  ctx.textBaseline = 'top'

  for (let i = 0; i < 260; i += 1) {
    const x = rand() * canvas.width
    const y = rand() * canvas.height
    const size = 16 + Math.floor(rand() * 16)
    ctx.font = `${size}px "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`
    ctx.fillText(glyphs[Math.floor(rand() * glyphs.length)], x, y)
  }

  // Trazas y marcas de serigrafía: pura decoración de placa.
  ctx.strokeStyle = 'rgba(226, 214, 180, 0.28)'
  ctx.lineWidth = 2
  for (let i = 0; i < 45; i += 1) {
    const x = rand() * canvas.width
    const y = rand() * canvas.height
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 60 + rand() * 180, y)
    ctx.lineTo(x + 60 + rand() * 180, y + 30 + rand() * 90)
    ctx.stroke()
  }
  for (let i = 0; i < 30; i += 1) {
    ctx.strokeRect(rand() * canvas.width, rand() * canvas.height, 45 + rand() * 100, 25 + rand() * 60)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function addPins(group, width, depth, y) {
  const pinGeo = new THREE.BoxGeometry(0.055, 0.035, 0.16)
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.85, roughness: 0.3 })
  const count = Math.floor(width / 0.14)
  for (let i = 0; i < count; i += 1) {
    const x = -width / 2 + 0.07 + i * (width - 0.14) / Math.max(1, count - 1)
    const front = new THREE.Mesh(pinGeo, pinMat)
    front.position.set(x, y, depth / 2 + 0.1)
    group.add(front)
    const back = new THREE.Mesh(pinGeo, pinMat)
    back.position.set(x, y, -depth / 2 - 0.1)
    group.add(back)
  }
  const sideCount = Math.floor(depth / 0.14)
  for (let i = 0; i < sideCount; i += 1) {
    const z = -depth / 2 + 0.07 + i * (depth - 0.14) / Math.max(1, sideCount - 1)
    const pin = new THREE.Mesh(pinGeo, pinMat)
    pin.rotation.y = Math.PI / 2
    pin.position.set(width / 2 + 0.1, y, z)
    group.add(pin)
  }
}

function makeChip(type, highlightMaterial) {
  const chip = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: 0x161c1a, metalness: 0.55, roughness: 0.45 })
  const metal = new THREE.MeshStandardMaterial({ color: 0x39423d, metalness: 0.7, roughness: 0.35 })

  const base = (w, h, d, y = h / 2) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), dark)
    mesh.position.y = y
    chip.add(mesh)
    return mesh
  }

  if (type === 'cpu') {
    base(1.55, 0.24, 1.55, 0.16)
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.06, 1.16), metal)
    lid.position.y = 0.31
    chip.add(lid)
    addPins(chip, 1.55, 1.55, 0.08)
  } else if (type === 'graphics') {
    base(2.25, 0.3, 1.3, 0.2)
    for (let i = 0; i < 9; i += 1) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 1.12), metal)
      fin.position.set(-0.9 + i * 0.225, 0.46, 0)
      chip.add(fin)
    }
    addPins(chip, 2.25, 1.3, 0.1)
  } else if (type === 'memory') {
    for (let i = 0; i < 4; i += 1) {
      const stick = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 2.2), dark)
      stick.position.set(-0.48 + i * 0.32, 0.22, 0)
      chip.add(stick)
      for (let j = 0; j < 6; j += 1) {
        const contact = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.03, 0.06),
          new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.85, roughness: 0.3 })
        )
        contact.position.set(-0.48 + i * 0.32, 0.05, -0.95 + j * 0.12)
        chip.add(contact)
      }
    }
  } else {
    base(1.35, 0.24, 1.0, 0.16)
    for (let i = 0; i < 3; i += 1) {
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.16), metal)
      port.position.set(-0.4 + i * 0.4, 0.2, 0.56)
      chip.add(port)
    }
    for (let i = 0; i < 3; i += 1) {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xd8a657 : 0x2f6f63 })
      )
      led.position.set(-0.36 + i * 0.36, 0.3, -0.52)
      chip.add(led)
    }
  }

  const highlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), highlightMaterial)
  highlight.position.y = 0.02
  chip.add(highlight)

  return chip
}

export function createMotherboard() {
  const group = new THREE.Group()
  const rand = seededRandom(7)

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.32, 7.4),
    new THREE.MeshStandardMaterial({ color: 0x08140f, metalness: 0.25, roughness: 0.82 })
  )
  group.add(board)

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(11.8, 7.2),
    new THREE.MeshStandardMaterial({ color: 0x0c2119, metalness: 0.2, roughness: 0.9 })
  )
  surface.rotation.x = -Math.PI / 2
  surface.position.y = 0.165
  group.add(surface)

  const silk = new THREE.Mesh(
    new THREE.PlaneGeometry(11.8, 7.2),
    new THREE.MeshBasicMaterial({
      map: createSilkscreenTexture(),
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    })
  )
  silk.rotation.x = -Math.PI / 2
  silk.position.y = 0.172
  group.add(silk)

  // Trazas conductoras.
  const tracePoints = []
  for (let i = 0; i < 70; i += 1) {
    let x = -5.6 + rand() * 11.2
    let z = -3.4 + rand() * 6.8
    for (let step = 0; step < 3; step += 1) {
      const nextX = Math.max(-5.6, Math.min(5.6, x + (rand() - 0.5) * 2.4))
      const nextZ = Math.max(-3.4, Math.min(3.4, z + (rand() - 0.5) * 1.8))
      tracePoints.push(x, 0.18, z, nextX, 0.18, z)
      tracePoints.push(nextX, 0.18, z, nextX, 0.18, nextZ)
      x = nextX
      z = nextZ
    }
  }
  const traceGeo = new THREE.BufferGeometry()
  traceGeo.setAttribute('position', new THREE.Float32BufferAttribute(tracePoints, 3))
  group.add(new THREE.LineSegments(traceGeo, new THREE.LineBasicMaterial({ color: 0xb99055, transparent: true, opacity: 0.5 })))

  // Puntos de soldadura y condensadores.
  const viaGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 8)
  const viaMat = new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.9, roughness: 0.25 })
  const capGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.28, 10)
  const capMat = new THREE.MeshStandardMaterial({ color: 0x1b2b28, metalness: 0.4, roughness: 0.5 })
  for (let i = 0; i < 55; i += 1) {
    const via = new THREE.Mesh(viaGeo, viaMat)
    via.position.set(-5.5 + rand() * 11, 0.18, -3.3 + rand() * 6.6)
    group.add(via)
  }
  for (let i = 0; i < 26; i += 1) {
    const cap = new THREE.Mesh(capGeo, capMat)
    cap.position.set(-5.3 + rand() * 10.6, 0.31, -3.1 + rand() * 6.2)
    group.add(cap)
  }

  const chipDefs = [
    { id: 'cpu', type: 'cpu', position: [-3.2, 0, 0.3] },
    { id: 'graphics', type: 'graphics', position: [-1.0, 0, -0.6] },
    { id: 'memory', type: 'memory', position: [1.4, 0, 0.6] },
    { id: 'io', type: 'io', position: [3.6, 0, -0.2] }
  ]

  const highlights = {}
  chipDefs.forEach((def) => {
    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c2119,
      emissive: new THREE.Color(0xd8a657),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.9
    })
    const chip = makeChip(def.type, highlightMaterial)
    chip.position.set(...def.position)
    group.add(chip)
    highlights[def.id] = highlightMaterial
  })

  return { group, highlights, silkTexture: silk.material.map }
}
