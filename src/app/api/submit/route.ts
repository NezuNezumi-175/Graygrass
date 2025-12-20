import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    if (!user) return Response.json({ ok: false }, { status: 401 })

    const { mediaUrl, mediaType } = await req.json()
    if (!mediaUrl) return Response.json({ ok: false, error: 'no mediaUrl' }, { status: 400 })

    const nowIso = new Date().toISOString()
    const { data: event } = await (await supabase)
        .from('events')
        .select('*')
        .lte('start_at', nowIso).gte('end_at', nowIso)
        .limit(1).single()

    if (!event) return Response.json({ ok: false, error: 'no event' }, { status: 403 })

    const { error } = await (await supabase)
        .from('submissions')
        .upsert({ user_id: user.id, event_id: event.id, media_url: mediaUrl, media_type: mediaType }, { onConflict: 'user_id,event_id' })

    if (error) return Response.json({ ok: false, error: error.message }, { status: 400 })
    return Response.json({ ok: true })
}