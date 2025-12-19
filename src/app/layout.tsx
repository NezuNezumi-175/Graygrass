import Link from 'next/link'
import './globals.css'
import Nav from './header'

export const metadata = { title: '4Real', description: '4年に1度版BeReal.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-dvh">
        <main>{children}</main>

       <Nav />
      </body>
    </html>
  )
}
