import { supabaseServer } from '@/lib/supabase'

export default async function FeedPage() {
    const supabase = supabaseServer()
    const nowIso = new Date().toISOString()

    const { data: event } = await supabase
        .from('events')
        .select('*')
        .lte('start_at', nowIso).gte('end_at', nowIso)
        .order('start_at', { ascending: false })
        .limit(1).single()

    if (!event) return <div className="p-6">イベント外です。次の通知をお待ちください。</div>

    const { data: submissions } = await supabase
        .from('submissions')
        .select('id, photo_url, created_at, user_id')
        .eq('event_id', event.id)
        .order('created_at', { ascending: true })

    return (
        <main className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {submissions?.map((s: any) => (
                <figure key={s.id} className="rounded-lg overflow-hidden border">
                    <img src={s.photo_url} alt="投稿" className="w-full aspect-square object-cover" />
                    <figcaption className="p-2 text-sm">
                        {new Date(s.created_at).toLocaleString()}
                    </figcaption>
                </figure>
            ))}
        </main>
    )
}