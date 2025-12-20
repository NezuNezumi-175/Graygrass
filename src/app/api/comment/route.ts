import { createClient } from '@/lib/supabase/server'

export async function Comment(comment: string,follower_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('comments')
        .insert([
            { text: comment, follower_id: follower_id }
        ])
}