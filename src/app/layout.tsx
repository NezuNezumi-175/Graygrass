import Link from 'next/link'
import './globals.css'

export const metadata = { title: '4Real', description: '4年に1度版BeReal.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-dvh">
        <header className="border-b p-4 flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/feed">Feed</Link>
          <Link href="/capture">Capture</Link>
          <Link href="/push-setup">Push Setup</Link>
          <Link href="/admin">Admin</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
