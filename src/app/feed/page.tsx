import { createClient } from '@/lib/supabase/server'

export default async function FeedPage() {
    const supabase = await createClient()
    const nowIso = new Date().toISOString()

    const { data: event } = await (supabase)
        .from('events')
        .select('*')
        .lte('start_at', nowIso).gte('end_at', nowIso)
        .order('start_at', { ascending: false })
        .limit(1).single()

    if (!event) return <div className="p-6">イベント外です。次の通知をお待ちください。</div>
    console.log('Current event:', event)

    const { data: submissions } = await supabase
        .from('submissions')
        .select('id, photo_url, created_at, user_id')
        .order('created_at', { ascending: true })


    console.log('Submissions:', submissions)

    return (
        <main className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {submissions?.map((s: any) => {
                const url = s.photo_url
                const isVideo =
                    url?.endsWith('.mp4') ||
                    url?.endsWith('.mov') ||
                    url?.includes('video')

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