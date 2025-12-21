'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  open: boolean
  onClose: () => void
}

export default function LeftSidebar({ open, onClose }: Props) {
  const pathname = usePathname()

  const itemClass = (href: string) =>
    `block px-4 py-3 mx-2 rounded-full transition
     ${pathname === href
       ? 'font-extrabold bg-gray-200'
       : 'font-bold text-gray-600 hover:bg-gray-200'}`

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    onClose()
    window.location.href = '/locked'
  }

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-dvh
        w-64 md:w-48
        bg-white border-r
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <nav className="pt-14 space-y-1">
        <Link href="/" className={itemClass('/')} onClick={onClose}>Home</Link>
        <Link href="/feed" className={itemClass('/feed')} onClick={onClose}>Feed</Link>
        <Link href="/capture" className={itemClass('/capture')} onClick={onClose}>Capture</Link>
        <Link href="/mypage" className={itemClass('/mypage')} onClick={onClose}>MyPage</Link>
        <Link href="/push-setup" className={itemClass('/push-setup')} onClick={onClose}>Push Setup</Link>
        <Link href="/admin" className={itemClass('/admin')} onClick={onClose}>Admin</Link>
        <button onClick={signOut} className={itemClass('#')}>Logout</button>
      </nav>
    </aside>
  )
}
