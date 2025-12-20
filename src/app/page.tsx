"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => { if (mounted) setUser(data.user) })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      mounted = false
      try { sub.subscription.unsubscribe() } catch {}
    }
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">4Real</h1>
      <p>メールでログインして遊べます。</p>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <div className="font-semibold">{(user.user_metadata as any)?.name ?? user.email}</div>
              <div className="text-gray-500">ログイン済み</div>
            </div>
            <button className="btn" onClick={signOut}>ログアウト</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">ログイン</Link>
            <Link href="/locked">ロック画面へ</Link>
          </div>
        )}
      </div>
    </div>
  )
}
