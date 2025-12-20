import { createClient } from '@/lib/supabase/server'

export default async function FeedPage() {
    const supabase = createClient()
    const nowIso = new Date().toISOString()

    const { data: event } = await (await supabase)
        .from('events')
        .select('*')
        .lte('start_at', nowIso).gte('end_at', nowIso)
        .order('start_at', { ascending: false })
        .limit(1).single()

    if (!event) return <div className="p-6">イベント外です。次の通知をお待ちください。</div>

    const { data: submissions } = await (await supabase)
        .from('submissions')
        .select('id, photo_url, media_url, media_type, created_at, user_id')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false })

    return (
        <main className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {submissions?.map((s: any) => {
                const url = s.media_url || s.photo_url
                const type = s.media_type || ''
                const isVideo = type.startsWith('video/')

                return (
                    <figure key={s.id} className="rounded-lg overflow-hidden border">
                        {isVideo ? (
                            <video src={url} controls className="w-full aspect-square object-cover bg-black" />
                        ) : (
                            <img src={url} alt="投稿" className="w-full aspect-square object-cover" />
                        )}
                        <figcaption className="p-2 text-sm">
                            {new Date(s.created_at).toLocaleString()}
                        </figcaption>
                    </figure>
                )
            })}
        </main>
    )
}