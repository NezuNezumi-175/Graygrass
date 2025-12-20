import { createClient } from '@/lib/supabase/server'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random'
type MediaFilter = 'all' | 'image' | 'video'

/**
 * フィードの投稿をサーバー側で並び替えて返す関数
 * @param eventId イベント ID
 * @param sortType ソート条件
 * @param mediaFilter メディアフィルタ
 *   - 'all': すべて
 *   - 'image': 画像のみ
 *   - 'video': 動画のみ
 */
async function getSortedSubmissions(eventId: string, sortType: SortType, mediaFilter: MediaFilter) {
    const supabase = createClient()

    let query = (await supabase)
        .from('submissions')
        .select('id, photo_url, media_url, media_type, created_at, user_id, profiles(id, name, email)')
        .eq('event_id', eventId)

    // ソート条件を適用
    switch (sortType) {
        case 'newest':
            query = query.order('created_at', { ascending: false })
            break
        case 'oldest':
            query = query.order('created_at', { ascending: true })
            break
        case 'user_name':
            query = query.order('user_id', { ascending: true })
            break
        case 'random':
            query = query.order('id', { ascending: true })
            break
        default:
            query = query.order('created_at', { ascending: false })
    }

    const { data: submissions, error } = await query

    if (error) {
        console.error('getSortedSubmissions error:', error)
        return null
    }

    // メディアフィルタを適用
    let filtered = submissions || []
    if (mediaFilter === 'image') {
        filtered = filtered.filter(s => {
            const type = (s.media_type || '').toLowerCase()
            // media_type が image で始まる、またはmedia_url が null（photo_url のみ）
            return type.startsWith('image/') || (!s.media_type && s.photo_url)
        })
    } else if (mediaFilter === 'video') {
        filtered = filtered.filter(s => {
            const type = (s.media_type || '').toLowerCase()
            return type.startsWith('video/')
        })
    }

    // ランダムソートをサーバー側で実行
    if (sortType === 'random') {
        return filtered.sort(() => Math.random() - 0.5)
    }

    return filtered
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const sortType = (searchParams.get('sort_type') as SortType) || 'newest'
    const mediaFilter = (searchParams.get('media_filter') as MediaFilter) || 'all'

    if (!eventId) {
        return Response.json({ ok: false, error: 'eventId is required' }, { status: 400 })
    }

    const validSortTypes: SortType[] = ['newest', 'oldest', 'user_name', 'random']
    if (!validSortTypes.includes(sortType)) {
        return Response.json(
            { ok: false, error: `sort_type must be one of: ${validSortTypes.join(', ')}` },
            { status: 400 }
        )
    }

    const validMediaFilters: MediaFilter[] = ['all', 'image', 'video']
    if (!validMediaFilters.includes(mediaFilter)) {
        return Response.json(
            { ok: false, error: `media_filter must be one of: ${validMediaFilters.join(', ')}` },
            { status: 400 }
        )
    }

    const submissions = await getSortedSubmissions(eventId, sortType, mediaFilter)

    if (submissions === null) {
        return Response.json({ ok: false, error: 'Failed to fetch submissions' }, { status: 500 })
    }

    return Response.json({
        ok: true,
        count: submissions.length,
        sort_type: sortType,
        media_filter: mediaFilter,
        submissions,
    })
}
