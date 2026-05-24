export function Layout({
  sidebar,
  preview,
  settings,
}: {
  sidebar: React.ReactNode
  preview: React.ReactNode
  settings: React.ReactNode
}) {
  return (
    <div className="flex-1 flex min-h-0">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        {sidebar}
      </aside>
      <main className="flex-1 bg-gray-950 flex items-center justify-center min-w-0">
        {preview}
      </main>
      <aside className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
        {settings}
      </aside>
    </div>
  )
}
