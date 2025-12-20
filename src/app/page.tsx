import Link from 'next/link'

export default function Home() {
  return (
    <div className="pt-14 p-6 space-y-4">
      <h1 className="text-6xl font-bold"> </h1>
      <h3 className= "text-4xl font-bold">自分のトレンド</h3>
      <h2 className= "text-2xl font-bold">自分の投稿</h2>
      <h2 className= "text-2xl font-bold">フレンドの投稿</h2>
      <h3 className= "text-4xl font-bold">みんなのトレンド</h3>
      <h2 className= "text-2xl font-bold">今日/最近の投稿</h2>
      <h2 className= "text-2xl font-bold">1年内の投稿</h2>
      <h2 className= "text-2xl font-bold">4年前の投稿</h2>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>aaa</p>
      <p>メールでログインして遊べます。</p>
      <div className="flex gap-2">
        <Link href="/login">ログイン</Link>
        <Link href="/locked">ロック画面へ</Link>
      </div >
    </div >
  )
}

