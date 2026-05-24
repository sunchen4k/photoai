import type { ImageSettings } from '../types'

export function autoEnhance(dataUrl: string): Promise<Partial<ImageSettings>> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const { data } = imageData
      const total = data.length / 4

      let sumR = 0, sumG = 0, sumB = 0
      let minLum = 255, maxLum = 0
      let sumSat = 0

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        sumR += r; sumG += g; sumB += b
        const lum = 0.299 * r + 0.587 * g + 0.114 * b
        if (lum < minLum) minLum = lum
        if (lum > maxLum) maxLum = lum
        const avg = (r + g + b) / 3
        sumSat += avg > 0 ? (Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b) : 0
      }

      const avgR = sumR / total
      const avgG = sumG / total
      const avgB = sumB / total
      const avgGray = (avgR + avgG + avgB) / 3
      const avgSat = sumSat / total

      // Auto white balance (gray-world)
      const wbR = avgGray / (avgR || 1)
      const wbB = avgGray / (avgB || 1)
      const temperature = Math.round(clampWb((wbB - wbR) * 80, -100, 100))

      // Auto brightness: shift so average luminance = 128
      const currentMid = (minLum + maxLum) / 2
      const brightness = Math.round(clampWb((128 / (currentMid || 1)) * 100, 20, 200))

      // Auto contrast: stretch histogram
      const range = maxLum - minLum
      const contrast = range > 10 ? Math.round(clampWb((255 / range) * 100, 50, 150)) : 100

      // Auto saturation
      const saturation = avgSat < 0.2 ? 130 : 100

      resolve({
        brightness,
        contrast,
        saturation,
        temperature,
      })
    }
    img.src = dataUrl
  })
}

function clampWb(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}
