import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    console.log('submit: current user:', user?.id)
    if (!user) return Response.json({ ok: false }, { status: 401 })

    let body: any
    try {
        body = await req.json()
    } catch (e) {
        console.error('submit: failed to parse body', e)
        return Response.json({ ok: false, error: 'invalid json' }, { status: 400 })
    }
    console.log('submit: body', body)

    const { mediaUrl, mediaType } = body
    if (!mediaUrl) {
        console.error('submit: no mediaUrl in body')
        return Response.json({ ok: false, error: 'no mediaUrl' }, { status: 400 })
    }

    const nowIso = new Date().toISOString()
    const { data: event, error: eventErr } = await (await supabase)
        .from('events')
        .select('*')
        .lte('start_at', nowIso).gte('end_at', nowIso)
        .limit(1).single()

    if (eventErr) {
        console.error('submit: event query error', eventErr)
        return Response.json({ ok: false, error: eventErr.message }, { status: 500 })
    }

    if (!event) {
        console.error('submit: no active event')
        return Response.json({ ok: false, error: 'no event' }, { status: 403 })
    }

    let upData: any = null
    let upErr: any = null
    try {
        const r = await (await supabase)
            .from('submissions')
            .upsert({ user_id: user.id, event_id: event.id, media_url: mediaUrl, media_type: mediaType }, { onConflict: 'user_id,event_id' })
        upData = r.data
        upErr = r.error
    } catch (e) {
        upErr = e
    }

    console.log('submit: upsert result', { upData, upErr })

    if (upErr) {
        const msg = (upErr && upErr.message) || String(upErr)
        // Fallback: if media_type column not found, try using photo_url instead
        if (/media_type|media_url|column .* does not exist/i.test(msg)) {
            console.warn('submit: schema missing, falling back to photo_url upsert')
            try {
                const r2 = await (await supabase)
                    .from('submissions')
                    .upsert({ user_id: user.id, event_id: event.id, photo_url: mediaUrl }, { onConflict: 'user_id,event_id' })
                if (r2.error) {
                    console.error('submit: fallback upsert error', r2.error)
                    return Response.json({ ok: false, error: r2.error.message }, { status: 400 })
                }
                return Response.json({ ok: true, fallback: true })
            } catch (e2) {
                console.error('submit: fallback exception', e2)
                return Response.json({ ok: false, error: String(e2) }, { status: 500 })
            }
        }

        console.error('submit: upsert error', upErr)
        return Response.json({ ok: false, error: msg }, { status: 400 })
    }

    return Response.json({ ok: true })
}
