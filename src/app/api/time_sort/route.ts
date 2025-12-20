import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') // '1year' or '4years'
  const limit = parseInt(searchParams.get('limit') || '2', 10)

  const supabase = await createClient()
  const now = new Date()
  let gte: string
  let lt: string | undefined

  if (period === '1year') {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(now.getFullYear() - 1)
    gte = oneYearAgo.toISOString()
  } else if (period === '4years') {
    const fourYearsAgoStart = new Date()
    fourYearsAgoStart.setFullYear(now.getFullYear() - 4)
    const fourYearsAgoEnd = new Date()
    fourYearsAgoEnd.setFullYear(now.getFullYear() - 3)
    gte = fourYearsAgoStart.toISOString()
    lt = fourYearsAgoEnd.toISOString()
  } else {
    return Response.json({ ok: false, error: 'invalid period' }, { status: 400 })
  }

  let query = supabase
    .from('submissions')
    .select('id, photo_url, created_at')
    .gte('created_at', gte)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (lt) query = query.lt('created_at', lt)

  const { data, error } = await query
  if (error) return Response.json({ ok: false, error }, { status: 500 })

  return Response.json({ ok: true, submissions: data })
}
