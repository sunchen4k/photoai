import { useImageStore } from '../../stores/useImageStore'
import { useActivationStore } from '../../stores/useActivationStore'
import { Slider } from '../ui/Slider'
import { FREE_MAX_QUALITY, FREE_EXPORT_FORMATS } from '../../constants'

const ALL_FORMATS = [
  { value: 'image/jpeg' as const, label: 'JPEG' },
  { value: 'image/png' as const, label: 'PNG' },
  { value: 'image/webp' as const, label: 'WebP' },
]

export function CompressionPanel() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const images = useImageStore((s) => s.images)
  const tier = useActivationStore((s) => s.tier)
  const isFree = tier === 'free'

  const image = images.find((i) => i.id === activeImageId)
  if (!image) return null

  const visibleFormats = isFree
    ? ALL_FORMATS.filter((f) => (FREE_EXPORT_FORMATS as readonly string[]).includes(f.value))
    : ALL_FORMATS
  const maxQuality = isFree ? FREE_MAX_QUALITY : 100

  const updateCompression = (patch: Partial<typeof image>) => {
    useImageStore.setState((s) => ({
      images: s.images.map((i) =>
        i.id === image.id ? { ...i, ...patch } : i
      ),
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300">导出设置</h3>

      <div>
        <span className="text-xs text-gray-400">格式</span>
        <div className="flex gap-2 mt-1">
          {visibleFormats.map((f) => (
            <button
              key={f.value}
              onClick={() => updateCompression({ compressionFormat: f.value })}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                image.compressionFormat === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {isFree && (
          <p className="text-[10px] text-gray-600 mt-1">激活后解锁 PNG/WebP</p>
        )}
      </div>

      <Slider
        label="质量"
        value={image.compressionQuality}
        min={1}
        max={100}
        onChange={(v) => {
          const q = isFree ? Math.min(v, maxQuality) : v
          updateCompression({ compressionQuality: q })
        }}
        formatValue={(v) => `${v}%`}
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-400">宽度</label>
          <input
            type="number"
            value={image.resizeWidth || ''}
            onChange={(e) => updateCompression({ resizeWidth: e.target.value ? Number(e.target.value) : null })}
            placeholder="原始"
            className="w-full px-2 py-1.5 mt-1 bg-gray-800 border border-gray-700 rounded text-sm outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400">高度</label>
          <input
            type="number"
            value={image.resizeHeight || ''}
            onChange={(e) => updateCompression({ resizeHeight: e.target.value ? Number(e.target.value) : null })}
            placeholder="原始"
            className="w-full px-2 py-1.5 mt-1 bg-gray-800 border border-gray-700 rounded text-sm outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}
