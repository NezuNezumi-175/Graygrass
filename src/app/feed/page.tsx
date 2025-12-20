'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import SubmissionCard from '../../components/SubmissionCard'

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
        {submissions.map(s => (
          <SubmissionCard
            key={s.id}
            s={s}
            commentValue={commentInputs[s.id] ?? ''}
            onCommentChange={(id, value) => setCommentInputs(prev => ({ ...prev, [id]: value }))}
            onCommentSubmit={handleCommentSubmit}
            onReaction={handleReaction}
          />
        ))}
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
