import { useEffect, useState } from 'react'
import { useImageStore } from '../../stores/useImageStore'
import { useActivationStore } from '../../stores/useActivationStore'
import { processImage } from '../../lib/processor'

export function EditorPanel() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const images = useImageStore((s) => s.images)
  const setProcessedBlob = useImageStore((s) => s.setProcessedBlob)
  const tier = useActivationStore((s) => s.tier)
  const isFree = tier === 'free'
  const [showBefore, setShowBefore] = useState(false)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const image = images.find((i) => i.id === activeImageId)

  useEffect(() => {
    if (!image) {
      setProcessedUrl(null)
      setError(null)
      return
    }

    setError(null)
    setProcessedUrl(null)
    let cancelled = false

    const doProcess = async () => {
      try {
        const blob = await processImage(image, isFree)
        if (cancelled) return
        setProcessedBlob(image.id, blob)
        setProcessedUrl(URL.createObjectURL(blob))
      } catch (e) {
        console.error('Process error:', e)
        if (!cancelled) setError(`处理出错: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    const timer = setTimeout(doProcess, 50)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [image?.id, image?.version])

  if (!image) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">上传图片开始编辑</p>
      </div>
    )
  }

  const displayUrl = showBefore ? image.originalDataUrl : (processedUrl || image.originalDataUrl)

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
        {!processedUrl && !error && (
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm bg-red-900/30 px-3 py-1 rounded">{error}</p>
      )}
      <img
        src={displayUrl}
        alt="preview"
        className="max-w-full max-h-[calc(100vh-220px)] object-contain rounded-lg shadow-2xl"
      />
    </div>
  )
}
