import { createClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { user_mail_address, user_name } = body ?? {}

        if (!user_mail_address || !user_name) {
            return NextResponse.json({ status: 'error', message: 'Missing fields' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: emailData, error: emailError } = await supabase.from('profiles').select('*').eq('email', user_mail_address)
        const { data: nameData, error: nameError } = await supabase.from('profiles').select('*').eq('name', user_name)

        if (emailError || nameError) {
            console.error('Login error:', emailError || nameError)
            return NextResponse.json({ status: 'error', message: 'An error occurred during login' }, { status: 500 })
        }

        if ((emailData?.length ?? 0) > 0 && (nameData?.length ?? 0) > 0) {
            return NextResponse.json({ status: 'success', message: 'Login successful' })
        }

        if ((emailData?.length ?? 0) > 0) {
            return NextResponse.json({ status: 'error', message: 'User name does not match' }, { status: 400 })
        }

        return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 })
    } catch (err) {
        console.error('Login handler error:', err)
        return NextResponse.json({ status: 'error', message: 'Invalid request' }, { status: 400 })
    }
}