function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

export function applyBrightness(r: number, g: number, b: number, value: number): [number, number, number] {
  const factor = value / 100
  return [clamp(r * factor), clamp(g * factor), clamp(b * factor)]
}

export function applyContrast(r: number, g: number, b: number, value: number): [number, number, number] {
  const factor = value / 100
  return [
    clamp((r - 128) * factor + 128),
    clamp((g - 128) * factor + 128),
    clamp((b - 128) * factor + 128),
  ]
}

export function applySaturation(r: number, g: number, b: number, value: number): [number, number, number] {
  const factor = value / 100
  const gray = 0.299 * r + 0.587 * g + 0.114 * b
  return [
    clamp(gray + (r - gray) * factor),
    clamp(gray + (g - gray) * factor),
    clamp(gray + (b - gray) * factor),
  ]
}

export function applyHue(r: number, g: number, b: number, degrees: number): [number, number, number] {
  if (degrees === 0) return [r, g, b]
  const rad = (degrees * Math.PI) / 180
  const cosA = Math.cos(rad)
  const sinA = Math.sin(rad)

  const r1 = 0.299 + 0.701 * cosA + 0.168 * sinA
  const r2 = 0.587 - 0.587 * cosA + 0.330 * sinA
  const r3 = 0.114 - 0.114 * cosA - 0.497 * sinA

  const g1 = 0.299 - 0.299 * cosA - 0.328 * sinA
  const g2 = 0.587 + 0.413 * cosA + 0.035 * sinA
  const g3 = 0.114 - 0.114 * cosA + 0.292 * sinA

  const b1 = 0.299 - 0.300 * cosA + 1.250 * sinA
  const b2 = 0.587 - 0.588 * cosA - 1.050 * sinA
  const b3 = 0.114 + 0.886 * cosA - 0.203 * sinA

  return [
    clamp(r * r1 + g * r2 + b * r3),
    clamp(r * g1 + g * g2 + b * g3),
    clamp(r * b1 + g * b2 + b * b3),
  ]
}

export function applyTemperature(r: number, g: number, b: number, value: number): [number, number, number] {
  return [clamp(r + value), g, clamp(b - value)]
}

export function applySharpness(imageData: ImageData, amount: number): ImageData {
  if (amount === 0) return imageData
  const { data, width, height } = imageData
  const output = new Uint8ClampedArray(data)
  const strength = amount / 100

  const kernel = [
    0, -1 * strength, 0,
    -1 * strength, 1 + 4 * strength, -1 * strength,
    0, -1 * strength, 0,
  ]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = (y + ky) * width + (x + kx)
            sum += data[px * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)]
          }
        }
        const idx = (y * width + x) * 4 + c
        output[idx] = clamp(sum)
      }
    }
  }

  return new ImageData(output, width, height)
}
