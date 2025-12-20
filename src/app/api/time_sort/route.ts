import { createClient } from '@/lib/supabase/server'

type Submission = {
  id: string
  photo_url: string
  created_at: string
}

async function getRecentSubmissions(eventId: string | null) {
  const supabase = await createClient()

  let query = supabase.from('submissions').select('id, photo_url, created_at')

  if (eventId) {
    query = query.eq('event_id', eventId)
  }

  // 1年以内の投稿だけを対象
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  query = query.gte('created_at', oneYearAgo.toISOString())

  const { data: submissions, error } = await query

  if (error) {
    console.error('[getRecentSubmissions] fetch error:', error)
    return null
  }

  // 新しい順にソートして上位2件だけ
  const recent = (submissions || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)

  return recent
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId') // optional

  const submissions = await getRecentSubmissions(eventId)

  if (!submissions) {
    return Response.json({ ok: false, error: 'Failed to fetch submissions' }, { status: 500 })
  }

  return Response.json({
    ok: true,
    count: submissions.length,
    submissions,
  })
}
