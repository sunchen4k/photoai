import { useState } from 'react'
import { useImageStore } from '../../stores/useImageStore'
import { useActivationStore } from '../../stores/useActivationStore'
import { exportSingle, exportAll } from '../../lib/export'

export function ExportBar() {
  const images = useImageStore((s) => s.images)
  const activeImageId = useImageStore((s) => s.activeImageId)
  const tier = useActivationStore((s) => s.tier)
  const isFree = tier === 'free'
  const [exporting, setExporting] = useState(false)

  const activeImage = images.find((i) => i.id === activeImageId)

  const handleSingle = async () => {
    if (!activeImage) return
    setExporting(true)
    await exportSingle(activeImage, isFree)
    setExporting(false)
  }

  const handleAll = async () => {
    setExporting(true)
    await exportAll(images, isFree)
    setExporting(false)
  }

  return (
    <div className="shrink-0 bg-gray-900 border-t border-gray-800 px-4 py-3 flex items-center justify-between">
      <span className="text-xs text-gray-500">
        {images.length} 张图片
      </span>
      <div className="flex gap-2">
        <button
          onClick={handleSingle}
          disabled={!activeImage || exporting}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-sm transition-colors cursor-pointer"
        >
          导出当前
        </button>
        <button
          onClick={handleAll}
          disabled={exporting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
        >
          {exporting && (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          导出全部 (ZIP)
        </button>
      </div>
    </div>
  )
}
