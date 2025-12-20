import { createClient } from '@/lib/supabase/server'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random' | 'reactions'

type Submission = {
  id: string
  photo_url: string
  created_at: string
}

async function getSortedSubmissions(eventId: string | null, sortType: SortType) {
  const supabase = await createClient()

  let query = supabase.from('submissions').select('id, photo_url, created_at')

  if (eventId) {
    query = query.eq('event_id', eventId)
  }

  const { data: submissions, error } = await query

  if (error) {
    console.error('[sort_feed] fetch error:', error)
    return null
  }

  let filtered = submissions || []

  // ソート
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
    // user_name と reactions は未実装でも動くように空処理
    case 'user_name':
    case 'reactions':
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
