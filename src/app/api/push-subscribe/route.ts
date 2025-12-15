import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
    console.log('Received push subscription request')
    const supabase = supabaseServer()
    const body = await req.json()
    console.log('Push subscription body:', body)
    const { data: { user }, error: err } = await supabase.auth.getUser()
    console.log('Authenticated user:', user)
    console.log(err)
    if (!user) return Response.json({ ok: false }, { status: 401 })

    console.log('Storing push subscription for user', user.id, body)

    const { error } = await supabase.from('push_subscriptions').insert({
        user_id: user.id,
        endpoint: body.endpoint,
        p256dh: body.keys?.p256dh,
        auth: body.keys?.auth,
    })
    if (error) return Response.json({ ok: false, error: error.message }, { status: 400 })
    return Response.json({ ok: true })
}