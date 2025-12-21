import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function Search(search_name: string) {
  if (!search_name.trim()) {
    return []
  }

  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, name, avatar_url')
    .ilike('name', `%${search_name}%`)

  if (error) {
    console.error('Search error:', error)
    return []
  }

  return users || []
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const results = await Search(query)
  return NextResponse.json(results)
}
