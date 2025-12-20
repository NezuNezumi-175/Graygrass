'use client'
import { useState } from 'react'

interface UserResult {
    id: string
    email: string
    name: string
}

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    async function handleSearch() {
        if (!query.trim()) {
            setResults([])
            return
        }

        setLoading(true)
        setSearched(true)

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setResults(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Search error:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">ユーザー検索</h1>

            {/* 検索入力フィールド */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="ユーザー名を入力..."
                    className="input flex-1"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="btn"
                >
                    {loading ? '検索中...' : '検索'}
                </button>
            </div>

            {/* 検索結果 */}
            <div className="space-y-4">
                {searched && results.length === 0 && !loading && (
                    <div className="text-gray-500 p-4 border rounded">
                        検索結果がありません
                    </div>
                )}

                {results.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-blue-600">
                                    {user.name}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {user.email}
                                </p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                ID: {user.id.substring(0, 8)}...
                            </span>
                        </div>
                    </div>
                ))}

                {results.length > 0 && (
                    <div className="text-gray-500 text-sm p-4 border-t mt-6">
                        <strong>{results.length}件</strong>の検索結果が見つかりました
                    </div>
                )}
            </div>
        </div>
    )
}
