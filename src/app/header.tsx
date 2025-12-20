'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

/* 下タブ（Feed / Capture） */
export default function Nav() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed bottom-0 left-0 w-full border-t bg-white h-16 z-40">
      <nav className="h-full flex items-center justify-between px-8">

        {/* Feed（左寄り） */}
        <Link href="/feed">
          <div
            className={`
              px-5 py-2 rounded-full font-extrabold transition ml-10
              ${
                isActive('/feed')
                  ? 'bg-red-400 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-200'
              }
            `}
          >
            ★
          </div>
        </Link>

        {/* Capture（右寄り） */}
        <Link href="/capture">
          <div
            className={`
              px-5 py-2 rounded-full font-extrabold transition -translate-x-10
              ${
                isActive('/capture')
                  ? 'bg-red-400 text-yellow-400'
                  : 'text-gray-400 hover:bg-gray-200'
              }
            `}
          >
            Capture
          </div>
        </Link>

      </nav>
    </header>
  )
}


/* 上ヘッダー */
export function TopHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')

  const isLoginPage = pathname === '/login'

  function handleSearch() {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white flex items-center px-4 font-bold z-50 relative">
      {!isLoginPage && (
        <button onClick={onMenuClick} className="text-xl">
          ☰
        </button>
      )}

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/" className="text-lg tracking-wide">
          4Real
        </Link>
      </div>

      {!isLoginPage && (
        <div className="ml-auto">
          <div className="relative w-[220px] border border-gray-300 rounded-full bg-white">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ユーザー名を入力..."
              className="w-full pl-3 pr-12 py-1 bg-transparent text-sm focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full bg-gray-200 text-xs"
            >
              検索
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

/* 左サイドバー（★変更あり） */
export function LeftSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  const itemClass = (href: string) =>
    `block px-4 py-3 font-bold transition
     ${
       pathname === href
         ? 'bg-red-400 text-yellow-400'
         : 'text-gray-600 hover:bg-gray-200'
     }`

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-48 bg-white border-r z-30
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <nav className="pt-14 space-y-1">
        <Link href="/" className={itemClass('/')}>Home</Link>
        <Link href="/feed" className={itemClass('/feed')}>Feed</Link>
        <Link href="/capture" className={itemClass('/capture')}>Capture</Link>
        <Link href="/mypage" className={itemClass('/mypage')} onClick={onClose}>MyPage</Link>
        <Link href="/push-setup" className={itemClass('/push-setup')} onClick={onClose}>Push Setup</Link>
        <Link href="/admin" className={itemClass('/admin')} onClick={onClose}>Admin</Link>

      </nav>
    </aside>
  )
}
