'use client'

import { useRouter } from 'next/router'
import { use, useEffect, useState } from 'react'



interface UserResult {
    id: string
    email: string
    name: string
    avatar_url: string | null
}

export default function ClientSearch({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = use(searchParams)
    // return <div>Query: {params.q}</div>

    const router = useRouter()
    const query = params.q ?? ''

    const [results, setResults] = useState<UserResult[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        async function fetchUsers() {
            setLoading(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setResults(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error(err)
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [query])

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
                「{query}」の検索結果
            </h2>

            {loading && <div className="text-gray-500">検索中...</div>}

            {!loading && results.length === 0 && (
                <div className="text-gray-500 p-4 border rounded">
                    検索結果がありません
                </div>
            )}

            {results.map((user) => (
                <div
                    key={user.id}
                    onClick={() => router.push(`/user/${user.id}`)}
                    className="
            group
            border-t
            last:border-b
            p-4
            cursor-pointer
            hover:bg-gray-50
            transition
          "
                >
                    <div className="flex items-center gap-4">
                        {/* 👤 プロフィールアイコン */}
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={`${user.name} icon`}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <img
                                src="/placeholder-avatar.png"
                                alt="placeholder icon"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        )}

                        {/* 📝 名前・メール */}
                        <div className="flex-1">
                            <h2 className="text-base font-semibold text-gray-800 group-hover:underline">
                                {user.name}
                            </h2>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                        </div>

                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            ID: {user.id.substring(0, 8)}...
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
