import { create } from 'zustand'
import type { ImageSettings, Preset } from '../types'
import { DEFAULT_SETTINGS } from '../constants'

const STORAGE_KEY = 'photo-editor-presets'

function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePresets(presets: Preset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

interface SettingsStore {
  globalSettings: ImageSettings
  presets: Preset[]
  setGlobalSettings: (patch: Partial<ImageSettings>) => void
  savePreset: (name: string) => void
  loadPreset: (name: string) => ImageSettings | null
  deletePreset: (name: string) => void
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  globalSettings: { ...DEFAULT_SETTINGS },
  presets: loadPresets(),

  setGlobalSettings: (patch) =>
    set((s) => ({ globalSettings: { ...s.globalSettings, ...patch } })),

  savePreset: (name) => {
    const presets = [...get().presets]
    const existing = presets.findIndex((p) => p.name === name)
    const preset: Preset = {
      name,
      settings: { ...get().globalSettings },
      createdAt: Date.now(),
    }
    if (existing >= 0) presets[existing] = preset
    else presets.push(preset)
    savePresets(presets)
    set({ presets })
  },

  loadPreset: (name) => {
    const preset = get().presets.find((p) => p.name === name)
    if (!preset) return null
    set({ globalSettings: { ...preset.settings } })
    return preset.settings
  },

  deletePreset: (name) => {
    const presets = get().presets.filter((p) => p.name !== name)
    savePresets(presets)
    set({ presets })
  },
}))
