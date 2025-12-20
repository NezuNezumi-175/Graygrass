'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/* 下タブ（Feed / Capture） */
export default function Nav() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <header className="fixed bottom-0 left-0 w-full h-20 z-40 pointer-events-none">
      <nav className="relative w-full h-full">

        {/* Feed（★：左端寄り・少し上） */}
        <Link href="/feed" className="pointer-events-auto">
          <div
            className={`
              absolute left-30 bottom-6
              w-30 h-30 flex items-center justify-center
              rounded-full font-extrabold text-7xl
              transition
              ${isActive('/feed')
               ? 'bg-black text-white'
               : 'text-gray-400 hover:bg-gray-200/60'
              }

            `}
          >
            ★
          </div>
        </Link>

        {/* Capture（✚：右端寄り・少し上） */}
        <Link href="/capture" className="pointer-events-auto">
          <div
            className={`
              absolute right-30 bottom-6
              w-30 h-30 flex items-center justify-center
              rounded-full font-extrabold text-6xl
              transition
              ${isActive('/capture')
  ? 'bg-black text-white'
  : 'text-gray-400 hover:bg-gray-200/60'
}

            `}
          >
            ✚
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
  const supabase = createClient()
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const isLoginPage = pathname === '/login'

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setUserAvatarUrl(data?.avatar_url || null);
      setUserName(data?.name || null);
    })()
  }, [supabase])

  function handleSearch() {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white flex items-center px-4 font-bold z-50">
      {!isLoginPage && (
        <>
          <button onClick={onMenuClick} className="text-xl">
            ☰
          </button>
          {userAvatarUrl &&
            <div className="mx-4 flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={userAvatarUrl}
                alt={userName || 'User avatar'}
              />
              <span className="text-sm font-semibold text-gray-700">{userName}</span>
            </div>
          }
        </>
      )}

      <div className="absolute left-1/2 -translate-x-1/2">
  <Link
  href="/"
  className="
    text-2xl font-extrabold tracking-wide
    px-2 py-1
    hover:bg-black hover:text-white
    transition
  "
>
  4Real.
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

/* 左サイドバー */
export function LeftSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  const itemClass = (href: string) =>
  `block px-4 py-3 mx-2 transition rounded-full
   text-gray-600 hover:bg-gray-200
   ${pathname === href ? 'font-extrabold' : 'font-bold'}`

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    onClose()
    window.location.href = '/locked'
  }


  return (
    <aside
  className={`
    fixed top-0 left-0 h-screen w-48
    bg-white border-r z-40  
    transform transition-transform duration-300
    ${open ? 'translate-x-0' : '-translate-x-full'}
    overflow-y-auto
  `}
>
      <nav className="pt-14 space-y-1">
        <Link href="/" className={itemClass('/')}>Home</Link>
        <Link href="/feed" className={itemClass('/feed')}>Feed</Link>
        <Link href="/capture" className={itemClass('/capture')}>Capture</Link>
        <Link href="/mypage" className={itemClass('/mypage')} onClick={onClose}>MyPage</Link>
        <Link href="/push-setup" className={itemClass('/push-setup')} onClick={onClose}>Push Setup</Link>
        <Link href="/admin" className={itemClass('/admin')} onClick={onClose}>Admin</Link>
        <button onClick={signOut} className={itemClass('#')}>Logout</button>
      </nav>
    </aside>
  )
}

/* メインコンテンツ例 */
export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-14 pl-48 pb-20">
      {children}
    </main>
  )
}
