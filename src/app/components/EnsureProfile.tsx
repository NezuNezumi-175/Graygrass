'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * ログイン済みユーザーで
 * profiles が未作成の場合は /mypage/edit に強制遷移させる
 */
export default function EnsureProfile() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [checked, setChecked] = useState(false)

  useEffect(() => {
    ;(async () => {
      // ログイン不要ページはスキップ
      if (
        pathname === '/login' ||
        pathname === '/locked'
      ) {
        setChecked(true)
        return
      }

      // ログインユーザー取得
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // 未ログイン → locked へ
        router.replace('/locked')
        return
      }

      // profiles チェック
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        // プロフィール未作成 → edit へ
        router.replace('/mypage/edit')
        return
      }

      setChecked(true)
    })()
  }, [pathname, router, supabase])

  // チェック完了まで何も描画しない（チラつき防止）
  if (!checked) return null

  return null
}
