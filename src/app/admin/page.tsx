'use client'
import { useState, useEffect } from 'react'

export default function AdminPage() {
    const [msg, setMsg] = useState('')
    const [logs, setLogs] = useState<string[]>([])
    const [events, setEvents] = useState<any[]>([])

    async function createEvent() {
        const res = await fetch('/api/admin/create-event', { method: 'POST' })
        const json = await res.json()
        const m = json.ok ? `イベント開始: ${json.event?.title}` : json.error ?? '失敗'
        setMsg(m)
        setLogs(prev => [...prev, `[createEvent] ${m}`])
        fetchEvents()
    }

    async function pushNotify() {
        const res = await fetch('/api/admin/push-notify', { method: 'POST' })
        const json = await res.json()
        const m = json.ok ? `Push送信: ${json.count}件` : json.error ?? '失敗'
        setMsg(m)
        setLogs(prev => [...prev, `[pushNotify] ${m}`])
    }

    async function fetchEvents() {
        try {
            const res = await fetch('/api/admin/list-events')
            const json = await res.json()
            if (json.ok) {
                setEvents(json.events)
                setLogs(prev => [...prev, `[fetchEvents] ${json.count}件取得 (処理時間: ${json.duration}ms)`])
            } else {
                setLogs(prev => [...prev, `[fetchEvents] エラー: ${json.error}`])
            }
        } catch (err) {
            setLogs(prev => [...prev, `[fetchEvents] fetch エラー: ${err}`])
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-center">管理者ページ</h2>

            <div className="flex gap-2 justify-center">
                <button className="btn" onClick={createEvent}>イベント開始（24h）</button>
                <button className="btn" onClick={pushNotify}>Push通知送信</button>
                <button className="btn" onClick={fetchEvents}>イベント一覧更新</button>
            </div>

            <p className="text-center">{msg}</p>

            <section className="mt-4">
                <h3 className="font-bold">最近のイベント</h3>
                <ul className="list-disc list-inside">
                    {events.map(e => (
                        <li key={e.id}>
                            {e.title} ({new Date(e.start_at).toLocaleString()})
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mt-4">
                <h3 className="font-bold">ログ</h3>
                <div className="bg-gray-100 p-2 rounded max-h-60 overflow-y-auto text-xs">
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
            </section>
        </div>
    )
}
