'use client'

import { useEffect, useState } from 'react'
import SubmissionCard from '../../components/SubmissionCard'
import { createClient } from '@/lib/supabase/client'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random' | 'reactions'

export default function FeedPage() {
  const [sortType, setSortType] = useState<SortType>('newest')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState<string[]>([])
  const [filterFollowing, setFilterFollowing] = useState(false) // フォロー中だけ表示ON/OFF

  const supabase = createClient()

  // 投稿取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('sort_type', sortType)
        params.set('filter_following', filterFollowing ? 'true' : 'false')

        const res = await fetch(`/api/sort_feed?${params.toString()}`)
        const json = await res.json()
        setSubmissions(json.submissions ?? [])

        // ログインユーザー取得してフォローリストも更新
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: follows, error } = await supabase
          .from('follows')
          .select('follow_id')
          .eq('follower_id', user.id)

        if (!error && follows) {
          setFollowing(follows.map(f => f.follow_id))
        }
      } catch (err) {
        console.error('Fetch feed error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [sortType, filterFollowing])

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    setFollowing(prev => {
      if (isFollowing) return [...prev, userId]
      return prev.filter(id => id !== userId)
    })
  }

  return (
    <main className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* ソートボタン & フォロー中のみ表示トグル */}
      <div className="flex gap-2 flex-wrap items-center bg-gray-100 p-3 rounded-lg">
        <SortButton label="新しい順" active={sortType === 'newest'} onClick={() => setSortType('newest')} />
        <SortButton label="古い順" active={sortType === 'oldest'} onClick={() => setSortType('oldest')} />
        <SortButton label="ユーザー名順" active={sortType === 'user_name'} onClick={() => setSortType('user_name')} />
        <SortButton label="ランダム" active={sortType === 'random'} onClick={() => setSortType('random')} />
        <SortButton label="リアクション順" active={sortType === 'reactions'} onClick={() => setSortType('reactions')} />

        {/* フォロー中のみ表示トグル */}
        <label className="ml-4 flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={filterFollowing}
            onChange={e => setFilterFollowing(e.target.checked)}
            className="w-4 h-4 accent-gray-400"
          />
          フォロー中のみ
        </label>
      </div>

      {loading && <p className="text-gray-500">読み込み中...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {submissions.map(s => (
          <SubmissionCard
            key={s.id}
            id={s.id}
            user_id={s.user_id}
            photo_url={s.photo_url}
            created_at={s.created_at}
            comments={s.comments}
            reactions={s.reactions}
            isFollowing={following.includes(s.user_id)}
            onFollowChange={handleFollowChange}
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
      className={`px-3 py-1 rounded border text-sm transition-colors duration-200
        ${active ? 'bg-gray-700 text-white border-gray-700' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}
    >
      {label}
    </button>
  )
}
