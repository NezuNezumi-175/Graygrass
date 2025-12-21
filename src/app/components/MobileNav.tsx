'use client'

import Link from 'next/link'

type Props = {
  open: boolean
  onMenuClick: () => void
}

export default function MobileNav({ open, onMenuClick }: Props) {
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-gray-200 flex items-center px-4 z-50">
      <button onClick={onMenuClick} className="text-2xl">
        {open ? '×' : '☰'}
      </button>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link
          href="/"
          className="text-xl font-extrabold px-4 py-1 rounded-full bg-white hover:bg-black hover:text-white transition"
        >
          4Real.
        </Link>
      </div>
    </header>
  )
}
