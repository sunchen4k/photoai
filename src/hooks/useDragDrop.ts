import { useCallback, useRef, useEffect } from 'react'

export function useDragDrop(onDrop: (files: File[]) => void) {
  const dragCounter = useRef(0)
  const ref = useRef<HTMLDivElement>(null)

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    ref.current?.classList.add('border-indigo-400', 'bg-indigo-500/10')
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      ref.current?.classList.remove('border-indigo-400', 'bg-indigo-500/10')
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    ref.current?.classList.remove('border-indigo-400', 'bg-indigo-500/10')

    const files = Array.from(e.dataTransfer?.files || [])
      .filter((f) => f.type.startsWith('image/'))
    if (files.length > 0) onDrop(files)
  }, [onDrop])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('dragenter', handleDragEnter)
    el.addEventListener('dragleave', handleDragLeave)
    el.addEventListener('dragover', handleDragOver)
    el.addEventListener('drop', handleDrop)
    return () => {
      el.removeEventListener('dragenter', handleDragEnter)
      el.removeEventListener('dragleave', handleDragLeave)
      el.removeEventListener('dragover', handleDragOver)
      el.removeEventListener('drop', handleDrop)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  return ref
}
