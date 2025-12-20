import { createClient } from '@/lib/supabase/server'

export async function POST(follow_id: string,follower_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('follows')
        .insert([
            { follow_id: follow_id, follower_id: follower_id }
        ])
}