import { createClient } from '@/lib/supabase/server'

export async function Comment(text:string,submission_id:string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('comments')
        .insert([
            { text: text, submission_id: submission_id }
        ])
}