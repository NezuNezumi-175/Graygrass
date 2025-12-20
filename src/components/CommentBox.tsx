import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useEffect, useState } from "react"

const supabase = createClient()

type Props = {
    "id": string
    "user_id": string
    "post_id": string
    "content": string
    "created_at": string
}

export default function CommentBox({ id, user_id, post_id, content, created_at }: Props) {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        let mounted = true
        const fetchUser = async () => {
            const { data, error } = await supabase.from("profiles").select("*").eq("id", user_id).single()
            if (!error && mounted) setUser(data)
        }
        fetchUser()
        return () => { mounted = false }
    }, [id])

    return (
        <div className="flex items-start gap-3 p-2">
            {/* avatar */}
            <Link href={`/user/${user_id}`}>
                <img
                    src={user?.avatar_url ?? "/placeholder-avatar.png"}
                    alt={user?.name ?? "avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                />
            </Link>
            {/* content */}
            <div className="flex-1">
                {/* header: name left, date right */}
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900">{user?.name ?? "Unknown"}</p>
                    <span className="text-xs text-gray-500">{new Date(created_at).toLocaleString()}</span>
                </div>

                {/* comment body */}
                <p className="text-sm text-gray-700 mt-1">{content}</p>
            </div>
        </div>
    )
}