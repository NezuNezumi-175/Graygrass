import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
    const supabase = supabaseServer()
    const body = await req.json()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ ok: false }, { status: 401 })

    const { error } = await supabase.from('push_subscriptions').insert({
        user_id: user.id,
        endpoint: body.endpoint,
        p256dh: body.keys?.p256dh,
        auth: body.keys?.auth,
    })
    if (error) return Response.json({ ok: false, error: error.message }, { status: 400 })
    return Response.json({ ok: true })
}