'use client'
import { useEffect, useState } from 'react'
import SubmissionCard from '../../components/SubmissionCard'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random'

export default function FeedPage() {
  const [sortType, setSortType] = useState<SortType>('newest')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)


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
