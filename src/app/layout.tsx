import EnsureProfile from '@/components/EnsureProfile'
import ClientLayout from './client-layout'
import './globals.css'

export const metadata = {
  title: '4Real.',
  description: '4年に1度版BeReal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-dvh">
        <EnsureProfile />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
