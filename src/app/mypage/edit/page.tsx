'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MyPageEdit() {
  const supabase = createClient()
  const router = useRouter()

  const [bio, setBio] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // プロフィール読み込み
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('bio')
        .eq('id', user.id)
        .single()

      if (data?.bio) setBio(data.bio)
    }
    load()
  }, [])

  async function saveProfile() {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    let avatar_url: string | undefined

    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}.${ext}`

      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (error) {
        setLoading(false)
        alert(error.message)
        return
      }

      avatar_url = supabase.storage
        .from('avatars')
        .getPublicUrl(path).data.publicUrl
    }

    await supabase.from('profiles').upsert({
      id: user.id,
      bio,
      avatar_url,
      updated_at: new Date()
    })

    setLoading(false)
    router.push(`/user/${user.id}`)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">プロフィール編集</h1>

      <textarea
        className="w-full border p-2"
        rows={5}
        value={bio}
        onChange={e => setBio(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        className="btn"
        disabled={loading}
        onClick={saveProfile}
      >
        {loading ? '保存中...' : '保存'}
      </button>
    </div>
  )
}
