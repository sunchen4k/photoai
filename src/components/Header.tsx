export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
      <h1 className="text-lg font-semibold">
        <span className="text-indigo-400">Photo</span>AI
      </h1>
      <div className="flex items-center gap-3">
        <ActivationBadge />
      </div>
    </header>
  )
}

function ActivationBadge() {
  const tier = useActivationStore((s) => s.tier)
  const openModal = useActivationStore((s) => s.openModal)

  if (tier === 'paid') {
    return (
      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">
        已激活
      </span>
    )
  }

  return (
    <button
      onClick={openModal}
      className="text-xs px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer"
    >
      激活
    </button>
  )
}

import { useActivationStore } from '../stores/useActivationStore'
