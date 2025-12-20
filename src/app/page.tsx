'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Submission = {
  id: string
  photo_url: string
  created_at: string
}

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [oneYearPosts, setOneYearPosts] = useState<Submission[]>([])
  const [fourYearPosts, setFourYearPosts] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)

  // ユーザー取得
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

  // 投稿取得
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const now = new Date()
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(now.getFullYear() - 1)
        const fourYearsAgoStart = new Date()
        fourYearsAgoStart.setFullYear(now.getFullYear() - 4)
        const fourYearsAgoEnd = new Date()
        fourYearsAgoEnd.setFullYear(now.getFullYear() - 3)

        // 1年以内
        const { data: oneYearData } = await supabase
          .from('submissions')
          .select('id, photo_url, created_at')
          .gte('created_at', oneYearAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(2)

        // 4年前
        const { data: fourYearData } = await supabase
          .from('submissions')
          .select('id, photo_url, created_at')
          .gte('created_at', fourYearsAgoStart.toISOString())
          .lt('created_at', fourYearsAgoEnd.toISOString())
          .order('created_at', { ascending: false })
          .limit(2)

        setOneYearPosts(oneYearData ?? [])
        setFourYearPosts(fourYearData ?? [])
      } catch (err) {
        console.error('Fetch posts error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  // 投稿表示用コンポーネント（画像 or 動画対応）
  const MediaGrid = ({ posts }: { posts: Submission[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map(post => {
        const url = post.photo_url
        const isVideo = url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.includes('video')
        return (
          <figure key={post.id} className="border rounded overflow-hidden">
            {isVideo ? (
              <video src={url} controls className="w-full aspect-square object-cover bg-black" />
            ) : (
              <img src={url} alt="投稿" className="w-full aspect-square object-cover" />
            )}
            <figcaption className="p-2 text-sm">
              <div>{new Date(post.created_at).toLocaleString()}</div>
            </figcaption>
          </figure>
        )
      })}
      {posts.length === 0 && <p>投稿はありません</p>}
    </div>
  )

  return (
    <div className="pt-14 p-6 space-y-6">
      <h1 className="text-6xl font-bold">4Real ホーム</h1>

      {/* ユーザー情報 */}
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

      {/* 見出し部分 */}
      <h3 className="text-4xl font-bold">自分のトレンド</h3>
      <h2 className="text-2xl font-bold">自分の投稿</h2>
      <h2 className="text-2xl font-bold">フレンドの投稿</h2>
      <h3 className="text-4xl font-bold">みんなのトレンド</h3>
      <h2 className="text-2xl font-bold">今日/最近の投稿</h2>

      {loading && <p>読み込み中...</p>}

      {/* 1年以内の投稿 */}
      <section>
        <h2 className="text-2xl font-bold">1年以内の投稿</h2>
        <MediaGrid posts={oneYearPosts} />
      </section>

      {/* 4年前の投稿 */}
      <section>
        <h2 className="text-2xl font-bold">4年前の投稿</h2>
        <MediaGrid posts={fourYearPosts} />
      </section>

      <p>メールでログインして遊べます。</p>
    </div>
  )
}
