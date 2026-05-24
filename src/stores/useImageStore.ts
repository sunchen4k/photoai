import { create } from 'zustand'
import type { ImageItem, ImageSettings } from '../types'
import { DEFAULT_SETTINGS, DEFAULT_WATERMARK } from '../constants'

interface ImageStore {
  images: ImageItem[]
  activeImageId: string | null
  isProcessing: boolean

  addImages: (files: File[]) => Promise<void>
  removeImage: (id: string) => void
  setActiveImage: (id: string) => void
  updateSettings: (id: string, patch: Partial<ImageSettings>) => void
  setProcessedBlob: (id: string, blob: Blob) => void
  setProcessing: (v: boolean) => void
  applySettingsToAll: (settings: ImageSettings) => void
  markEdited: (id: string) => void
  clearAll: () => void
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

function createThumbnail(dataUrl: string, maxSize = 200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = dataUrl
  })
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  activeImageId: null,
  isProcessing: false,

  addImages: async (files: File[]) => {
    const newItems: ImageItem[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      const dataUrl = await fileToDataUrl(file)
      const thumbnailUrl = await createThumbnail(dataUrl)
      const img = new Image()
      await new Promise<void>((resolve) => {
        img.onload = () => resolve()
        img.src = dataUrl
      })
      newItems.push({
        id: crypto.randomUUID(),
        file,
        originalDataUrl: dataUrl,
        processedBlob: null,
        thumbnailUrl,
        width: img.width,
        height: img.height,
        settings: { ...DEFAULT_SETTINGS },
        watermark: { ...DEFAULT_WATERMARK, enabled: false },
        compressionQuality: 92,
        compressionFormat: 'image/jpeg',
        resizeWidth: null,
        resizeHeight: null,
        edited: false,
        version: 0,
      })
    }
    const images = [...get().images, ...newItems]
    set({ images, activeImageId: get().activeImageId || (newItems[0]?.id ?? null) })
  },

  removeImage: (id) => {
    const images = get().images.filter((i) => i.id !== id)
    const activeImageId = get().activeImageId === id
      ? (images[0]?.id ?? null)
      : get().activeImageId
    set({ images, activeImageId })
  },

  setActiveImage: (id) => set({ activeImageId: id }),

  updateSettings: (id, patch) => {
    const images = get().images.map((i) =>
      i.id === id ? { ...i, settings: { ...i.settings, ...patch }, edited: true, version: i.version + 1 } : i
    )
    set({ images })
  },

  setProcessedBlob: (id, blob) => {
    const images = get().images.map((i) =>
      i.id === id ? { ...i, processedBlob: blob } : i
    )
    set({ images })
  },

  setProcessing: (v) => set({ isProcessing: v }),

  applySettingsToAll: (settings) => {
    const images = get().images.map((i) => ({
      ...i,
      settings: { ...settings },
      edited: true,
    }))
    set({ images })
  },

  markEdited: (id) => {
    const images = get().images.map((i) =>
      i.id === id ? { ...i, edited: true } : i
    )
    set({ images })
  },

  clearAll: () => set({ images: [], activeImageId: null }),
}))
