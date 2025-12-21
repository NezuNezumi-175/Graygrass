'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed bottom-0 left-0 w-full h-20 z-40 pointer-events-none hidden md:block">
      <nav className="relative w-full h-full">
        {/* Feed */}
        <Link href="/feed" className="pointer-events-auto">
          <div
            className={`
              absolute left-10 bottom-6
              w-14 h-14 flex items-center justify-center
              rounded-full text-3xl font-extrabold
              transition
              ${isActive('/feed') ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-200'}
            `}
          >
            ★
          </div>
        </Link>

        {/* Capture */}
        <Link href="/capture" className="pointer-events-auto">
          <div
            className={`
              absolute right-10 bottom-6
              w-14 h-14 flex items-center justify-center
              rounded-full text-3xl font-extrabold
              transition
              ${isActive('/capture') ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-200'}
            `}
          >
            ＋
          </div>
        </Link>
      </nav>
    </header>
  )
}
