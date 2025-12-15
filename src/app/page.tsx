import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">4Real</h1>
      <p>メールでログインして遊べます。</p>
      <div className="flex gap-2">
        <Link href="/login">ログイン</Link>
        <Link href="/locked">ロック画面へ</Link>
      </div >
    </div >
  )
}
