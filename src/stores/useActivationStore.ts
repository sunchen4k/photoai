import { create } from 'zustand'
import { verifyCode, storeActivation } from '../lib/activation'

const STORAGE_KEY = 'photo-editor-activation'

interface ActivationStore {
  tier: 'free' | 'paid'
  showModal: boolean
  activate: (code: string) => { success: boolean; message: string }
  openModal: () => void
  closeModal: () => void
  isFreeTier: () => boolean
}

function initTier(): 'free' | 'paid' {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 'free'
    const data = JSON.parse(raw)
    return data.activated && verifyCode(data.code) ? 'paid' : 'free'
  } catch { return 'free' }
}

export const useActivationStore = create<ActivationStore>((set, get) => ({
  tier: initTier(),
  showModal: false,

  activate: (code: string) => {
    if (verifyCode(code)) {
      storeActivation(code)
      set({ tier: 'paid', showModal: false })
      return { success: true, message: '激活成功！已解锁全部功能。' }
    }
    return { success: false, message: '激活码无效，请检查后重试。' }
  },

  openModal: () => set({ showModal: true }),
  closeModal: () => set({ showModal: false }),
  isFreeTier: () => get().tier === 'free',
}))
