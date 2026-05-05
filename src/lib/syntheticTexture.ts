import * as THREE from 'three'

/**
 * Generates a procedural sandy/granular texture resembling sauló decomposed granite.
 * Used as placeholder until real KTX2 material assets are available.
 */
export function createSauloTexture(
  size = 512,
  baseHex = '#C4A87A',
  variance = 0.12,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Parse base color
  const r = parseInt(baseHex.slice(1, 3), 16)
  const g = parseInt(baseHex.slice(3, 5), 16)
  const b = parseInt(baseHex.slice(5, 7), 16)

  // Fill base
  ctx.fillStyle = baseHex
  ctx.fillRect(0, 0, size, size)

  // Noise passes — multiple layers at different frequencies
  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4

      // Layered pseudo-noise (no external library)
      const n1 = noise2d(x * 0.04, y * 0.04)
      const n2 = noise2d(x * 0.12, y * 0.12) * 0.5
      const n3 = noise2d(x * 0.35, y * 0.35) * 0.25
      const n4 = noise2d(x * 1.2, y * 1.2) * 0.10
      const n = (n1 + n2 + n3 + n4) / 1.85

      const v = variance
      data[i]     = Math.min(255, Math.max(0, r + n * v * 255))
      data[i + 1] = Math.min(255, Math.max(0, g + n * v * 240))
      data[i + 2] = Math.min(255, Math.max(0, b + n * v * 200))
      data[i + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  // Add fine grain overlay
  for (let i = 0; i < size * 4; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const radius = Math.random() * 1.5 + 0.3
    const alpha = Math.random() * 0.06
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,240,210' : '80,60,40'},${alpha})`
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Smooth noise helper (no imports needed)
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }

function lerp(a: number, b: number, t: number) { return a + t * (b - a) }

function grad(hash: number, x: number, y: number) {
  const h = hash & 3
  const u = h < 2 ? x : y
  const v = h < 2 ? y : x
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

const PERM = Array.from({ length: 512 }, (_, i) => {
  const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,
    69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,
    203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,
    165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,
    92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
    89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,
    226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,
    182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,
    43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,
    97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
    107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
  return p[i % 256]
})

function noise2d(x: number, y: number): number {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const u = fade(xf)
  const v = fade(yf)
  const a = PERM[X] + Y
  const b = PERM[X + 1] + Y
  return lerp(
    lerp(grad(PERM[a], xf, yf), grad(PERM[b], xf - 1, yf), u),
    lerp(grad(PERM[a + 1], xf, yf - 1), grad(PERM[b + 1], xf - 1, yf - 1), u),
    v,
  )
}
