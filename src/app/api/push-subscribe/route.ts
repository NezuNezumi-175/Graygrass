import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    console.log('Received push subscription request')
    const body = await req.json()
    console.log('Push subscription body:', body)

    // Authorization ヘッダーがあればそれを使って Supabase クライアントを作成
    // const authHeader = req.headers.get('authorization') ?? ''
    const supabase = await createClient()
    // if (authHeader.startsWith('Bearer ')) {
    //     const token = authHeader.split(' ')[1]
    //     supabase = createClient(
    //         process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //         { global: { headers: { Authorization: `Bearer ${token}` } } }
    //     )
    // }

    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('Authenticated user:', user, error)
    if (!user) return Response.json({ ok: false }, { status: 401 })

    // Ensure profile exists (upsert own profile)
    const { error: profileErr } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email ?? null,
        name: (user.user_metadata as any)?.name ?? null,
    }, { onConflict: 'id' })
    if (profileErr) {
        console.error('Profile upsert error:', profileErr)
        return Response.json({ ok: false, error: profileErr.message }, { status: 500 })
    }

    // Insert or update subscription (endpoint is unique)
    console.log({
        user_id: user.id,
        endpoint: body.endpoint,
        p256dh: body.keys?.p256dh,
        auth: body.keys?.auth,
    })
    const { error: insertErr } = await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: body.endpoint,
        p256dh: body.keys?.p256dh,
        auth: body.keys?.auth,
    }, { onConflict: 'endpoint' })
    if (insertErr) {
        console.log('Insert push subscription result:', insertErr)
        return Response.json({ ok: false, error: insertErr.message }, { status: 400 })
    }
    return Response.json({ ok: true })
}