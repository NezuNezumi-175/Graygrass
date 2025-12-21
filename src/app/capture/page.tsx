'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function CapturePage() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [inputKey, setInputKey] = useState(0)
    const supabase = createClient()

    const previewUrl = file ? URL.createObjectURL(file) : null

    async function submit() {
        if (!file) return
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setLoading(false)
            return alert('ログインしてください')
        }

        if (file.size > 10 * 1024 * 1024) {
            setLoading(false)
            return alert('ファイルサイズが大きすぎます')
        }

        const path = `${user.id}/${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`

        const up = await supabase
            .storage
            .from('photos')
            .upload(path, file, { contentType: file.type })

        if (up.error) {
            setLoading(false)
            return alert(up.error.message)
        }

        const { data: pub } = supabase
            .storage
            .from('photos')
            .getPublicUrl(path)

        const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mediaUrl: pub.publicUrl,
                mediaType: file.type
            })
        })

        setLoading(false)
        if (!res.ok) return alert('投稿に失敗しました')

        location.href = '/feed'
    }

    return (
        <div className="p-6 space-y-4">

            {/* ファイル選択・削除ボタン */}
            <div className="flex items-center justify-center gap-3">

                {/* ファイル選択 / 変更 */}
                <label
                    className={`inline-flex items-center justify-center
                    w-32 h-10 border rounded-full cursor-pointer
                    transition active:scale-95
                    ${file ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                >
                    <span className="text-sm font-medium">
                        {file ? '変更' : '選択'}
                    </span>

                    <input
                        key={inputKey}
                        type="file"
                        accept="image/*,video/*"
                        capture="environment"
                        className="hidden"
                        onChange={e => setFile(e.target.files?.[0] ?? null)}
                    />
                </label>

                {/* 削除ボタン */}
                {file && (
                    <button
                        type="button"
                        onClick={() => {
                            setFile(null)
                            setInputKey(k => k + 1)
                        }}
                        className="inline-flex items-center justify-center
                                   w-10 h-10 border rounded-full
                                   text-gray-600 hover:bg-gray-400 hover:text-black
                                   transition active:scale-95"
                        aria-label="ファイル削除"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* ファイル名 */}
            {file && (
                <p className="text-lg font-bold text-gray-800 text-center truncate">
                    {file.name}
                </p>
            )}

            {/* プレビュー（中央寄せ・サイズ拡大） */}
            {file && previewUrl && (
                <div className="flex justify-center">
                    <div className="overflow-hidden">
                        {file.type.startsWith('image/') && (
                            <img
                                src={previewUrl}
                                alt="preview"
                                className="block max-h-[520px] max-w-[520px] object-contain"
                            />
                        )}
                        {file.type.startsWith('video/') && (
                            <video
                                src={previewUrl}
                                controls
                                className="block max-h-[520px] max-w-[520px]"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* 投稿ボタン */}
            <button
                className="btn w-full"
                disabled={!file || loading}
                onClick={submit}
            >
                {loading ? '投稿中...' : '投稿する'}
            </button>
        </div>
    )
}
