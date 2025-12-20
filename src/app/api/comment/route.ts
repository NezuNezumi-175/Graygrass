import { createClient } from '@/lib/supabase/server'
//content  コメント内容
//user_id  コメントした人
//post_id コメントされた投稿
export async function POST(content: string,user_id: string,post_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('comments')
        .insert([
            { content: content, user_id: user_id, post_id: post_id }
        ])
}