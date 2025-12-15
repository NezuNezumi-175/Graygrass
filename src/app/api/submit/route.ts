import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ ok: false }, { status: 401 })

    const { photoUrl } = await req.json()
    if (!photoUrl) return Response.json({ ok: false, error: 'no photoUrl' }, { status: 400 })

    const nowIso = new Date().toISOString()
    const { data: event } = await supabase
        .from('events')
        .select('*')
        .lte('start_at', nowIso).gte('end_at', nowIso)
        .limit(1).single()

    if (!event) return Response.json({ ok: false, error: 'no event' }, { status: 403 })

    const { error } = await supabase
        .from('submissions')
        .upsert({ user_id: user.id, event_id: event.id, photo_url: photoUrl }, { onConflict: 'user_id,event_id' })

    if (error) return Response.json({ ok: false, error: error.message }, { status: 400 })
    return Response.json({ ok: true })
}