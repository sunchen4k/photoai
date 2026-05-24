import { ACTIVATION_VERIFIER } from '../constants'

function fnv1aHash(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function verifyCode(code: string): boolean {
  const cleaned = code.toUpperCase().replace(/[^A-Z0-9]/g, '')
  // Format: PHOTO-XXXX-XXXX-XXXX -> 17 chars after removing dashes
  if (!cleaned.startsWith('PHOTO') || cleaned.length !== 17) return false

  const part1 = cleaned.slice(5, 9)
  const part2 = cleaned.slice(9, 13)
  const part3 = cleaned.slice(13, 17)

  const expected = fnv1aHash(`${part1}-${part2}-${ACTIVATION_VERIFIER}`)
    .toString(36).toUpperCase().slice(0, 4).padStart(4, '0')

  return part3 === expected
}

export function isActivated(): boolean {
  try {
    const raw = localStorage.getItem('photo-editor-activation')
    if (!raw) return false
    const data = JSON.parse(raw)
    return data.activated === true && verifyCode(data.code)
  } catch { return false }
}

export function storeActivation(code: string): void {
  localStorage.setItem('photo-editor-activation', JSON.stringify({
    code,
    activated: true,
    activatedAt: Date.now(),
  }))
}

export function clearActivation(): void {
  localStorage.removeItem('photo-editor-activation')
}
