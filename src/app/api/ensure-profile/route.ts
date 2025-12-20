import { createClient } from '@/lib/supabase/server'

export async function POST() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ ok: false }, { status: 401 })

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: user.email ?? null,
            name: (user.user_metadata as any)?.name ?? null,
        }, { onConflict: 'id' })

    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
    return Response.json({ ok: true })
}