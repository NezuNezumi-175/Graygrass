import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { content, user_id, post_id } = await req.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('comments')
      .insert([{ content, user_id, post_id }])

    if (error) {
      console.error('[comments] insert error:', error)
      return new Response(JSON.stringify({ ok: false, error }), { status: 400 })
    }

    return new Response(JSON.stringify({ ok: true, data }))
  } catch (err) {
    console.error('[comments] POST error:', err)
    return new Response(JSON.stringify({ ok: false, error: err }), { status: 500 })
  }
}
