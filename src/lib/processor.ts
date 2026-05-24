import type { ImageItem } from '../types'
import {
  applyBrightness, applyContrast, applySaturation,
  applyHue, applyTemperature, applySharpness,
} from './filters'
import { drawTextWatermark, drawImageWatermark, drawFreeTierWatermark } from './watermark'

export async function processImage(item: ImageItem, isFreeTier: boolean): Promise<Blob> {
  const img = new Image()
  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
    img.src = item.originalDataUrl
  })

  const maxDim = 4096
  let w = img.width
  let h = img.height
  if (Math.max(w, h) > maxDim) {
    const scale = maxDim / Math.max(w, h)
    w = Math.round(w * scale)
    h = Math.round(h * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)

  const imageData = ctx.getImageData(0, 0, w, h)
  const { data } = imageData
  const s = item.settings

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2];

    [r, g, b] = applyBrightness(r, g, b, s.brightness);
    [r, g, b] = applyContrast(r, g, b, s.contrast);
    [r, g, b] = applySaturation(r, g, b, s.saturation);
    [r, g, b] = applyHue(r, g, b, s.hue);
    [r, g, b] = applyTemperature(r, g, b, s.temperature)

    data[i] = r; data[i + 1] = g; data[i + 2] = b
  }

  let result = new ImageData(data, w, h)
  if (s.sharpness > 0) {
    result = applySharpness(result, s.sharpness)
  }
  ctx.putImageData(result, 0, 0)

  // Resize
  if (item.resizeWidth || item.resizeHeight) {
    const tw = item.resizeWidth || w
    const th = item.resizeHeight || h
    const resized = document.createElement('canvas')
    resized.width = tw
    resized.height = th
    const rctx = resized.getContext('2d')!
    rctx.drawImage(canvas, 0, 0, tw, th)
    canvas.width = tw
    canvas.height = th
    const nctx = canvas.getContext('2d')!
    nctx.drawImage(resized, 0, 0)
  }

  // Watermark
  if (isFreeTier) {
    drawFreeTierWatermark(ctx)
  } else if (item.watermark.enabled) {
    if (item.watermark.type === 'text') {
      drawTextWatermark(ctx, item.watermark.text)
    } else {
      await drawImageWatermark(ctx, item.watermark.image)
    }
  }

  // Compress
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      item.compressionFormat,
      item.compressionQuality / 100
    )
  })
}
