'use client'

import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useEffect, useState } from "react"
import CommentBox from "./CommentBox"

type SubmissionProps =
    {
        id: string
        user_id: string
        photo_url: string
        created_at: string
        comments?: any[]
    }


export default function SubmissionCard(s: SubmissionProps) {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [likeCount, setLikeCount] = useState(0)
    const [comments, setComments] = useState(s?.comments || [])
    const [userId, setUserId] = useState<string | null>(null)
    const [commentInput, setCommentInput] = useState("")

    const url = s?.photo_url
    const isVideo = url?.endsWith(".mp4") || url?.endsWith(".mov") || url?.includes("video")

    // 現在ログイン中ユーザー取得
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))
    }, [])

    // 投稿の user 情報取得
    useEffect(() => {
        if (!s?.user_id) return; // user_id が未定義なら fetch しない
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
            if (!res.ok) {
                console.error("Reaction POST failed:", await res.text())
                return
            }
            setLikeCount(prev => prev + 1)
        } catch (err) {
            console.error("Reaction error:", err)
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
            if (!json.ok) return console.error("Comment POST failed")

            setCommentInput("")
            setComments(prev => [...prev, { ...json.comment, user: json.user }])
        } catch (err) {
            console.error("Comment submit error:", err)
        }
    }

    return (
        <figure key={s?.id} className="border rounded overflow-hidden">
            {isVideo ? (
                <video src={url} controls className="w-full aspect-square object-cover bg-black" />
            ) : (
                <img src={url} alt="投稿" className="w-full aspect-square object-cover" />
            )}
            <figcaption className="p-2 text-sm space-y-2">
                <div className="flex items-start gap-3 p-2">
                    {/* avatar */}
                    <Link href={`/user/${user?.id}`}>
                        <img
                            src={user?.avatar_url}
                            alt={user?.name ?? "avatar"}
                            className="w-10 h-10 rounded-full object-cover"
                            loading="lazy"
                        />
                    </Link>
                    {/* content */}
                    <div className="flex-1">
                        {/* header: name left, date right */}
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900">{user?.name ?? "Unknown"}</p>
                            <span className="text-xs text-gray-500">{new Date(s?.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* リアクション */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onReaction(s?.id, "like")}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                        👍 {likeCount}
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
                            className="flex-1 border rounded px-1 text-sm"
                        />
                        <button
                            onClick={() => onCommentSubmit(s?.id)}
                            className="px-2 bg-green-500 text-white rounded text-sm"
                        >
                            送信
                        </button>
                    </div>
                </div>
            </figcaption>
        </figure>
    )
}
