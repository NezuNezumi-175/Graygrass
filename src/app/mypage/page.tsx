import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MyPage() {
  const supabase = await createClient()

  // ログインユーザー取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ★ profiles を確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  // ★ プロフィールが無ければ作成（名前は空でもOK）
  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      name: '',
      bio: '',
      avatar_url: null,
      updated_at: new Date(),
    })
  }

  // ★ userページへ
  redirect(`/user/${user.id}`)
}
