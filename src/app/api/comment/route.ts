import { createClient } from '@/lib/supabase/server'

export async function Comment(comment: string,follow_id: string,follower_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('comments')
        .insert([
            { text: comment, follow_id: follow_id, follower_id: follower_id }
        ])
}