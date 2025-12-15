'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
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
        <div className="p-6 space-y-4 max-w-md">
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            <button className="btn" onClick={sendMagicLink}>Magic Linkを送る</button>
            <button className="btn" onClick={signOut}>ログアウト</button>
        </div>
    )
}