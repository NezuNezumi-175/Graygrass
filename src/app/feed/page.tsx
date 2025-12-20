'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random'

export default function FeedPage() {
  const [sortType, setSortType] = useState<SortType>('newest')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)

  supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))

  // 投稿取得（sort_feed API そのまま）
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/sort_feed?sort_type=${sortType}`)
        const json = await res.json()
        setSubmissions(json.submissions ?? [])
      } catch (err) {
        console.error('Fetch feed error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [sortType])

  // ----------------------
  // リアクション追加（/api/reactions POST に対応）
  const handleReaction = async (submissionId: string, type: string) => {
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction: type, user_id: userId, post_id: submissionId }),
      })
      if (!res.ok) {
        console.error('Reaction POST failed:', await res.text())
        return
      }
      // 楽観更新
      setSubmissions(prev =>
        prev.map(s =>
          s.id === submissionId
            ? { ...s, reactions: [...(s.reactions ?? []), { reaction: type, user_id: userId }] }
            : s
        )
      )
    } catch (err) {
      console.error('Reaction error:', err)
    }
  }

  // コメント送信（/api/comments POST に対応）
  const handleCommentSubmit = async (submissionId: string) => {
    const content = commentInputs[submissionId]
    if (!content) return

    try {
        // alert(userId)
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, user_id: userId, post_id: submissionId }),
      })
      if (!res.ok) {
        console.error('Comment POST failed:', await res.text())
        return
      }

      // 楽観更新
      setSubmissions(prev =>
        prev.map(s =>
          s.id === submissionId
            ? { ...s, comments: [...(s.comments ?? []), { content, user_id: userId }] }
            : s
        )
      )
      setCommentInputs(prev => ({ ...prev, [submissionId]: '' }))
    } catch (err) {
      console.error('Comment submit error:', err)
    }
  }

  // ----------------------
  // 以下、既存 FeedPage の表示部分は変更なし
  return (
    <main className="p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <SortButton label="新しい順" active={sortType === 'newest'} onClick={() => setSortType('newest')} />
        <SortButton label="古い順" active={sortType === 'oldest'} onClick={() => setSortType('oldest')} />
        <SortButton label="ユーザー名順" active={sortType === 'user_name'} onClick={() => setSortType('user_name')} />
        <SortButton label="ランダム" active={sortType === 'random'} onClick={() => setSortType('random')} />
      </div>

      {loading && <p>読み込み中...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {submissions.map(s => {
          const url = s.photo_url
          const isVideo = url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.includes('video')

          return (
            <figure key={s.id} className="border rounded overflow-hidden">
              {isVideo ? (
                <video src={url} controls className="w-full aspect-square object-cover bg-black" />
              ) : (
                <img src={url} alt="投稿" className="w-full aspect-square object-cover" />
              )}
              <figcaption className="p-2 text-sm space-y-2">
                <div>{new Date(s.created_at).toLocaleString()}</div>

                {/* リアクション */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReaction(s.id, 'like')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    👍 {s.reactions?.length ?? 0}
                  </button>
                </div>

                {/* コメント */}
                <div className="space-y-1">
                  {(s.comments ?? []).map((c: any, idx: number) => (
                    <div key={idx} className="text-xs bg-gray-100 p-1 rounded">
                      <span className="font-semibold">{c.user_id}</span>: {c.content}
                    </div>
                  ))}
                  <div className="flex gap-1 mt-1">
                    <input
                      type="text"
                      placeholder="コメント..."
                      value={commentInputs[s.id] ?? ''}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                      className="flex-1 border rounded px-1 text-sm"
                    />
                    <button
                      onClick={() => handleCommentSubmit(s.id)}
                      className="px-2 bg-green-500 text-white rounded text-sm"
                    >
                      送信
                    </button>
                  </div>
                </div>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </main>
  )
}

function SortButton({ label, onClick, active }: { label: string; onClick?: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded border text-sm ${active ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
    >
      {label}
    </button>
  )
}
