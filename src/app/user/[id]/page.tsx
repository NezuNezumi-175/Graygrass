export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function UserPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user){
    alert("なんじゃそのユーザー。ワイは知らへんで！")
    return
  }

  const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">My Page</h1>

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
      <Link
        href="/mypage/edit"
        className="inline-block mt-6 text-blue-500"
      >
        プロフィールを編集する
      </Link>
    </div>
  )
}
