import type { ImageItem } from '../../types'
import { useImageStore } from '../../stores/useImageStore'

export function ImageThumbnail({ image }: { image: ImageItem }) {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const setActiveImage = useImageStore((s) => s.setActiveImage)
  const removeImage = useImageStore((s) => s.removeImage)

  const isActive = image.id === activeImageId

  return (
    <div
      onClick={() => setActiveImage(image.id)}
      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-indigo-600/20 ring-1 ring-indigo-500' : 'hover:bg-gray-800'
      }`}
    >
      <img
        src={image.thumbnailUrl}
        alt=""
        className="w-10 h-10 rounded object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-300 truncate">{image.file.name}</p>
        <p className="text-[10px] text-gray-600">
          {image.width}x{image.height}
          {image.edited && <span className="ml-1 text-indigo-400">已编辑</span>}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); removeImage(image.id) }}
        className="text-gray-600 hover:text-red-400 text-xs shrink-0 cursor-pointer"
      >
        ✕
      </button>
    </div>
  )
}
