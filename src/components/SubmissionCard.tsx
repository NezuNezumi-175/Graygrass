'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import CommentBox from "./CommentBox"

type SubmissionProps = {
  id: string
  user_id: string
  photo_url: string
  created_at: string
  comments?: any[]
  reactions?: { user_id: string }[]
  isFollowing?: boolean
  onFollowChange?: (userId: string, isFollowing: boolean) => void
}

export default function SubmissionCard(s: SubmissionProps) {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [likeCount, setLikeCount] = useState(s.reactions?.length || 0)
  const [comments, setComments] = useState(s?.comments || [])
  const [userId, setUserId] = useState<string | null>(null)
  const [commentInput, setCommentInput] = useState("")
  const [doYouLike, setDoYouLike] = useState(false)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const url = s?.photo_url
  const isVideo = url?.endsWith(".mp4") || url?.endsWith(".mov") || url?.includes("video")

  // 初期フォロー状態を反映
  useEffect(() => {
    setIsFollowing(s.isFollowing || false)
  }, [s.isFollowing])

  // ログインユーザー取得
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  // 投稿者情報取得
  useEffect(() => {
    if (!s?.user_id) return
    let mounted = true
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", s?.user_id).single()
        if (!error && mounted) setUser(data)
      } catch (err) {
        console.error("User fetch error:", err)
      }
    }
    fetchUser()
    return () => { mounted = false }
  }, [s?.user_id])

  // like count 取得
  useEffect(() => {
    supabase.from("reactions").select("*").eq("post_id", s?.id).then(({ data }) => {
      setLikeCount(data?.length || 0)
    })
  }, [s?.id])

  // do you like?
  useEffect(() => {
    if (!userId) return
    supabase
      .from("reactions")
      .select("*")
      .eq("post_id", s?.id)
      .eq("user_id", userId)
      .then(({ data }) => setDoYouLike((data && data.length > 0) || false))
  }, [s?.id, userId])

  // コメント取得
  useEffect(() => {
    supabase.from("comments").select("*").eq("post_id", s?.id).then(({ data }) => {
      setComments(data || [])
    })
  }, [s?.id])

  // リアクション追加
  const onReaction = async (submissionId: string, type: string) => {
    if (!userId) return
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: type, user_id: userId, post_id: submissionId }),
      })
      if (!res.ok) return
      setLikeCount(prev => doYouLike ? Math.max(prev - 1, 0) : prev + 1)
      setDoYouLike(prev => !prev)
    } catch (err) {
      console.error(err)
    }
  }

  // コメント送信
  const onCommentSubmit = async (submissionId: string) => {
    if (!commentInput || !userId) return
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInput, user_id: userId, post_id: submissionId }),
      })
      const json = await res.json()
      if (!json.ok) return
      setCommentInput("")
      setComments(prev => [...prev, { ...json.comment, user: json.user }])
    } catch (err) {
      console.error(err)
    }
  }

  // フォロー処理
  const handleFollow = async () => {
    if (!userId) return
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_id: s.user_id, follower_id: userId })
      })
      if (!res.ok) throw new Error('フォロー失敗')
      setIsFollowing(true)
      s.onFollowChange?.(s.user_id, true)
    } catch (err) {
      console.error(err)
      alert('フォローできませんでした')
    }
  }

  // アンフォロー処理
  const handleUnfollow = async () => {
    if (!userId) return
    try {
      const res = await fetch('/api/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_id: s.user_id, follower_id: userId })
      })
      if (!res.ok) throw new Error('アンフォロー失敗')
      setIsFollowing(false)
      s.onFollowChange?.(s.user_id, false)
    } catch (err) {
      console.error(err)
      alert('アンフォローできませんでした')
    }
  }

  return (
    <figure key={s?.id} className="border border-gray-200 rounded overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
      {isVideo ? (
        <video src={url} controls className="w-full aspect-square object-cover bg-black" />
      ) : (
        <img src={url} alt="投稿" className="w-full aspect-square object-cover" />
      )}
      <figcaption className="p-3 text-sm space-y-3">
        {/* ユーザー情報 */}
        <div className="flex items-start gap-3">
          <Link href={`/user/${user?.id}`}>
            <img
              src={user?.avatar_url || '/placeholder-avatar.png'}
              alt={user?.name ?? "avatar"}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
              loading="lazy"
            />
          </Link>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-900">{user?.name ?? "Unknown"}</p>
              <span className="text-xs text-gray-500">{new Date(s?.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* リアクション + フォロー */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onReaction(s?.id, "like")}
            className={`px-2 py-1 rounded text-sm transition-colors duration-200 
              ${doYouLike ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
          >
            👍 {likeCount}
          </button>

          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-2 py-1 rounded text-sm transition-colors duration-200
              ${isFollowing ? 'bg-gray-300 text-black hover:bg-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            {isFollowing ? "フォロー中" : "フォロー"}
          </button>
        </div>

        {/* コメント */}
        <div className="space-y-1">
          {comments.map(comment => (
            <CommentBox key={comment.id} {...comment} />
          ))}
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              placeholder="コメント..."
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
            <button
              onClick={() => onCommentSubmit(s?.id)}
              className="px-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors duration-200"
            >
              送信
            </button>
          </div>
        </div>
      </figcaption>
    </figure>
  )
}
