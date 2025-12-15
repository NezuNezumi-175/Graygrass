import { supabaseServer } from '@/lib/supabase-server'

export async function POST() {
    const supabase = supabaseServer()
    const start = new Date()
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)

    const { data: event, error } = await supabase
        .from('events')
        .insert({
            title: `四年に一度 ${start.getFullYear()}`,
            start_at: start.toISOString(),
            end_at: end.toISOString(),
            generation: 1
        })
        .select('*').single()

    if (error) return Response.json({ ok: false, error: error.message }, { status: 400 })
    return Response.json({ ok: true, event })
}