'use client'

import { useState } from 'react'
import Nav from '@/app/components/Nav'
import MobileNav from '@/app/components/MobileNav'
import MobileBottomNav from '@/app/components/MobileBottomNav'
import TopHeader from '@/app/components/TopHeader'
import LeftSidebar from '@/app/components/LeftSidebar'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <>
      {/* ===== 上ヘッダー ===== */}

      {/* スマホ */}
      <div className="md:hidden">
        <MobileNav open={sidebarOpen} onMenuClick={toggleSidebar} />
      </div>

      {/* PC */}
      <div className="hidden md:block">
        <TopHeader open={sidebarOpen} onMenuClick={toggleSidebar} />
      </div>

      {/* ===== サイドバー（共通） ===== */}
      <LeftSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ===== Overlay ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== メイン ===== */}
      <main className="pt-14 pb-24 md:pl-48 relative z-10">
        {children}
      </main>

      {/* ===== 下ナビ ===== */}

      {/* スマホ */}
      <MobileBottomNav />

      {/* PC */}
      <Nav />
    </>
  )
}
