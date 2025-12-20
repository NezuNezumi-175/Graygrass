import { createClient } from '@/lib/supabase/client'

export async function POST(reaction: string, user_mail_address: string, user_name: string) {
    const supabase = await createClient()
    const email_check = await supabase.from('profiles').select('*').eq('email', user_mail_address)
    const name_check = await supabase.from('profiles').select('*').eq('name', user_name)
    if(email_check.error || name_check.error){
        console.error('Login error:', email_check.error || name_check.error)
        return {status: 'error', message: 'An error occurred during login'}
    }
    else if(email_check.data?.length > 0 && name_check.data?.length > 0){
        return {status: 'success', message: 'Login successful'}
    }
    else if(email_check.data?.length > 0){
        return {status: 'error', message: 'User name does not match'}
    }
}