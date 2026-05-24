import { useEffect, useRef, useState, useCallback } from 'react'
import { useImageStore } from '../../stores/useImageStore'
import { useActivationStore } from '../../stores/useActivationStore'
import { processImage } from '../../lib/processor'

export function EditorPanel() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const images = useImageStore((s) => s.images)
  const setProcessedBlob = useImageStore((s) => s.setProcessedBlob)
  const setProcessing = useImageStore((s) => s.setProcessing)
  const isProcessing = useImageStore((s) => s.isProcessing)
  const tier = useActivationStore((s) => s.tier)
  const isFree = tier === 'free'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [showBefore, setShowBefore] = useState(false)

  const image = images.find((i) => i.id === activeImageId)

  // Process image when settings change
  useEffect(() => {
    if (!image) return

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setProcessing(true)
      try {
        const blob = await processImage(image, isFree)
        setProcessedBlob(image.id, blob)
        drawToCanvas(blob)
      } finally {
        setProcessing(false)
      }
    }, 150)

    return () => clearTimeout(timerRef.current)
  }, [
    image?.id,
    image?.settings.brightness,
    image?.settings.contrast,
    image?.settings.saturation,
    image?.settings.hue,
    image?.settings.temperature,
    image?.settings.sharpness,
    image?.watermark.enabled,
    image?.watermark.type,
    image?.watermark.text.text,
    image?.watermark.text.fontSize,
    image?.watermark.text.opacity,
    image?.watermark.text.position,
    image?.watermark.image.dataUrl,
    image?.compressionFormat,
    image?.compressionQuality,
    image?.resizeWidth,
    image?.resizeHeight,
  ])

  // When "showBefore" toggles, swap canvas between original and processed
  useEffect(() => {
    if (!image) return
    if (showBefore) {
      drawToCanvasFromUrl(image.originalDataUrl)
    } else if (image.processedBlob) {
      drawToCanvas(image.processedBlob)
    }
  }, [showBefore, image?.id])

  const drawToCanvas = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = img.width
      canvasRef.current.height = img.height
      canvasRef.current.getContext('2d')!.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }, [])

  const drawToCanvasFromUrl = useCallback((dataUrl: string) => {
    const img = new Image()
    img.onload = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = img.width
      canvasRef.current.height = img.height
      canvasRef.current.getContext('2d')!.drawImage(img, 0, 0)
    }
    img.src = dataUrl
  }, [])

  if (!image) {
    return (
      <div className="text-gray-600 text-sm">
        上传图片开始编辑
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
      <div className="flex items-center gap-3">
        <button
          onMouseDown={() => setShowBefore(true)}
          onMouseUp={() => setShowBefore(false)}
          onMouseLeave={() => setShowBefore(false)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors cursor-pointer select-none"
        >
          {showBefore ? '原始图片' : '按住对比原图'}
        </button>
        <span className="text-xs text-gray-500">
          {image.width}x{image.height}
        </span>
        {isProcessing && (
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      <div className="relative max-w-full max-h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[calc(100vh-220px)] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
