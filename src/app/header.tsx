'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `px-5 py-2 rounded-full transition
     ${pathname === href
       ? 'bg-red-400 text-yellow-400 hover:bg-red-500'
       : 'bg-gray-300 text-gray-400 hover:bg-gray-400 hover:text-gray-600'
     }`

  return (
    <header className="fixed bottom-0 left-0 w-full border-t p-4 flex gap-12 bg-white justify-center font-extrabold">
      <Link href="/" className={linkClass('/')}>Home</Link>
      <Link href="/feed" className={linkClass('/feed')}>Feed</Link>
      <Link href="/capture" className={linkClass('/capture')}>Capture</Link>
      <Link href="/push-setup" className={linkClass('/push-setup')}>Push Setup</Link>
      <Link href="/admin" className={linkClass('/admin')}>Admin</Link>
    </header>
  )
}
