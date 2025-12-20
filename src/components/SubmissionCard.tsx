'use client'

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

type Props = {
    s: any
    commentValue: string
    onCommentChange: (submissionId: string, value: string) => void
    onCommentSubmit: (submissionId: string) => void
    onReaction: (submissionId: string, type: string) => void
}

export default function SubmissionCard({ s, commentValue, onCommentChange, onCommentSubmit, onReaction }: Props) {
    const url = s.photo_url
    const isVideo = url?.endsWith('.mp4') || url?.endsWith('.mov') || url?.includes('video')
    const supabase = createClient()
    const [likeCount, setLikeCount] = useState(0);
    supabase.from("reactions").select("*").eq("post_id", s.id).then(({ data }) => {
        setLikeCount(data?.length || 0);
    })

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
                    {(s.comments ?? []).map((c: any, idx: number) => (
                        <div key={idx} className="text-xs bg-gray-100 p-1 rounded">
                            <span className="font-semibold">{c.user_id}</span>: {c.content}
                        </div>
                    ))}
                    <div className="flex gap-1 mt-1">
                        <input
                            type="text"
                            placeholder="コメント..."
                            value={commentValue}
                            onChange={e => onCommentChange(s.id, e.target.value)}
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
