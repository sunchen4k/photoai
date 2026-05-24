import type { ImageItem } from '../types'
import { processImage } from './processor'

export async function exportSingle(item: ImageItem, isFreeTier: boolean): Promise<void> {
  const blob = await processImage(item, isFreeTier)
  const ext = item.compressionFormat.split('/')[1]
  downloadBlob(blob, `${item.file.name.replace(/\.[^.]+$/, '')}_edited.${ext}`)
}

export async function exportAll(items: ImageItem[], isFreeTier: boolean): Promise<void> {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const blob = await processImage(item, isFreeTier)
    const ext = item.compressionFormat.split('/')[1]
    zip.file(`${item.file.name.replace(/\.[^.]+$/, '')}_edited.${ext}`, blob)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(zipBlob, 'photos_edited.zip')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
