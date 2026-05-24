interface ModalProps {
  children: React.ReactNode
  onClose?: () => void
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  )
}
