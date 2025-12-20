export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: Props) {
  const supabase = await createClient()

  const id = (await params).id
  const { data: user } = await supabase.from('profiles').select('*').eq('id', id).single()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!user) {
    alert("なんじゃそのユーザー。ワイは知らへんで！")
    return
  }
  if (!currentUser) {
    alert("ログインせなあかんで！")
    return
  }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{user.name}</h1>

      {data ? (
        <>
          <img
            src={data.avatar_url ?? '/default.png'}
            className="w-24 h-24 rounded-full mt-4 object-cover"
          />

          <p className="mt-4 whitespace-pre-wrap">
            {data.bio}
          </p>
        </>
      ) : (
        <p className="mt-4 text-gray-500">
          プロフィールはまだ作成されていません
        </p>
      )}

      {/* ★ 常に表示（UX重視） */}
      {(currentUser?.id === user.id) ? (<Link
        href="/mypage/edit"
        className="inline-block mt-6 text-blue-500"
      >
        プロフィールを編集する
      </Link>) : <></>}
    </div>
  )
}
