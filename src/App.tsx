import { Header } from './components/Header'
import { Layout } from './components/Layout'
import { UploadZone } from './components/upload/UploadZone'
import { ImageThumbnail } from './components/upload/ImageThumbnail'
import { EditorPanel } from './components/editor/EditorPanel'
import { ColorGrading } from './components/editor/ColorGrading'
import { WatermarkPanel } from './components/editor/WatermarkPanel'
import { CompressionPanel } from './components/editor/CompressionPanel'
import { PresetManager } from './components/editor/PresetManager'
import { ExportBar } from './components/export/ExportBar'
import { ActivationModal } from './components/activation/ActivationModal'
import { useImageStore } from './stores/useImageStore'
import { useActivationStore } from './stores/useActivationStore'
import { useState } from 'react'

type Tab = 'color' | 'watermark' | 'export' | 'ai'

function App() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const images = useImageStore((s) => s.images)
  const showActivation = useActivationStore((s) => s.showModal)
  const [activeTab, setActiveTab] = useState<Tab>('color')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'color', label: '调色' },
    { key: 'watermark', label: '水印' },
    { key: 'export', label: '导出' },
    { key: 'ai', label: 'AI优化' },
  ]

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Layout
        sidebar={
          <div className="flex flex-col h-full">
            <UploadZone />
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
              {images.map((img) => (
                <ImageThumbnail key={img.id} image={img} />
              ))}
            </div>
            <PresetManager />
          </div>
        }
        preview={<EditorPanel />}
        settings={
          activeImageId ? (
            <div className="flex flex-col h-full">
              <div className="flex border-b border-gray-800">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer ${
                      activeTab === t.key
                        ? 'text-indigo-400 border-b-2 border-indigo-400'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'color' && <ColorGrading />}
                {activeTab === 'watermark' && <WatermarkPanel />}
                {activeTab === 'export' && <CompressionPanel />}
                {activeTab === 'ai' && <AiPanel />}
              </div>
            </div>
          ) : null
        }
      />
      {images.length > 0 && <ExportBar />}
      {showActivation && <ActivationModal />}
    </div>
  )
}

function AiPanel() {
  const activeImageId = useImageStore((s) => s.activeImageId)
  const updateSettings = useImageStore((s) => s.updateSettings)
  const [loading, setLoading] = useState(false)

  const handleAutoEnhance = async () => {
    if (!activeImageId) return
    setLoading(true)
    const { autoEnhance } = await import('./lib/auto-enhance')
    const img = useImageStore.getState().images.find((i) => i.id === activeImageId)
    if (!img) { setLoading(false); return }
    const settings = await autoEnhance(img.originalDataUrl)
    updateSettings(activeImageId, settings)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300">AI 智能优化</h3>
      <p className="text-xs text-gray-500">
        自动分析图片的亮度、对比度、白平衡，一键优化到最佳效果。
      </p>
      <button
        onClick={handleAutoEnhance}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        {loading ? '分析中...' : '一键智能优化'}
      </button>
    </div>
  )
}

export default App
