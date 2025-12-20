import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { reaction, user_id, post_id } = await req.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('user_id', user_id)
      .eq('post_id', post_id)
      .eq('reaction', reaction)
      .maybeSingle()

    if (data) {
      // すでにリアクションがある場合は削除
      const { data: deleteData, error: deleteError } = await supabase
        .from('reactions')
        .delete()
        .eq('id', data.id)
      if (deleteError) {
        console.error('[reactions] delete error:', deleteError)
        return new Response(JSON.stringify({ ok: false, error: deleteError }), { status: 400 })
      }
    } else {
      const { data, error } = await supabase
        .from('reactions')
        .insert([{ reaction, user_id, post_id }])
      if (error) {
        console.error('[reactions] insert error:', error)
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 })
      }
    }

    return new Response(JSON.stringify({ ok: true, data }))
  } catch (err) {
    console.error('[reactions] POST error:', err)
    return new Response(JSON.stringify({ ok: false, error: err }), { status: 500 })
  }
}
