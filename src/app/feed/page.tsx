'use client'

import { useEffect, useState } from 'react'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random' | 'reactions'

export default function FeedPage({ eventId }: { eventId?: string }) {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [sortType, setSortType] = useState<SortType>('newest')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (eventId) params.set('eventId', eventId)
        params.set('sort_type', sortType)

        const res = await fetch(`/api/sort_feed?${params.toString()}`)
        const json = await res.json()
        setSubmissions(json.submissions ?? [])
      } catch (e) {
        console.error('fetchFeed error:', e)
        setSubmissions([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [eventId, sortType])

  return (
    <main className="p-6 space-y-4">
      {/* ソートボタン */}
      <div className="flex gap-2 flex-wrap">
        <SortButton
          label="新しい順"
          active={sortType === 'newest'}
          onClick={() => setSortType('newest')}
        />
        <SortButton
          label="古い順"
          active={sortType === 'oldest'}
          onClick={() => setSortType('oldest')}
        />
        <SortButton
          label="ユーザー名順"
          active={sortType === 'user_name'}
          onClick={() => setSortType('user_name')}
        />
        <SortButton
          label="ランダム"
          active={sortType === 'random'}
          onClick={() => setSortType('random')}
        />
        <SortButton
          label="リアクション順（未実装）"
          active={false}
          disabled
        />
      </div>

      {loading && <p>読み込み中...</p>}

      {/* フィード */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {submissions.map((s: any) => {
          const url = s.photo_url
          const isVideo =
            url?.endsWith('.mp4') ||
            url?.endsWith('.mov') ||
            url?.endsWith('.webm') ||
            url?.includes('video')

          return (
            <figure key={s.id} className="rounded-lg overflow-hidden border">
              {isVideo ? (
                <video
                  src={url}
                  controls
                  muted
                  playsInline
                  className="w-full aspect-square bg-black object-cover"
                />
              ) : (
                <img
                  src={url}
                  alt={s.user_name ? `${s.user_name}の投稿` : '投稿'}
                  className="w-full aspect-square object-cover"
                />
              )}
              <figcaption className="p-2 text-sm">
                {new Date(s.created_at).toLocaleString()}
                {s.user_name ? ` - ${s.user_name}` : ''}
              </figcaption>
            </figure>
          )
        })}
      </div>
    </main>
  )
}

function SortButton({
  label,
  onClick,
  active,
  disabled = false,
}: {
  label: string
  onClick?: () => void
  active: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-1 rounded border text-sm
        ${active ? 'bg-black text-white' : 'bg-white'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}
      `}
    >
      {label}
    </button>
  )
}
