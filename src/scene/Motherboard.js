import * as THREE from 'three'

const BOARD_W = 12
const BOARD_D = 7.4
const SURFACE_Y = 0.172

function silkscreenLabel(ctx, text, x, z, size = 24, color = 'rgba(244, 235, 208, 0.82)') {
  const px = ((x + BOARD_W / 2) / BOARD_W) * ctx.canvas.width
  const py = ((z + BOARD_D / 2) / BOARD_D) * ctx.canvas.height
  ctx.fillStyle = color
  ctx.font = `${size}px "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`
  ctx.fillText(text, px, py)
}

function silkscreenBox(ctx, x, z, w, d, color = 'rgba(244, 235, 208, 0.42)') {
  const px = ((x - w / 2 + BOARD_W / 2) / BOARD_W) * ctx.canvas.width
  const py = ((z - d / 2 + BOARD_D / 2) / BOARD_D) * ctx.canvas.height
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.strokeRect(px, py, (w / BOARD_W) * ctx.canvas.width, (d / BOARD_D) * ctx.canvas.height)
}

function createSilkscreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1280
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const amber = 'rgba(232, 186, 110, 0.78)'
  const cream = 'rgba(244, 235, 208, 0.82)'

  // Serigrafía china: decoración de placa, organizada por zonas funcionales.
  silkscreenLabel(ctx, '核心', -4.3, -2.25, 34, cream)
  silkscreenLabel(ctx, '数据总线', -2.5, 1.95, 26, amber)
  silkscreenLabel(ctx, '视频', -1.55, -2.35, 30, cream)
  silkscreenLabel(ctx, '显存', -1.55, 2.05, 26, amber)
  silkscreenLabel(ctx, '内存', 0.75, 2.05, 30, cream)
  silkscreenLabel(ctx, '接口', 3.0, -1.85, 30, cream)
  silkscreenLabel(ctx, '电源', -5.2, 2.8, 30, amber)
  silkscreenLabel(ctx, '时钟', -2.35, -2.9, 22, amber)
  silkscreenLabel(ctx, '复位', 4.6, 2.75, 22, amber)

  // Referencias de componente, como en una placa real.
  silkscreenLabel(ctx, 'U1', -4.05, -1.35, 22, amber)
  silkscreenLabel(ctx, 'U2', -1.75, -1.35, 22, amber)
  silkscreenLabel(ctx, 'U3', 0.65, -0.15, 22, amber)
  silkscreenLabel(ctx, 'U4', 3.05, 0.55, 22, amber)
  silkscreenLabel(ctx, 'BIOS', 2.95, 1.95, 22, amber)
  silkscreenLabel(ctx, 'PWR', -4.9, 1.55, 22, amber)
  silkscreenLabel(ctx, 'CLK', -2.35, -2.45, 20, amber)

  // Contornos de las zonas y del conector de expansión.
  silkscreenBox(ctx, -3.2, 0.3, 2.5, 2.5)
  silkscreenBox(ctx, -1.0, -0.6, 2.7, 1.8)
  silkscreenBox(ctx, 1.4, 0.6, 2.8, 1.9)
  silkscreenBox(ctx, 3.6, -0.2, 2.0, 1.6)
  silkscreenBox(ctx, -0.5, 3.32, 5.0, 0.55)

  // Pequeños caracteres alineados en los bordes, como serigrafía de fabricación.
  const glyphs = '电源时钟数据复位内存总线信号核心接口输入输出地压控使能缓存地址读写同步'
  for (let i = 0; i < 16; i += 1) {
    silkscreenLabel(ctx, glyphs[i], -5.5 + i * 0.7, -3.45, 16, 'rgba(244, 235, 208, 0.38)')
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function addPins(group, width, depth, y) {
  const pinGeo = new THREE.BoxGeometry(0.055, 0.035, 0.16)
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xe0bd74, metalness: 0.8, roughness: 0.28 })
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

function addSmallChip(group, x, z, width = 0.5, depth = 0.38) {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x26302b, metalness: 0.35, roughness: 0.55 })
  const legMat = new THREE.MeshStandardMaterial({ color: 0xd8b76f, metalness: 0.85, roughness: 0.25 })

  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 0.16, depth), bodyMat)
  body.position.set(x, 0.26, z)
  group.add(body)

  const legs = Math.max(3, Math.floor(width / 0.11))
  for (let i = 0; i < legs; i += 1) {
    const lx = x - width / 2 + 0.06 + i * (width - 0.12) / (legs - 1)
    const front = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.025, 0.1), legMat)
    front.position.set(lx, 0.19, z + depth / 2 + 0.05)
    group.add(front)
    const back = front.clone()
    back.position.z = z - depth / 2 - 0.05
    group.add(back)
  }
}

