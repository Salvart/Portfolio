import * as THREE from 'three'

export const BOARD_WIDTH = 18
export const BOARD_DEPTH = 10

const SURFACE_Y = 0.172

// La placa mide 0.32 de alto y está centrada en Y=0: su cara inferior queda en -0.16.
const TABLE_WIDTH = 34
const TABLE_DEPTH = 16
const TABLE_TOP = -0.16
const TABLE_THICKNESS = 0.45

// Centros de los cuatro chips, compartidos por el serigrafado y el enrutado de pistas.
const CPU = [-6.0, 0.4]
const GPU = [-2.0, -1.1]
const RAM = [2.0, 0.9]
const IO = [6.0, -0.5]

const viaGeometry = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 8)
const viaMaterial = new THREE.MeshStandardMaterial({ color: 0xe0bd74, metalness: 0.9, roughness: 0.22 })

function addVia(group, [x, z]) {
  const via = new THREE.Mesh(viaGeometry, viaMaterial)
  via.position.set(x, SURFACE_Y + 0.02, z)
  group.add(via)
}

function normalize2([x, z]) {
  const length = Math.hypot(x, z) || 1
  return [x / length, z / length]
}

// Todas las rutas usan puntos de anclaje alineados a ejes. Cada esquina se
// sustituye por una diagonal exacta de 45°, por lo que nunca aparecen ángulos
// arbitrarios (solo 0°, 90° y los chaflanes a 45°).
function chamferPath(points, radius = 0.16) {
  if (points.length < 3) return points
  const result = [points[0]]
  for (let i = 1; i < points.length - 1; i += 1) {
    const [px, pz] = points[i - 1]
    const [cx, cz] = points[i]
    const [nx, nz] = points[i + 1]
    const incoming = Math.hypot(cx - px, cz - pz)
    const outgoing = Math.hypot(nx - cx, nz - cz)
    const r = Math.min(radius, incoming * 0.4, outgoing * 0.4)
    const [ix, iz] = normalize2([cx - px, cz - pz])
    const [ox, oz] = normalize2([nx - cx, nz - cz])
    result.push([cx - ix * r, cz - iz * r])
    result.push([cx + ox * r, cz + oz * r])
  }
  result.push(points[points.length - 1])
  return result
}

// Posiciones de pines calculadas con el mismo paso usado en addPins().
function cpuPin(side, index) {
  const count = Math.floor(1.55 / 0.14)
  const t = -1.55 / 2 + 0.07 + (index * (1.55 - 0.14)) / (count - 1)
  if (side === 'right') return [CPU[0] + 0.875, CPU[1] + t]
  if (side === 'left') return [CPU[0] - 0.875, CPU[1] + t]
  if (side === 'front') return [CPU[0] + t, CPU[1] + 0.875]
  return [CPU[0] + t, CPU[1] - 0.875]
}

function gpuPin(side, index) {
  if (side === 'front' || side === 'back') {
    const count = Math.floor(2.25 / 0.14)
    const t = -2.25 / 2 + 0.07 + (index * (2.25 - 0.14)) / (count - 1)
    return [GPU[0] + t, GPU[1] + (side === 'front' ? 0.75 : -0.75)]
  }
  const count = Math.floor(1.3 / 0.14)
  const t = -1.3 / 2 + 0.07 + (index * (1.3 - 0.14)) / (count - 1)
  return [GPU[0] + 1.225, GPU[1] + t]
}

function ramPad(side, index) {
  if (side === 'left') return [RAM[0] - 1.45, RAM[1] - 0.6 + index * 0.3]
  if (side === 'right') return [RAM[0] + 1.45, RAM[1] - 0.6 + index * 0.3]
  if (side === 'bottom') return [RAM[0] - 0.9 + index * 0.6, RAM[1] - 0.95]
  return [RAM[0] - 0.9 + index * 0.6, RAM[1] + 0.95]
}

