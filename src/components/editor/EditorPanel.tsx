import { useEffect, useRef } from 'react'
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

  const image = images.find((i) => i.id === activeImageId)

  useEffect(() => {
    if (!image) return

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setProcessing(true)
      try {
        const blob = await processImage(image, isFree)
        setProcessedBlob(image.id, blob)
        if (canvasRef.current) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = () => {
            canvasRef.current!.width = img.width
            canvasRef.current!.height = img.height
            canvasRef.current!.getContext('2d')!.drawImage(img, 0, 0)
            URL.revokeObjectURL(url)
          }
          img.src = url
        }
      } finally {
        setProcessing(false)
      }
    }, 150)

    return () => clearTimeout(timerRef.current)
  }, [image?.settings, image?.watermark, image?.compressionFormat, image?.compressionQuality, image?.resizeWidth, image?.resizeHeight])

  if (!image) {
    return (
      <div className="text-gray-600 text-sm">
        上传图片开始编辑
      </div>
    )
  }

  return (
    <div className="relative max-w-full max-h-full flex items-center justify-center">
      {isProcessing && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-[calc(100vh-180px)] object-contain rounded-lg shadow-2xl"
      />
    </div>
  )
}
