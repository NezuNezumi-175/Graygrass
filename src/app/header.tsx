'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

/* 上ヘッダー */
export function TopHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white flex items-center justify-between px-4 font-bold z-50">
      <button onClick={onMenuClick} className="text-xl">☰</button>
      <Link href="/">4Real</Link>
      <div className="w-6" />
    </header>
  )
}

/* 左サイドバー */
export function LeftSidebar({ open }: { open: boolean }) {
  const pathname = usePathname()

  const itemClass = (href: string) =>
    `block px-4 py-3 font-bold transition
     ${pathname === href
       ? 'bg-red-400 text-yellow-400'
       : 'text-gray-600 hover:bg-gray-200'
     }`

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-48 bg-white border-r z-30
      transform transition-transform duration-300
      ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <nav className="pt-14 space-y-1">
        <Link href="/push-setup" className={itemClass('/push-setup')}>
          Push Setup
        </Link>
        <Link href="/admin" className={itemClass('/admin')}>
          Admin
        </Link>
      </nav>
    </aside>
  )
}
