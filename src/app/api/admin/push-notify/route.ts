import { supabaseServer } from '@/lib/supabase'
import webpush from 'web-push'

webpush.setVapidDetails('mailto:admin@example.com', process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!)

export async function POST() {
    const supabase = supabaseServer()
    const { data: subs } = await supabase.from('push_subscriptions').select('endpoint,p256dh,auth')
    if (!subs?.length) return Response.json({ ok: true, count: 0 })

    const payload = JSON.stringify({ title: '四年に一度が始まった！', body: '24時間以内に撮影してください' })

    await Promise.all(subs.map(s =>
        webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload
        ).catch(() => null)
    ))
    return Response.json({ ok: true, count: subs.length })
}