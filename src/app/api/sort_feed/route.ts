import { createClient } from '@/lib/supabase/server'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random' | 'reactions'

type Submission = {
  id: string
  user_id: string
  photo_url: string
  created_at: string
  key?: string
}

async function getSortedSubmissions(
  userId: string | null,
  eventId: string | null,
  sortType: SortType,
  filterFollowing: boolean
): Promise<Submission[] | null> {
  const supabase = await createClient()

  let query = supabase
    .from('submissions')
    .select('id, user_id, photo_url, created_at, reactions(id)') // reactions 配列を取得

  if (eventId) query = query.eq('event_id', eventId)

  // フォロー中ユーザーのみ絞る
  if (filterFollowing && userId) {
    const { data: follows, error: followError } = await supabase
      .from('follows')
      .select('follow_id')
      .eq('follower_id', userId)

    if (followError) {
      console.error('[sort_feed] follow fetch error:', followError)
      return null
    }

    const followIds = follows?.map(f => f.follow_id) || []

    // フォローしているユーザーがいなければ空配列
    if (followIds.length === 0) return []

    query = query.in('user_id', followIds)
  }

  const { data: submissions, error } = await query
  if (error) {
    console.error('[sort_feed] fetch error:', error)
    return null
  }

  let filtered = submissions || []

  // ソート処理
  switch (sortType) {
    case 'newest':
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'oldest':
      filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      break
    case 'random':
      filtered = filtered.sort(() => Math.random() - 0.5)
      break
    case 'reactions':
      filtered = filtered.sort((a, b) => (b.reactions?.length || 0) - (a.reactions?.length || 0))
      break
    case 'user_name':
      // 名前順でソートしたい場合はここで追加可能
      break
  }

  return filtered
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const eventId = searchParams.get('eventId')
  const sortType = (searchParams.get('sort_type') as SortType) || 'newest'
  const filterFollowing = searchParams.get('filter_following') === 'true' // ON/OFF スイッチ

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id ?? null

  const submissions = await getSortedSubmissions(userId, eventId, sortType, filterFollowing)

  if (!submissions) {
    return Response.json({ ok: false, error: 'Failed to fetch submissions' }, { status: 500 })
  }

  return Response.json({
    ok: true,
    count: submissions.length,
    sort_type: sortType,
    filter_following: filterFollowing,
    submissions,
  })
}
