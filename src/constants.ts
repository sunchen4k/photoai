import type { ImageSettings, WatermarkConfig } from './types'

export const FREE_MAX_IMAGES = 3
export const FREE_MAX_QUALITY = 80
export const FREE_EXPORT_FORMATS: Array<'image/jpeg'> = ['image/jpeg']

export const DEFAULT_SETTINGS: ImageSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  temperature: 0,
  sharpness: 0,
}

export const DEFAULT_WATERMARK: WatermarkConfig = {
  type: 'text',
  enabled: false,
  text: {
    text: '',
    font: 'sans-serif',
    fontSize: 36,
    color: '#ffffff',
    opacity: 0.5,
    position: 'bottomRight',
  },
  image: {
    dataUrl: '',
    opacity: 0.5,
    scale: 0.2,
    position: 'bottomRight',
  },
}

// Pre-computed: FNV-1a hash of a secret seed. Used to verify activation codes.
// This is NOT the same as the private key used to generate codes.
export const ACTIVATION_VERIFIER = 'photoai-2026-secret-key'
