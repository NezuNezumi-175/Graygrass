import { createClient } from '@/lib/supabase/client'

type SortType = 'newest' | 'oldest' | 'user_name' | 'random'

// 投稿の型
type Submission = {
  id: string
  photo_url: string
  created_at: string
}

export async function fetchCurrentUserId(): Promise<string> {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (userData?.user?.id) {
    return userData.user.id
  } else {
    return '' // 未ログイン時は空文字
  }
}

export async function fetchSortedSubmissions(sortType: SortType): Promise<Submission[]> {
  const supabase = createClient()

  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('id, photo_url, created_at')

  if (error) {
    console.error('[fetchSortedSubmissions] fetch error:', error)
    return []
  }

  if (!submissions) return []

  let sorted = [...submissions]

  switch (sortType) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'oldest':
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      break
    case 'user_name':
      // user_name ソートは profiles 情報が必要
      // ここでは一旦無視してそのまま返す
      break
    case 'random':
      sorted.sort(() => Math.random() - 0.5)
      break
  }

  console.log('[fetchSortedSubmissions] sortType:', sortType)
  console.log('[fetchSortedSubmissions] sorted submissions:', sorted.map(s => s.photo_url))

  return sorted
}
