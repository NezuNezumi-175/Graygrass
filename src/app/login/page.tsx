'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const supabase = createClient()

  async function sendMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: location.origin }
    })
    alert(error ? error.message : 'メールを確認してください')
  }

  async function signOut() {
    await supabase.auth.signOut()
    alert('ログアウトしました')
  }

  return (
    <div className="min-h-screen flex items-center justify-center -translate-y-32">
      <div className="p-6 space-y-4 max-w-md w-full">
        {/* ① メール */}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="
            w-full
            px-4 py-2
            border border-gray-300
            rounded-full
            bg-white
            text-center
            focus:ring-1
            focus:ring-gray-400
          "
        />

        {/* ② 名前 */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="あなたの名前"
          className="
            w-full
            px-4 py-2
            border border-gray-300
            rounded-full
            bg-white
            text-center
            focus:ring-1
            focus:ring-gray-400
          "
        />

        {/* ③ ボタン */}
        <button
          className="btn w-full text-center"
          onClick={sendMagicLink}
        >
          Magic Linkを送る
        </button>

        <button
          className="btn w-full text-center"
          onClick={signOut}
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
