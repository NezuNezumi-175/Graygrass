import { createClient } from '@/lib/supabase/server'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random' | 'reactions'

type Submission = {
  id: string
  user_id: string
  photo_url: string
  created_at: string
  key?: string
}

async function getSortedSubmissions(eventId: string | null, sortType: SortType): Promise<Submission[] | null> {
  const supabase = await createClient()

  // submissions と reactions を結合してリアクション数を取得
  let query = supabase
    .from('submissions')
    .select('id, user_id, photo_url, created_at, reactions(id)') // reactions 配列を取得

  if (eventId) {
    query = query.eq('event_id', eventId)
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
      // 元の空処理のまま
      break
  }

  console.log('[sort_feed] sortType:', sortType)
  console.log('[sort_feed] submissions:', filtered.map(s => s.photo_url))

  return filtered
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId') // optional
  const sortType = (searchParams.get('sort_type') as SortType) || 'newest'

  const submissions = await getSortedSubmissions(eventId, sortType)

  if (!submissions) {
    return Response.json({ ok: false, error: 'Failed to fetch submissions' }, { status: 500 })
  }

  return Response.json({
    ok: true,
    count: submissions.length,
    sort_type: sortType,
    submissions,
  })
}
