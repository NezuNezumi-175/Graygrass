'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

/* 下タブ（Feed / Capture） */
export default function Nav() {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `flex-1 flex items-center justify-center transition
     ${pathname === href
       ? 'bg-red-400 text-yellow-400'
       : 'bg-gray-300 text-gray-400 hover:bg-gray-400 hover:text-gray-600'
     }`

  return (
    <header className="fixed bottom-0 left-0 w-full border-t flex bg-white font-extrabold h-16 z-40">
      <Link href="/feed" className={linkClass('/feed')}>Feed</Link>
      <Link href="/capture" className={linkClass('/capture')}>Capture</Link>
    </header>
  )
}

/* 上ヘッダー（検索機能付き） */
export function TopHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch() {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white flex items-center px-4 font-bold z-50">
      
      {/* 左：メニューボタン */}
      <button onClick={onMenuClick} className="text-xl mr-4">
        ☰
      </button>

      {/* 中央：ロゴ */}
      <div className="flex-1 flex justify-center">
        <Link href="/">4Real</Link>
      </div>

      {/* 右：検索バー（ボタン内包） */}
      <div className="ml-auto">
        <div
          className="
            relative
            w-[220px]
            border border-gray-300
            rounded-full
            bg-white
            focus-within:ring-1
            focus-within:ring-gray-400
          "
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ユーザー名を入力..."
            className="
              w-full
              pl-3 pr-12
              py-1
              bg-transparent
              text-sm
              text-gray-800
              placeholder-gray-400
              focus:outline-none
            "
          />

          <button onClick={handleSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs hover:bg-gray-300 transition">
              検索
          </button>
        </div>
      </div>
</header>
  )
}

/* 左サイドバー */
export function LeftSidebar({ open }: { open: boolean }) {
  const pathname = usePathname()

  const itemClass = (href: string) =>
    `block px-4 py-3 font-bold transition
     ${pathname === href ? 'bg-red-400 text-yellow-400' : 'text-gray-600 hover:bg-gray-200'}`

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-48 bg-white border-r z-30 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="pt-14 space-y-1">
        <Link href="/push-setup" className={itemClass('/push-setup')}>Push Setup</Link>
        <Link href="/admin" className={itemClass('/admin')}>Admin</Link>
      </nav>
    </aside>
  )
}
