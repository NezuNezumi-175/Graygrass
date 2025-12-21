"use client";

export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import FollowButton from './FollowButton'

type Props = {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: Props) {
  const supabase = await createClient()
  const id = (await params).id

  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (!user || !currentUser) return null

  const isMyPage = currentUser.id === user.id

  let isFollowing = false
  if (!isMyPage) {
    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('follow_id', user.id)
      .single()

    isFollowing = !!data
  }

  return (
    <div className="relative p-6">
      {/* ★ フォローボタン（自分以外のみ） */}
      {!isMyPage && (
        <div className="absolute top-6 right-6">
          <FollowButton
            targetUserId={user.id}
            currentUserId={currentUser.id}
            initialIsFollowing={isFollowing}
          />
        </div>
      )}

      {/* ★ アイコン + 名前 */}
      <div className="flex items-start gap-4">
        <img
          src={user.avatar_url ?? '/default.png'}
          className="w-24 h-24 rounded-full object-cover"
        />

        {/* 名前をアイコン右下寄りに */}
        <h1 className="text-5xl font-bold mt-10">
          {user.name}
        </h1>
      </div>

      {/* 自己紹介 */}
      <p className="mt-6 whitespace-pre-wrap">
        {user.bio}
      </p>

      {/* 自分のときだけ編集リンク */}
      {isMyPage && (
        <Link
          href="/mypage/edit"
          className="inline-block mt-6 text-blue-500"
        >
          プロフィールを編集する
        </Link>
      )}
    </div>
  )
}
