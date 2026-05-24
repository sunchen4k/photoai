import { useState, useRef, useEffect } from 'react'
import { useImageStore } from '../../stores/useImageStore'

export function BeforeAfter() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const images = useImageStore((s) => s.images)
  const [showBefore, setShowBefore] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const image = images.find((i) => i.id === activeImageId)

  useEffect(() => {
    if (!image || !canvasRef.current) return
    const source = showBefore ? image.originalDataUrl : (
      image.processedBlob ? URL.createObjectURL(image.processedBlob) : image.originalDataUrl
    )
    const img = new Image()
    img.onload = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = img.width
      canvasRef.current.height = img.height
      canvasRef.current.getContext('2d')!.drawImage(img, 0, 0)
      if (!showBefore && image.processedBlob) {
        URL.revokeObjectURL(img.src)
      }
    }
    img.src = source
  }, [image, showBefore])

  if (!image) return null

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onMouseDown={() => setShowBefore(true)}
          onMouseUp={() => setShowBefore(false)}
          onMouseLeave={() => setShowBefore(false)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors cursor-pointer"
        >
          {showBefore ? '原始' : '按住对比原图'}
        </button>
        <span className="text-xs text-gray-500">
          {image.width}x{image.height}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-[calc(100vh-240px)] object-contain rounded-lg shadow-2xl"
      />
    </>
  )
}
