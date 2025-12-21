import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') // 'recent', '1year', '4years'
  const limit = 3 // 表示数を3に固定

  const supabase = await createClient()
  const now = new Date()
  let gte: string | undefined
  let lt: string | undefined

  if (period === '1year') {
    const oneYearAgoStart = new Date()
    oneYearAgoStart.setFullYear(now.getFullYear() - 2)
    const oneYearAgoEnd = new Date()
    oneYearAgoEnd.setFullYear(now.getFullYear() - 1)
    gte = oneYearAgoStart.toISOString()
    lt = oneYearAgoEnd.toISOString()
  } else if (period === '4years') {
    const fourYearsAgoStart = new Date()
    fourYearsAgoStart.setFullYear(now.getFullYear() - 5)
    const fourYearsAgoEnd = new Date()
    fourYearsAgoEnd.setFullYear(now.getFullYear() - 4)
    gte = fourYearsAgoStart.toISOString()
    lt = fourYearsAgoEnd.toISOString()
  } else {
    // period が指定されていないか recent の場合は最近の投稿を取得
    gte = undefined
    lt = undefined
  }

  let query = supabase
    .from('submissions')
    .select('id, photo_url, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (gte) query = query.gte('created_at', gte)
  if (lt) query = query.lt('created_at', lt)

  const { data, error } = await query
  if (error) return Response.json({ ok: false, error }, { status: 500 })

  return Response.json({ ok: true, submissions: data })
}