function makeChip(type, highlightMaterial) {
  const chip = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: 0x29332d, metalness: 0.4, roughness: 0.5 })
  const metal = new THREE.MeshStandardMaterial({ color: 0x68766c, metalness: 0.55, roughness: 0.38 })

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

    // Zócalo cuadrado alrededor del procesador.
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1b2621, metalness: 0.3, roughness: 0.7 })
    const frameBars = [
      [2.4, 0.14, 0.16, 0, 1.18],
      [2.4, 0.14, 0.16, 0, -1.18],
      [0.16, 0.14, 2.4, 1.18, 0],
      [0.16, 0.14, 2.4, -1.18, 0]
    ]
    frameBars.forEach(([w, h, d, x, z]) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat)
      bar.position.set(x, 0.2, z)
      chip.add(bar)
    })
  } else if (type === 'graphics') {
    base(2.25, 0.3, 1.3, 0.2)
    for (let i = 0; i < 9; i += 1) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 1.12), metal)
      fin.position.set(-0.9 + i * 0.225, 0.46, 0)
      chip.add(fin)
    }
    addPins(chip, 2.25, 1.3, 0.1)
  } else if (type === 'memory') {
    // Banco de memoria soldada: dos filas de chips, como en una consola.
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        addSmallChip(chip, -0.95 + col * 0.63, -0.38 + row * 0.76, 0.52, 0.42)
      }
    }
    const slot = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 0.18), dark)
    slot.position.set(0, 0.22, -0.95)
    chip.add(slot)
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

  const footprint = {
    cpu: [2.5, 2.5],
    graphics: [2.4, 1.5],
    memory: [2.9, 1.9],
    io: [1.6, 1.2]
  }[type]
  const highlight = new THREE.Mesh(new THREE.BoxGeometry(footprint[0], 0.02, footprint[1]), highlightMaterial)
  highlight.position.y = 0.025
  chip.add(highlight)

  return chip
}

function addTrace(group, points, color = 0xe0b96e, opacity = 0.72) {
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(([x, z]) => new THREE.Vector3(x, SURFACE_Y + 0.012, z))
  )
  group.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity })))
}

function addBus(group, points, lanes = 4) {
  for (let i = 0; i < lanes; i += 1) {
    const offset = (i - (lanes - 1) / 2) * 0.075
    addTrace(group, points.map(([x, z]) => [x + offset, z + offset]))
  }
}

function addMountingHoles(group) {
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.85, roughness: 0.3 })
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x030806, metalness: 0.1, roughness: 1 })
  ;[
    [-5.55, -3.25],
    [5.55, -3.25],
    [-5.55, 3.25],
    [5.55, 3.25]
  ].forEach(([x, z]) => {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 16), ringMat)
    ring.position.set(x, 0.2, z)
    group.add(ring)
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16), holeMat)
    hole.position.set(x, 0.215, z)
    group.add(hole)
  })
}

function addPowerSection(group) {
  const capGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.34, 12)
  const capMat = new THREE.MeshStandardMaterial({ color: 0x354c43, metalness: 0.35, roughness: 0.45 })
  const coilMat = new THREE.MeshStandardMaterial({ color: 0x7a5b32, metalness: 0.65, roughness: 0.4 })

  // Condensadores alineados en el riel de alimentación.
  for (let i = 0; i < 9; i += 1) {
    const cap = new THREE.Mesh(capGeo, capMat)
    cap.position.set(-4.9 + i * 0.55, 0.35, 2.35)
    group.add(cap)
  }
  for (let i = 0; i < 4; i += 1) {
    const cap = new THREE.Mesh(capGeo, capMat)
    cap.position.set(4.15 + i * 0.42, 0.35, 2.15)
    group.add(cap)
  }

  // Bobinas de la sección de alimentación.
  ;[-4.25, -3.35].forEach((x) => {
    const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.26, 18), coilMat)
    coil.position.set(x, 0.31, 3.0)
    group.add(coil)
  })
}

