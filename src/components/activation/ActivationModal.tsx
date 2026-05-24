import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { useActivationStore } from '../../stores/useActivationStore'

export function ActivationModal() {
  const closeModal = useActivationStore((s) => s.closeModal)
  const activate = useActivationStore((s) => s.activate)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const handleActivate = () => {
    const result = activate(code.trim())
    setMessage(result.message)
    setError(!result.success)
    if (result.success) {
      setCode('')
    }
  }

  return (
    <Modal onClose={closeModal}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">激活 PhotoAI</h2>
        <p className="text-sm text-gray-400">
          输入激活码解锁全部功能：无限批量处理、自定义水印、PNG/WebP 导出、预设保存等。
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setMessage(''); setError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
          placeholder="PHOTO-XXXX-XXXX-XXXX"
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm outline-none focus:border-indigo-500 font-mono tracking-wider text-center"
        />
        {message && (
          <p className={`text-sm ${error ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={closeModal}
            className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleActivate}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            激活
          </button>
        </div>
        <p className="text-[10px] text-gray-600 text-center">
          激活码可在闲鱼/淘宝购买，一次购买永久使用。
        </p>
      </div>
    </Modal>
  )
}
