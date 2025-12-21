import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()
    const start = Date.now()

    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('start_at', { ascending: false })
        .limit(10)

    const duration = Date.now() - start

    if (error) {
        return Response.json({ ok: false, error: error.message, duration }, { status: 500 })
    }

    return Response.json({ ok: true, events, count: events.length, duration })
}
