import { useCallback } from 'react'
import { useImageStore } from '../../stores/useImageStore'
import { useActivationStore } from '../../stores/useActivationStore'
import { useDragDrop } from '../../hooks/useDragDrop'
import { FREE_MAX_IMAGES } from '../../constants'

export function UploadZone() {
  const addImages = useImageStore((s) => s.addImages)
  const images = useImageStore((s) => s.images)
  const tier = useActivationStore((s) => s.tier)
  const isFree = tier === 'free'

  const handleFiles = useCallback(
    (files: File[]) => {
      if (isFree) {
        const remaining = FREE_MAX_IMAGES - images.length
        if (remaining <= 0) {
          alert(`试用版最多上传 ${FREE_MAX_IMAGES} 张图片，请激活后解除限制。`)
          return
        }
        if (files.length > remaining) {
          files = files.slice(0, remaining)
          alert(`试用版最多上传 ${FREE_MAX_IMAGES} 张，仅添加了前 ${remaining} 张。`)
        }
      }
      addImages(files)
    },
    [addImages, images.length, isFree]
  )

  const dropRef = useDragDrop(handleFiles)

  return (
    <div
      ref={dropRef}
      className="m-2 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center transition-colors cursor-pointer"
      onClick={() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = true
        input.accept = 'image/*'
        input.onchange = () => {
          if (input.files) handleFiles(Array.from(input.files))
        }
        input.click()
      }}
    >
      <p className="text-xs text-gray-500">拖拽图片到此处</p>
      <p className="text-xs text-gray-600 mt-1">或点击上传</p>
      {isFree && (
        <p className="text-xs text-gray-600 mt-1">
          试用版限制 {images.length}/{FREE_MAX_IMAGES} 张
        </p>
      )}
    </div>
  )
}
