import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { content, user_id, post_id } = await req.json()
    const supabase = await createClient()

    // コメント追加
    const { data: commentData, error: insertError } = await supabase
      .from('comments')
      .insert([{ content, user_id, post_id }])
      .select()
      .single()

    if (insertError) {
      console.error('[comments] insert error:', insertError)
      return new Response(JSON.stringify({ ok: false, error: insertError }), { status: 400 })
    }

    // コメント投稿者の user 情報を取得
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()

    if (userError) console.error('[comments] fetch user error:', userError)

    return new Response(JSON.stringify({ ok: true, comment: commentData, user: userData ?? null }))
  } catch (err) {
    console.error('[comments] POST error:', err)
    return new Response(JSON.stringify({ ok: false, error: err }), { status: 500 })
  }
}
