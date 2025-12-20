import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { content, user_id, post_id } = await req.json()

    if (!content || !user_id || !post_id) {
      return Response.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('comments')
      .insert([{ content, user_id, post_id }])

    if (error) {
      console.error('Comment insert error:', error)
      return Response.json({ ok: false, error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true, comment: data?.[0] })
  } catch (err) {
    return Response.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