function addEdgeConnectors(group) {
  const plastic = new THREE.MeshStandardMaterial({ color: 0x14211b, metalness: 0.2, roughness: 0.8 })
  const gold = new THREE.MeshStandardMaterial({ color: 0xe0bd74, metalness: 0.85, roughness: 0.25 })

  const expansion = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 0.32), plastic)
  expansion.position.set(-0.5, 0.23, 3.32)
  group.add(expansion)
  for (let i = 0; i < 28; i += 1) {
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.22), gold)
    pin.position.set(-2.75 + i * 0.166, 0.3, 3.32)
    group.add(pin)
  }

  // Puertos del lateral derecho, apilados con sus carcasas metálicas.
  const portShell = new THREE.MeshStandardMaterial({ color: 0x8f9d94, metalness: 0.8, roughness: 0.35 })
  const portHole = new THREE.MeshStandardMaterial({ color: 0x0b1410, metalness: 0.2, roughness: 0.9 })
  for (let i = 0; i < 4; i += 1) {
    const z = -1.5 + i * 0.75
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.26, 0.5), portShell)
    shell.position.set(5.62, 0.31, z)
    group.add(shell)
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.15, 0.32), portHole)
    hole.position.set(5.92, 0.31, z)
    group.add(hole)
  }
}

function addAuxiliaryComponents(group) {
  // BIOS y oscilador de cristal: referencias visuales de una placa de consola.
  addSmallChip(group, 3.4, 2.05, 0.62, 0.44)
  const crystal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.24, 16),
    new THREE.MeshStandardMaterial({ color: 0x9aa79f, metalness: 0.85, roughness: 0.3 })
  )
  crystal.position.set(-1.95, 0.3, -2.6)
  group.add(crystal)

  const vias = []
  for (let x = -5.1; x <= 5.1; x += 0.85) vias.push([x, 3.15])
  for (let z = -3.0; z <= 2.8; z += 0.9) vias.push([-5.15, z])
  for (let z = -3.0; z <= 2.8; z += 0.9) vias.push([5.15, z])
  const viaGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8)
  const viaMat = new THREE.MeshStandardMaterial({ color: 0xe0bd74, metalness: 0.9, roughness: 0.22 })
  vias.forEach(([x, z]) => {
    const via = new THREE.Mesh(viaGeo, viaMat)
    via.position.set(x, 0.19, z)
    group.add(via)
  })
}

function addBuses(group) {
  // Rutas ortogonales con esquinas a 45°, agrupadas en buses paralelos.
  const buses = [
    [[-2.35, 0.3], [-1.95, 0.3], [-1.6, -0.05], [-1.6, -0.6], [-1.85, -0.6]],
    [[-2.35, 0.62], [-1.9, 0.62], [-1.5, 1.02], [0.85, 1.02], [1.15, 0.6]],
    [[-1.0, 0.12], [-1.0, 1.05], [-1.35, 1.4], [-1.35, 1.72]],
    [[2.15, 0.6], [2.55, 0.6], [2.85, 0.3], [3.12, -0.2]],
    [[4.35, -0.2], [4.85, -0.2], [5.15, -0.5], [5.45, -0.5]],
    [[-3.2, 1.6], [-3.2, 2.45], [-2.75, 2.9], [4.9, 2.9]],
    [[-1.0, -1.3], [-1.0, -2.05], [-1.65, -2.6]],
    [[3.6, 0.72], [3.6, 1.75], [4.05, 2.2]]
  ]
  buses.forEach((points, index) => addBus(group, points, index === 5 ? 6 : 4))
}

export function createMotherboard() {
  const group = new THREE.Group()

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(BOARD_W, 0.32, BOARD_D),
    new THREE.MeshStandardMaterial({ color: 0x0e2119, metalness: 0.2, roughness: 0.78 })
  )
  group.add(board)

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD_W - 0.2, BOARD_D - 0.2),
    new THREE.MeshStandardMaterial({ color: 0x164436, metalness: 0.15, roughness: 0.8 })
  )
  surface.rotation.x = -Math.PI / 2
  surface.position.y = 0.165
  group.add(surface)

  const silk = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD_W - 0.2, BOARD_D - 0.2),
    new THREE.MeshBasicMaterial({
      map: createSilkscreenTexture(),
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    })
  )
  silk.rotation.x = -Math.PI / 2
  silk.position.y = SURFACE_Y
  group.add(silk)

  addBuses(group)
  addMountingHoles(group)
  addPowerSection(group)
  addEdgeConnectors(group)
  addAuxiliaryComponents(group)

  const chipDefs = [
    // Y = 0.17: los chips se apoyan sobre la superficie de la PCB (Y = 0.165).
    { id: 'cpu', type: 'cpu', position: [-3.2, 0.17, 0.3] },
    { id: 'graphics', type: 'graphics', position: [-1.0, 0.17, -0.6] },
    { id: 'memory', type: 'memory', position: [1.4, 0.17, 0.6] },
    { id: 'io', type: 'io', position: [3.6, 0.17, -0.2] }
  ]

  const highlights = {}
  chipDefs.forEach((def) => {
    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: 0x164436,
      emissive: new THREE.Color(0xf0bf6d),
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
