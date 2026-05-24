export interface ImageSettings {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  temperature: number
  sharpness: number
}

export type WatermarkType = 'text' | 'image'

export type WatermarkPosition =
  | 'topLeft' | 'topCenter' | 'topRight'
  | 'centerLeft' | 'center' | 'centerRight'
  | 'bottomLeft' | 'bottomCenter' | 'bottomRight'

export interface TextWatermarkConfig {
  text: string
  font: string
  fontSize: number
  color: string
  opacity: number
  position: WatermarkPosition
}

export interface ImageWatermarkConfig {
  dataUrl: string
  opacity: number
  scale: number
  position: WatermarkPosition
}

export interface WatermarkConfig {
  type: WatermarkType
  enabled: boolean
  text: TextWatermarkConfig
  image: ImageWatermarkConfig
}

export interface ImageItem {
  id: string
  file: File
  originalDataUrl: string
  processedBlob: Blob | null
  thumbnailUrl: string
  width: number
  height: number
  settings: ImageSettings
  watermark: WatermarkConfig
  compressionQuality: number
  compressionFormat: 'image/jpeg' | 'image/png' | 'image/webp'
  resizeWidth: number | null
  resizeHeight: number | null
  edited: boolean
}

export interface Preset {
  name: string
  settings: ImageSettings
  createdAt: number
}
