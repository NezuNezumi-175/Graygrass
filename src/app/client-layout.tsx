'use client'

import { useState } from 'react'
import { LeftSidebar, TopHeader } from './header'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <TopHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* サイドバー（上に重なる） */}
      <LeftSidebar open={sidebarOpen} />

      {/* オーバーレイ（クリックで閉じる） */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* メイン（動かさない） */}
      <main className="pt-14 pb-16 relative z-10">
        {children}
      </main>
    </>
  )
}
