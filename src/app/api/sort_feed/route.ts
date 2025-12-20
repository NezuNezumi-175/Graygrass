import { createClient } from '@/lib/supabase/server'
// ソートタイプの定義
type SortType = 'newest' | 'oldest' | 'user_name' | 'random' | 'reactions'

/**
 * フィードの投稿をサーバー側で並び替えて返す関数
 * @param eventId イベント ID
 * @param sortType ソート条件
 */
async function getSortedSubmissions(eventId: string, sortType: SortType) {
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
            break
        case 'random':
            break
        case 'reactions':
            break
        default:
            query = query.order('created_at', { ascending: false })
    }

    const { data: submissions, error } = await query

    if (error) {
        console.error('getSortedSubmissions error:', error)
        return null
    }

    let filtered = submissions || []

    // ランダムソートをサーバー側で実行
    if (sortType === 'random') {
        return filtered.sort(() => Math.random() - 0.5)
    }
    // reaction_count ソートをサーバー側で実行
    // reaction ソートをサーバー側で実行
    else if (sortType === 'reactions') {

        const submissionIds = filtered.map(s => s.id)

        if (submissionIds.length === 0) return filtered

        // reactions をまとめて取得（group 不使用）
        const { data: reactions, error } = await (await supabase)
            .from('reactions')
            .select('be_reacted_id')
            .in('be_reacted_id', submissionIds)

        if (error) {
            console.error('reaction fetch error:', error)
            return filtered
        }

        // JS 側で集計
        const reactionCountMap = new Map<string, number>()

        for (const r of reactions ?? []) {
            const id = r.be_reacted_id
            reactionCountMap.set(id, (reactionCountMap.get(id) ?? 0) + 1)
        }

        // reaction_count を付与してソート
        return filtered
            .map(sub => ({
                ...sub,
                reaction_count: reactionCountMap.get(sub.id) ?? 0
            }))
            .sort((a, b) => b.reaction_count - a.reaction_count)
    } else if (sortType === 'user_name') {
        return filtered.sort((a, b) => {
            const nameA = a.profiles?.[0]?.name ?? ''
            const nameB = b.profiles?.[0]?.name ?? ''
            return nameA.localeCompare(nameB, 'ja')
        })
    }


    return filtered
}

export async function SortResult_GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const sortType = (searchParams.get('sort_type') as SortType) || 'newest'

    if (!eventId) {
        return Response.json({ ok: false, error: 'eventId is required' }, { status: 400 })
    }

    const validSortTypes: SortType[] = ['newest', 'oldest', 'user_name', 'random', 'reactions']

    if (!validSortTypes.includes(sortType)) {
        return Response.json(
            { ok: false, error: `sort_type must be one of: ${validSortTypes.join(', ')}` },
            { status: 400 }
        )
    }

    const submissions = await getSortedSubmissions(eventId, sortType)

    if (submissions === null) {
        return Response.json({ ok: false, error: 'Failed to fetch submissions' }, { status: 500 })
    }

    return Response.json({
        ok: true,
        count: submissions.length,
        sort_type: sortType,
        submissions,
    })
}