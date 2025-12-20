import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { reaction, user_id, post_id } = await req.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('reactions')
      .insert([{ reaction, user_id, post_id }])

    if (error) {
      console.error('[reactions] insert error:', error)
      return new Response(JSON.stringify({ ok: false, error }), { status: 400 })
    }

    return new Response(JSON.stringify({ ok: true, data }))
  } catch (err) {
    console.error('[reactions] POST error:', err)
    return new Response(JSON.stringify({ ok: false, error: err }), { status: 500 })
  }
}
