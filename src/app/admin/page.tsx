'use client'
import { useState } from 'react'

export default function AdminPage() {
    const [msg, setMsg] = useState('')

    async function createEvent() {
        const res = await fetch('/api/admin/create-event', { method: 'POST' })
        const json = await res.json()
        setMsg(json.ok ? `イベント開始: ${json.event?.title}` : json.error ?? '失敗')
    }

    async function pushNotify() {
        const res = await fetch('/api/admin/push-notify', { method: 'POST' })
        const json = await res.json()
        setMsg(json.ok ? `Push送信: ${json.count}件` : json.error ?? '失敗')
    }

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">管理者ページ</h2>
            <button className="btn" onClick={createEvent}>イベント開始（24h）</button>
            <button className="btn" onClick={pushNotify}>Push通知送信</button>
            <p>{msg}</p>
        </div>
    )
}