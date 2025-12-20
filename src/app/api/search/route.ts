import { createClient } from '@/lib/supabase/server'

async function Search(search_name: string) {
    if (!search_name.trim()) {
        return []
    }

    const supabase = createClient()
    const { data: users, error } = await (await supabase)
        .from('profiles')
        .select('id, email, name')
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
    return Response.json(results)
}
//GETに検索したい文字列を入力すると、json形式で検索結果を返すAPIエンドポイント
//例: 太
//[
//  { "id": "123", "email": "taro@example.com", "name": "太郎" },
//  { "id": "456", "email": "taro2@example.com", "name": "太郎郎" }
//]