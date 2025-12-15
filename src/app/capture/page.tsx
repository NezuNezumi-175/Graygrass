'use client'
import { supabaseBrowser } from '@/lib/supabase'
import { useState } from 'react'

export default function CapturePage() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const supabase = supabaseBrowser()

    async function submit() {
        if (!file) return
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return alert('ログインしてください') }

        // サイズ制限（例：10MB）
        if (file.size > 10 * 1024 * 1024) { setLoading(false); return alert('ファイルサイズが大きすぎます') }

        const path = `${user.id}/${Date.now()}_${file.name}`
        const up = await supabase.storage.from('photos').upload(path, file, { contentType: file.type })
        if (up.error) { setLoading(false); return alert(up.error.message) }

        const { data: pub } = supabase.storage.from('photos').getPublicUrl(path)
        const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photoUrl: pub.publicUrl })
        })
        const json = await res.json()

        setLoading(false)
        if (!json.ok) return alert(json.error ?? '投稿に失敗しました')
        location.href = '/feed'
    }

    return (
        <div className="p-6 space-y-4">
            <input type="file" accept="image/*" capture="environment" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <button className="btn" disabled={!file || loading} onClick={submit}>{loading ? '投稿中...' : '投稿する'}</button>
        </div>
    )
}
