'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 z-40 md:hidden pointer-events-none">
      <div className="relative w-full h-full">

        {/* Feed ★ */}
        <Link href="/feed" className="pointer-events-auto">
          <div
            className={`
              absolute left-6 bottom-6
              w-14 h-14 flex items-center justify-center
              rounded-full font-extrabold text-3xl
              transition
              ${isActive('/feed')
                ? 'bg-black text-white'
                : 'text-gray-400 hover:bg-gray-200/60'}
            `}
          >
            ★
          </div>
        </Link>

        {/* Capture ＋ */}
        <Link href="/capture" className="pointer-events-auto">
          <div
            className={`
              absolute right-6 bottom-6
              w-14 h-14 flex items-center justify-center
              rounded-full font-extrabold text-3xl
              transition
              ${isActive('/capture')
                ? 'bg-black text-white'
                : 'text-gray-400 hover:bg-gray-200/60'}
            `}
          >
            ＋
          </div>
        </Link>

      </div>
    </nav>
  )
}
