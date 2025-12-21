import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { follow_id, follower_id } = await req.json()
  if (!follow_id || !follower_id) {
    return NextResponse.json({ error: "必要な情報がありません" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("follows")
    .delete()
    .match({ follow_id, follower_id })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