function ioPad(side, index) {
  if (side === 'left') return [IO[0] - 0.8, IO[1] - 0.4 + index * 0.2]
  if (side === 'right') return [IO[0] + 0.8, IO[1] - 0.4 + index * 0.2]
  if (side === 'bottom') return [IO[0] - 0.5 + index * 0.5, IO[1] - 0.6]
  return [IO[0] - 0.5 + index * 0.5, IO[1] + 0.6]
}

function silkscreenLabel(ctx, text, x, z, size = 24, color = 'rgba(244, 235, 208, 0.82)') {
  const px = ((x + BOARD_WIDTH / 2) / BOARD_WIDTH) * ctx.canvas.width
  const py = ((z + BOARD_DEPTH / 2) / BOARD_DEPTH) * ctx.canvas.height
  ctx.fillStyle = color
  ctx.font = `${size}px "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`
  ctx.fillText(text, px, py)
}

function silkscreenBox(ctx, x, z, w, d, color = 'rgba(244, 235, 208, 0.42)') {
  const px = ((x - w / 2 + BOARD_WIDTH / 2) / BOARD_WIDTH) * ctx.canvas.width
  const py = ((z - d / 2 + BOARD_DEPTH / 2) / BOARD_DEPTH) * ctx.canvas.height
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.strokeRect(px, py, (w / BOARD_WIDTH) * ctx.canvas.width, (d / BOARD_DEPTH) * ctx.canvas.height)
}

function createSilkscreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1150
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const amber = 'rgba(232, 186, 110, 0.78)'
  const cream = 'rgba(244, 235, 208, 0.82)'

  // Serigrafía china: solo en zonas libres de pistas y componentes.
  silkscreenLabel(ctx, '核心', -7.0, -2.6, 38, cream)
  silkscreenLabel(ctx, '数据总线', 1.6, 3.25, 30, amber)
  silkscreenLabel(ctx, '视频', -2.7, -2.6, 34, cream)
  silkscreenLabel(ctx, '显存', 0.6, -2.6, 30, amber)
  silkscreenLabel(ctx, '内存', 3.8, 3.25, 34, cream)
  silkscreenLabel(ctx, '接口', 5.1, -2.4, 34, cream)
  silkscreenLabel(ctx, '电源', -7.9, 3.75, 34, amber)
  silkscreenLabel(ctx, '时钟', -3.2, -3.6, 26, amber)
  silkscreenLabel(ctx, '复位', 7.8, -3.6, 26, amber)

  // Referencias de componente, como en una placa real.
  silkscreenLabel(ctx, 'U1', -6.4, -0.7, 26, amber)
  silkscreenLabel(ctx, 'U2', -2.4, -2.05, 26, amber)
  silkscreenLabel(ctx, 'U3', 1.6, -1.9, 26, amber)
  silkscreenLabel(ctx, 'U4', 5.6, 0.85, 26, amber)
  silkscreenLabel(ctx, 'BIOS', 5.1, 3.3, 26, amber)
  silkscreenLabel(ctx, 'PWR', -7.5, 2.3, 26, amber)
  silkscreenLabel(ctx, 'CLK', -3.2, -3.2, 24, amber)

  // Contornos de los cuatro chips y del conector de expansión.
  silkscreenBox(ctx, -6.0, 0.4, 2.8, 2.8)
  silkscreenBox(ctx, -2.0, -1.1, 2.7, 1.8)
  silkscreenBox(ctx, 2.0, 0.9, 3.1, 2.1)
  silkscreenBox(ctx, 6.0, -0.5, 2.0, 1.6)
  silkscreenBox(ctx, 0, 4.55, 8.5, 0.6)

  const glyphs = '电源时钟数据复位内存总线信号核心接口输入输出地压控使能缓存地址读写同步'
  for (let i = 0; i < 22; i += 1) {
    silkscreenLabel(ctx, glyphs[i % glyphs.length], -8.4 + i * 0.8, -4.6, 18, 'rgba(244, 235, 208, 0.38)')
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

// Veta de madera generada en canvas: tablero de nogal oscuro con vetas
// onduladas y juntas de tabla, sin depender de archivos externos.
function createWoodTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 640
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas

  ctx.fillStyle = '#4a3220'
  ctx.fillRect(0, 0, width, height)

  let seed = 17
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  for (let i = 0; i < 260; i += 1) {
    const baseY = (i / 260) * height + random() * 3
    const drift = random() * 6.28
    ctx.beginPath()
    ctx.moveTo(0, baseY)
    for (let x = 0; x <= width; x += 12) {
      const y = baseY + Math.sin(x * 0.011 + drift) * 3.2 + Math.sin(x * 0.037 + i) * 1.4
      ctx.lineTo(x, y)
    }
    const strong = i % 7 === 0
    ctx.strokeStyle = strong ? 'rgba(26, 15, 9, 0.24)' : 'rgba(146, 101, 60, 0.075)'
    ctx.lineWidth = strong ? 2.2 : 1
    ctx.stroke()
  }

  // Juntas entre tablas, con un filo claro que simula el biselado.
  for (let i = 1; i < 4; i += 1) {
    const x = (i / 4) * width
    ctx.fillStyle = 'rgba(18, 10, 6, 0.32)'
    ctx.fillRect(x - 1.5, 0, 3, height)
    ctx.fillStyle = 'rgba(180, 130, 80, 0.09)'
    ctx.fillRect(x + 2, 0, 1.5, height)
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

const traceMaterials = new Map()

// Las pistas son cintas y no THREE.Line: WebGL ignora `linewidth` en la mayoría
// de los navegadores, así que solo una malla permite darles grosor real.
function addTrace(group, points, color = 0xe0b96e, opacity = 0.72, width = 0.021) {
  const half = width / 2
  const y = SURFACE_Y + 0.012
  const vertices = []
  const indices = []

  points.forEach(([x, z], i) => {
    const before = points[i - 1] || points[i]
    const after = points[i + 1] || points[i]
    const inDir = normalize2([x - before[0], z - before[1]])
    const outDir = normalize2([after[0] - x, after[1] - z])

    // Normal de la unión (miter) para que los chaflanes de 45° no dejen huecos.
    let nx = -inDir[1] - outDir[1]
    let nz = inDir[0] + outDir[0]
    if (Math.hypot(nx, nz) < 0.001) {
      nx = -outDir[1]
      nz = outDir[0]
    }
    const normal = normalize2([nx, nz])
    const dir = outDir[0] || outDir[1] ? outDir : inDir
    const cos = Math.max(0.35, normal[0] * dir[0] + normal[1] * dir[1])
    const miter = Math.min(half / cos, half * 2)

    vertices.push(x + normal[0] * miter, y, z + normal[1] * miter)
    vertices.push(x - normal[0] * miter, y, z - normal[1] * miter)

    if (i > 0) {
      const a = (i - 1) * 2
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)

  const key = `${color}-${opacity}`
  let material = traceMaterials.get(key)
  if (!material) {
    material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    traceMaterials.set(key, material)
  }
  group.add(new THREE.Mesh(geometry, material))
}

function addPinBus(group, count, pinStart, pinEnd, route, options = {}) {
  for (let i = 0; i < count; i += 1) {
    const start = pinStart(i)
    const end = pinEnd(i)
    const path = chamferPath(route(start, end, i))
    addTrace(group, path, options.color, options.opacity)
    if (options.vias) {
      addVia(group, path[2] || path[1])
      addVia(group, path[path.length - 3] || path[path.length - 2])
    }
  }
}

function addMountingHoles(group) {
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc9a45c, metalness: 0.85, roughness: 0.3 })
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x030806, metalness: 0.1, roughness: 1 })
  ;[
    [-8.45, -4.5],
    [8.45, -4.5],
    [-8.45, 4.5],
    [8.45, 4.5]
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
    cap.position.set(-7.5 + i * 0.55, 0.35, 3.35)
    group.add(cap)
  }
  for (let i = 0; i < 4; i += 1) {
    const cap = new THREE.Mesh(capGeo, capMat)
    cap.position.set(5.6 + i * 0.62, 0.35, 3.35)
    group.add(cap)
  }

  ;[-6.8, -5.8].forEach((x) => {
    const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.26, 18), coilMat)
    coil.position.set(x, 0.31, 4.25)
    group.add(coil)
  })
}

