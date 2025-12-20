import { createClient } from '@/lib/supabase/server'
//reaction  リアクションの種類
//user_id  リアクションした人
//post_id リアクションされた投稿
export async function POST(reaction: string, user_id: string, post_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('reactions')
        .insert([
            { reaction: reaction, user_id: user_id, post_id: post_id }
        ])
}