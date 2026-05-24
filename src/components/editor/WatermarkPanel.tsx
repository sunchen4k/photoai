import { useImageStore } from '../../stores/useImageStore'
import { Slider } from '../ui/Slider'

export function WatermarkPanel() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const images = useImageStore((s) => s.images)

  const image = images.find((i) => i.id === activeImageId)
  if (!image) return null

  const { watermark } = image

  const updateWatermark = (patch: Partial<typeof watermark>) => {
    useImageStore.setState((s) => ({
      images: s.images.map((i) =>
        i.id === image.id ? { ...i, watermark: { ...i.watermark, ...patch } } : i
      ),
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300">水印</h3>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={watermark.enabled}
          onChange={(e) => updateWatermark({ enabled: e.target.checked })}
          className="rounded"
        />
        <span className="text-gray-300">启用水印</span>
      </label>

      {watermark.enabled && (
        <>
          <div className="flex gap-2">
            {(['text', 'image'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateWatermark({ type })}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                  watermark.type === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {type === 'text' ? '文字' : '图片'}
              </button>
            ))}
          </div>

          {watermark.type === 'text' ? (
            <>
              <input
                type="text"
                value={watermark.text.text}
                onChange={(e) => updateWatermark({ text: { ...watermark.text, text: e.target.value } })}
                placeholder="水印文字"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500"
              />
              <Slider label="大小" value={watermark.text.fontSize} min={12} max={120} onChange={(v) => updateWatermark({ text: { ...watermark.text, fontSize: v } })} />
              <Slider label="透明度" value={Math.round(watermark.text.opacity * 100)} min={5} max={100} onChange={(v) => updateWatermark({ text: { ...watermark.text, opacity: v / 100 } })} formatValue={(v) => `${v}%`} />
              <div>
                <span className="text-xs text-gray-400">颜色</span>
                <input
                  type="color"
                  value={watermark.text.color}
                  onChange={(e) => updateWatermark({ text: { ...watermark.text, color: e.target.value } })}
                  className="w-full h-8 mt-1 rounded cursor-pointer"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400">位置</span>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(['topLeft','topCenter','topRight','centerLeft','center','centerRight','bottomLeft','bottomCenter','bottomRight'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateWatermark({ text: { ...watermark.text, position: pos } })}
                      className={`py-1.5 text-[10px] rounded cursor-pointer transition-colors ${
                        watermark.text.position === pos
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                      }`}
                    >
                      ●
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => updateWatermark({ image: { ...watermark.image, dataUrl: reader.result as string } })
                  reader.readAsDataURL(file)
                }}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:bg-gray-800 file:text-gray-300 file:border-0 file:text-xs file:cursor-pointer"
              />
              <Slider label="透明度" value={Math.round(watermark.image.opacity * 100)} min={5} max={100} onChange={(v) => updateWatermark({ image: { ...watermark.image, opacity: v / 100 } })} formatValue={(v) => `${v}%`} />
              <Slider label="大小" value={Math.round(watermark.image.scale * 100)} min={5} max={100} onChange={(v) => updateWatermark({ image: { ...watermark.image, scale: v / 100 } })} formatValue={(v) => `${v}%`} />
            </>
          )}
        </>
      )}
    </div>
  )
}