function addEdgeConnectors(group) {
  const plastic = new THREE.MeshStandardMaterial({ color: 0x14211b, metalness: 0.2, roughness: 0.8 })
  const gold = new THREE.MeshStandardMaterial({ color: 0xe0bd74, metalness: 0.85, roughness: 0.25 })

  const expansion = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.12, 0.32), plastic)
  expansion.position.set(0, 0.23, 4.55)
  group.add(expansion)
  for (let i = 0; i < 44; i += 1) {
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.22), gold)
    pin.position.set(-4.1 + i * 0.19, 0.3, 4.55)
    group.add(pin)
  }

  // Puertos del lateral derecho, apilados con sus carcasas metálicas.
  const portShell = new THREE.MeshStandardMaterial({ color: 0x8f9d94, metalness: 0.8, roughness: 0.35 })
  const portHole = new THREE.MeshStandardMaterial({ color: 0x0b1410, metalness: 0.2, roughness: 0.9 })
  for (let i = 0; i < 4; i += 1) {
    const z = -2.2 + i * 1.1
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.26, 0.5), portShell)
    shell.position.set(8.62, 0.31, z)
    group.add(shell)
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.15, 0.32), portHole)
    hole.position.set(8.92, 0.31, z)
    group.add(hole)
  }
}

function addAuxiliaryComponents(group) {
  addSmallChip(group, 5.4, 2.5, 0.62, 0.44)
  const crystal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.24, 16),
    new THREE.MeshStandardMaterial({ color: 0x9aa79f, metalness: 0.85, roughness: 0.3 })
  )
  crystal.position.set(-2.9, 0.3, -3.0)
  group.add(crystal)

  const vias = []
  for (let x = -8.0; x <= 8.0; x += 1) vias.push([x, 4.0])
  for (let z = -4.0; z <= 4.0; z += 1) vias.push([-8.4, z])
  for (let z = -4.0; z <= 4.0; z += 1) vias.push([8.4, z])
  const viaGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8)
  const viaMat = new THREE.MeshStandardMaterial({ color: 0xe0bd74, metalness: 0.9, roughness: 0.22 })
  vias.forEach(([x, z]) => {
    const via = new THREE.Mesh(viaGeo, viaMat)
    via.position.set(x, 0.19, z)
    group.add(via)
  })
}

