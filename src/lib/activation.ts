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
  if (cleaned.length !== 12) return false

  const part1 = cleaned.slice(0, 4)
  const part2 = cleaned.slice(4, 8)
  const part3 = cleaned.slice(8, 12)

  const expected = fnv1aHash(`${part1}-${part2}-${ACTIVATION_VERIFIER}`)
    .toString(36).toUpperCase().slice(0, 4)

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
