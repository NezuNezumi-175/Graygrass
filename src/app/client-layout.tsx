'use client'

import { useState } from 'react'
import Nav, { LeftSidebar, TopHeader } from './header'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <TopHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* 左サイドバー */}
      <LeftSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)} // ★ 追加
      />

      {/* オーバーレイ（クリックで閉じる） */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* メイン */}
      <main className="pt-14 pb-16 relative z-10">
        {children}
      </main>
      <Nav />
    </>
  )
}
