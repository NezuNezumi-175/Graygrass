'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    pathname === href ? 'text-red-500' : ''

  return (
    <header className="fixed bottom-0 left-0 w-full border-t p-4 flex gap-4 bg-white justify-center">
      <Link href="/" className={linkClass('/')}>Home</Link>
      <Link href="/feed" className={linkClass('/feed')}>Feed</Link>
      <Link href="/capture" className={linkClass('/capture')}>Capture</Link>
      <Link href="/push-setup" className={linkClass('/push-setup')}>Push Setup</Link>
      <Link href="/admin" className={linkClass('/admin')}>Admin</Link>
    </header>
  )
}
