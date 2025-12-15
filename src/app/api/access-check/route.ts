import { supabaseServer } from '@/lib/supabase'

export async function GET() {
    const supabase = supabaseServer()
    const nowIso = new Date().toISOString()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ allowed: false })

    const { data: event } = await supabase
        .from('events')
        .select('*')
        .lte('start_at', nowIso).gte('end_at', nowIso)
        .order('start_at', { ascending: false })
        .limit(1).single()

    if (!event) return Response.json({ allowed: false })

    const { data: submission } = await supabase
        .from('submissions')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', event.id)
        .maybeSingle()

    return Response.json({ allowed: !!submission })
}