function addBuses(group) {
  // Cada bus nace en un pin real y termina en el pin de destino. Los carriles
  // se ordenan de menor a mayor índice para que nunca se crucen entre sí.
  // CPU → gráficos.
  addPinBus(
    group,
    4,
    (i) => cpuPin('right', 5 + i),
    (i) => gpuPin('front', 6 + i),
    ([sx, sz], [ex, ez], i) => {
      const channelX = -3.5 + i * 0.25
      const channelZ = -0.32 + i * 0.09
      return [
        [sx, sz],
        [channelX, sz],
        [channelX, channelZ],
        [ex, channelZ],
        [ex, ez]
      ]
    },
    { vias: true }
  )

  // CPU → memoria: bus de direcciones por el canal superior.
  addPinBus(
    group,
    6,
    (i) => cpuPin('front', 2 + i),
    (i) => ramPad('left', i),
    ([sx, sz], [ex, ez], i) => {
      const channelZ = 2.75 - i * 0.13
      const channelX = 0.15 - i * 0.13
      return [
        [sx, sz],
        [sx, channelZ],
        [channelX, channelZ],
        [channelX, ez],
        [ex, ez]
      ]
    },
    { color: 0x9ed8c4, opacity: 0.6, vias: true }
  )

  // Gráficos → memoria: bus de vídeo.
  addPinBus(
    group,
    4,
    (i) => gpuPin('right', 3 + i),
    (i) => ramPad('bottom', i),
    ([sx, sz], [ex, ez], i) => {
      const channelX = -0.3 + i * 0.15
      const channelZ = -0.6 + i * 0.14
      return [
        [sx, sz],
        [channelX, sz],
        [channelX, channelZ],
        [ex, channelZ],
        [ex, ez]
      ]
    },
    { vias: true }
  )

  // Memoria → E/S: bus de datos.
  addPinBus(
    group,
    4,
    (i) => ramPad('right', i),
    (i) => ioPad('left', i),
    ([sx, sz], [ex, ez], i) => {
      const channelX = 3.9 + i * 0.15
      const channelZ = -0.1 + i * 0.1
      return [
        [sx, sz],
        [channelX, sz],
        [channelX, channelZ],
        [ex, channelZ],
        [ex, ez]
      ]
    },
    { vias: true }
  )

  // E/S → puertos laterales: una línea por conector.
  addPinBus(
    group,
    3,
    (i) => ioPad('right', 1 + i),
    (i) => [8.9, -2.2 + i * 1.1],
    ([sx, sz], [ex, ez], i) => {
      const channelX = 7.3 + i * 0.25
      return [
        [sx, sz],
        [channelX, sz],
        [channelX, ez],
        [ex, ez]
      ]
    },
    { color: 0x9ed8c4, opacity: 0.6, vias: true }
  )

  // CPU → conector de expansión: sale por los pines traseros y rodea el
  // bus de direcciones por un carril propio en el lateral izquierdo.
  addPinBus(
    group,
    3,
    (i) => cpuPin('back', 8 + i),
    (i) => [-3.5 + i * 0.7, 4.55],
    ([sx, sz], [ex, ez], i) => {
      const channelX = -7.6
      const channelZ = 3.15 - i * 0.1
      return [
        [sx, sz],
        [channelX, sz],
        [channelX, channelZ],
        [ex, channelZ],
        [ex, ez]
      ]
    },
    { color: 0x7fbfa8, opacity: 0.55, vias: true }
  )
}

export function createMotherboard() {
  const group = new THREE.Group()

  // Mesa de madera: la placa se apoya en ella y proyecta su sombra sobre el tablero.
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(TABLE_WIDTH, TABLE_THICKNESS, TABLE_DEPTH),
    new THREE.MeshStandardMaterial({
      map: createWoodTexture(),
      roughness: 0.86,
      metalness: 0.02
    })
  )
  table.position.y = TABLE_TOP - TABLE_THICKNESS / 2
  group.add(table)

  const legGeometry = new THREE.BoxGeometry(0.6, 2.6, 0.6)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2718, roughness: 0.9 })
  ;[-TABLE_WIDTH / 2 + 1.1, TABLE_WIDTH / 2 - 1.1].forEach((x) => {
    ;[-TABLE_DEPTH / 2 + 1.1, TABLE_DEPTH / 2 - 1.1].forEach((z) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial)
      leg.position.set(x, TABLE_TOP - TABLE_THICKNESS - 1.3, z)
      group.add(leg)
    })
  })

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(BOARD_WIDTH, 0.32, BOARD_DEPTH),
    new THREE.MeshStandardMaterial({ color: 0x0e2119, metalness: 0.2, roughness: 0.78 })
  )
  group.add(board)

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD_WIDTH - 0.2, BOARD_DEPTH - 0.2),
    new THREE.MeshStandardMaterial({ color: 0x164436, metalness: 0.15, roughness: 0.8 })
  )
  surface.rotation.x = -Math.PI / 2
  surface.position.y = 0.165
  group.add(surface)

  const silk = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD_WIDTH - 0.2, BOARD_DEPTH - 0.2),
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
    { id: 'cpu', type: 'cpu', position: [-6.0, 0.17, 0.4] },
    { id: 'graphics', type: 'graphics', position: [-2.0, 0.17, -1.1] },
    { id: 'memory', type: 'memory', position: [2.0, 0.17, 0.9] },
    { id: 'io', type: 'io', position: [6.0, 0.17, -0.5] }
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
