'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function CapturePage() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    async function submit() {
        if (!file) return
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        console.log('Current user:', user)
        if (!user) { setLoading(false); return alert('ログインしてください') }

        // サイズ制限（例：10MB）
        if (file.size > 10 * 1024 * 1024) { setLoading(false); return alert('ファイルサイズが大きすぎます') }

        const path = `${user.id}/${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`
        const up = await supabase.storage.from('photos').upload(path, file, { contentType: file.type })
        console.log('Upload result:', JSON.stringify(up.error) ?? null)
        if (up.error) { setLoading(false); return alert(up.error.message) }
        console.log('File uploaded to path:', path)

        const { data: pub } = supabase.storage.from('photos').getPublicUrl(path)
        const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photoUrl: pub.publicUrl })
        })
        console.log('Submission response:', res)
        let err
        try {
            err = (await res?.json())?.error
        } catch (e) {
            err = "何か知らんけど失敗したのかも？" + e
            console.log(err)
        }

        setLoading(false)
        if (!res.ok) return alert(err ?? '投稿に失敗しました')
        location.href = '/feed'
    }

    return (
        <div className="p-6 space-y-4">
            <input type="file" accept="image/*" capture="environment" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <button className="btn" disabled={!file || loading} onClick={submit}>{loading ? '投稿中...' : '投稿する'}</button>
        </div>
    )
}
