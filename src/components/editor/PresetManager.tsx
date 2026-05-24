import { useState } from 'react'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useImageStore } from '../../stores/useImageStore'
import { useActivationStore } from '../../stores/useActivationStore'

export function PresetManager() {
  const presets = useSettingsStore((s) => s.presets)
  const savePreset = useSettingsStore((s) => s.savePreset)
  const loadPreset = useSettingsStore((s) => s.loadPreset)
  const deletePreset = useSettingsStore((s) => s.deletePreset)
  const activeImageId = useImageStore((s) => s.activeImageId)
  const updateSettings = useImageStore((s) => s.updateSettings)
  const tier = useActivationStore((s) => s.tier)
  const isFree = tier === 'free'
  const [name, setName] = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    savePreset(name.trim())
    setName('')
  }

  const handleLoad = (presetName: string) => {
    const settings = loadPreset(presetName)
    if (settings && activeImageId) {
      updateSettings(activeImageId, settings)
    }
  }

  return (
    <div className="p-2 border-t border-gray-800">
      <div className="flex gap-1 mb-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="预设名称"
          disabled={isFree}
          className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={handleSave}
          disabled={isFree}
          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-xs text-white transition-colors cursor-pointer"
        >
          保存
        </button>
      </div>
      {isFree && (
        <p className="text-[10px] text-gray-600 mb-1">激活后可保存预设</p>
      )}
      {presets.length > 0 && (
        <div className="max-h-32 overflow-y-auto space-y-1">
          {presets.map((p) => (
            <div key={p.name} className="flex items-center gap-1">
              <button
                onClick={() => handleLoad(p.name)}
                className="flex-1 px-2 py-1 text-xs text-left text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors cursor-pointer"
              >
                {p.name}
              </button>
              <button
                onClick={() => deletePreset(p.name)}
                className="text-[10px] text-gray-600 hover:text-red-400 px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
