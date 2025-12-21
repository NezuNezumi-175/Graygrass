'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  open: boolean
  onMenuClick: () => void
}

export default function TopHeader({ open, onMenuClick }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [query, setQuery] = useState('')
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    if (pathname === '/login') return

    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, name')
        .eq('id', user.id)
        .single()

      setUserAvatarUrl(data?.avatar_url ?? null)
      setUserName(data?.name ?? null)
    })()
  }, [pathname, supabase])

  if (pathname === '/login') return null

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-gray-200 flex items-center px-4 z-50">
      {/* ☰ / × */}
      <button onClick={onMenuClick} className="text-2xl mr-4">
        {open ? '×' : '☰'}
      </button>

      {/* ユーザー */}
      {userAvatarUrl && (
        <div className="flex items-center gap-2 mr-6">
          <img
            src={userAvatarUrl}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-semibold">{userName}</span>
        </div>
      )}

      {/* ロゴ */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link
          href="/"
          className="text-2xl font-extrabold px-4 py-1 rounded-full bg-white hover:bg-black hover:text-white transition"
        >
          4Real.
        </Link>
      </div>

      {/* 検索 */}
      <div className="ml-auto w-[220px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="ユーザー名を入力..."
          className="w-full px-3 py-1 text-sm rounded-full border focus:outline-none"
        />
      </div>
    </header>
  )
}
