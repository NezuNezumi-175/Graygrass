import { createClient } from '@/lib/supabase/server'
//reaction  リアクションの種類
//reacted_id  リアクションした人
//be_reacted_id リアクションされた人
export async function Comment(reaction: string,reacted_id: string,be_reacted_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('reactions')
        .insert([
            { reaction: reaction, reacted_id: reacted_id, be_reacted_id: be_reacted_id }
        ])
}