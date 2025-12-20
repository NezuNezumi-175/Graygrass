'use client'

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import CommentBox from "./CommentBox"

type Props = {
    s: any
}

export default function SubmissionCard({ s }: Props) {
    const url = s.photo_url
    const isVideo = url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.includes('video')
    const supabase = createClient()
    const [likeCount, setLikeCount] = useState(0);
    supabase.from("reactions").select("*").eq("post_id", s.id).then(({ data }) => {
        setLikeCount(data?.length || 0);
    })
    const [userId, setUserId] = useState<string | null>(null)
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState(s.comments || []);
    supabase.from("comments").select("*").eq("post_id", s.id).then(({ data }) => {
        setComments(data || []);
    })

    // リアクション追加（/api/reactions POST に対応）
    const onReaction = async (submissionId: string, type: string) => {
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
        } catch (err) {
            console.error('Reaction error:', err)
        }
    }

    // コメント送信（/api/comments POST に対応）
    const onCommentSubmit = async (submissionId: string) => {
        if (!commentInput) return

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentInput, user_id: userId, post_id: submissionId }),
            })
            if (!res.ok) {
                console.error('Comment POST failed:', await res.text())
                return
            }

            setCommentInput('');
        } catch (err) {
            console.error('Comment submit error:', err)
        }
    }


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
                        onClick={() => onReaction(s.id, 'like')}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                        👍 {likeCount}
                    </button>
                </div>

                {/* コメント */}
                <div className="space-y-1">
                    {(comments ?? []).map((data: {
                        "id": string
                        "user_id": string
                        "post_id": string
                        "content": string
                        "created_at": string
                    }) => (
                        <CommentBox key={data?.id} {...data} />
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
                            onClick={() => onCommentSubmit(s.id)}
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
