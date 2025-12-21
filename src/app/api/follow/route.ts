import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { follow_id, follower_id } = await req.json()

    if (!follow_id || !follower_id) {
      return NextResponse.json({ error: '必要な情報がありません' }, { status: 400 })
    }

    console.log('inserting:', { follow_id, follower_id })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('follows')
      .insert([{ follow_id, follower_id }])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
