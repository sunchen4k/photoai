import { Slider } from '../ui/Slider'
import { useImageStore } from '../../stores/useImageStore'
import { DEFAULT_SETTINGS } from '../../constants'

export function ColorGrading() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const images = useImageStore((s) => s.images)
  const updateSettings = useImageStore((s) => s.updateSettings)
  const applySettingsToAll = useImageStore((s) => s.applySettingsToAll)

  const image = images.find((i) => i.id === activeImageId)
  if (!image) return null

  const s = image.settings

  const onChange = (key: string, value: number) => {
    updateSettings(image.id, { [key]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300">调色</h3>
      <Slider label="亮度" value={s.brightness} min={0} max={200} onChange={(v) => onChange('brightness', v)} formatValue={(v) => `${v}%`} />
      <Slider label="对比度" value={s.contrast} min={0} max={200} onChange={(v) => onChange('contrast', v)} formatValue={(v) => `${v}%`} />
      <Slider label="饱和度" value={s.saturation} min={0} max={200} onChange={(v) => onChange('saturation', v)} formatValue={(v) => `${v}%`} />
      <Slider label="色相" value={s.hue} min={-180} max={180} onChange={(v) => onChange('hue', v)} />
      <Slider label="色温" value={s.temperature} min={-100} max={100} onChange={(v) => onChange('temperature', v)} formatValue={(v) => v > 0 ? `+${v}` : `${v}`} />
      <Slider label="锐度" value={s.sharpness} min={0} max={100} onChange={(v) => onChange('sharpness', v)} />

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            applySettingsToAll({ ...s })
          }}
          className="flex-1 py-2 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        >
          应用到全部
        </button>
        <button
          onClick={() => {
            updateSettings(image.id, { ...DEFAULT_SETTINGS })
          }}
          className="flex-1 py-2 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        >
          重置
        </button>
      </div>
    </div>
  )
}
