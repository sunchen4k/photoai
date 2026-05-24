import type { TextWatermarkConfig, ImageWatermarkConfig, WatermarkPosition } from '../types'

function calcPosition(
  canvasW: number, canvasH: number,
  position: WatermarkPosition,
  textW: number, textH: number
): { x: number; y: number } {
  const pad = 20
  switch (position) {
    case 'topLeft': return { x: pad, y: pad + textH }
    case 'topCenter': return { x: (canvasW - textW) / 2, y: pad + textH }
    case 'topRight': return { x: canvasW - textW - pad, y: pad + textH }
    case 'centerLeft': return { x: pad, y: canvasH / 2 }
    case 'center': return { x: (canvasW - textW) / 2, y: canvasH / 2 }
    case 'centerRight': return { x: canvasW - textW - pad, y: canvasH / 2 }
    case 'bottomLeft': return { x: pad, y: canvasH - pad }
    case 'bottomCenter': return { x: (canvasW - textW) / 2, y: canvasH - pad }
    case 'bottomRight': return { x: canvasW - textW - pad, y: canvasH - pad }
  }
}

export function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  config: TextWatermarkConfig
): void {
  if (!config.text) return
  ctx.save()
  ctx.globalAlpha = config.opacity
  ctx.font = `${config.fontSize}px ${config.font}`
  ctx.fillStyle = config.color
  const metrics = ctx.measureText(config.text)
  const textW = metrics.width
  const textH = config.fontSize
  const { x, y } = calcPosition(ctx.canvas.width, ctx.canvas.height, config.position, textW, textH)
  ctx.fillText(config.text, x, y)
  ctx.restore()
}

export function drawImageWatermark(
  ctx: CanvasRenderingContext2D,
  config: ImageWatermarkConfig
): Promise<void> {
  return new Promise((resolve) => {
    if (!config.dataUrl) return resolve()
    const img = new Image()
    img.onload = () => {
      ctx.save()
      ctx.globalAlpha = config.opacity
      const w = img.width * config.scale
      const h = img.height * config.scale
      const { x, y } = calcPosition(ctx.canvas.width, ctx.canvas.height, config.position, w, h)
      ctx.drawImage(img, x, y, w, h)
      ctx.restore()
      resolve()
    }
    img.src = config.dataUrl
  })
}

export function drawFreeTierWatermark(ctx: CanvasRenderingContext2D): void {
  const text = '试用版'
  ctx.save()
  ctx.globalAlpha = 0.25
  ctx.font = 'bold 72px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
  ctx.rotate(-30 * Math.PI / 180)
  const m = ctx.measureText(text)
  ctx.strokeText(text, -m.width / 2, 0)
  ctx.fillText(text, -m.width / 2, 0)
  ctx.restore()
}
