import Link from "next/link";

export default function LockedPage() {
    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">ロックされています</h2>
            <p>最新のイベントで投稿しなかったため、次の通知が来るまで他の人の投稿は見られません。</p>
            <p>通知を有効化しておくと開始に気づきやすいです（<Link href="/push-setup">Push ページ</Link>へどうぞ）。</p>
        </div>
    )
}