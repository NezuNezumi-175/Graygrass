'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function EnsureProfile() {
    useEffect(() => {
        const supabase = createClient()

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) fetch('/api/ensure-profile', { method: 'POST' })
        })

        const { data: listener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                fetch('/api/ensure-profile', { method: 'POST' }).catch((e) => { alert(e.message) })
            }
        })

        return () => {
            try {
                listener?.subscription?.unsubscribe?.()
            } catch { }
        }
    }, [])

    return null
}