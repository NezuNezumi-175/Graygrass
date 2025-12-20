'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  targetUserId: string
  currentUserId: string
  initialIsFollowing: boolean
}

export default function FollowButton({
  targetUserId,
  currentUserId,
  initialIsFollowing,
}: Props) {
  const supabase = createClient()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  async function toggleFollow() {
    if (loading) return
    setLoading(true)

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('follow_id', targetUserId)

      setIsFollowing(false)
    } else {
      await supabase
        .from('follows')
        .insert({
          follower_id: currentUserId,
          follow_id: targetUserId,
        })

      setIsFollowing(true)
    }

    setLoading(false)
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-full text-sm font-bold transition
  ${isFollowing
    ? 'border border-gray-400 text-gray-600 hover:bg-gray-200 hover:text-gray-700'
    : 'bg-gray-400 text-gray-800 hover:bg-gray-500 hover:text-gray-900'}
`}
    >
      {isFollowing ? 'フォロー中' : 'フォローする'}
    </button>
  )
}
