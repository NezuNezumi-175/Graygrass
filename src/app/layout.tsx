"use client";

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
      <body className="min-h-dvh bg-white">
        <EnsureProfile />

        <ClientLayout>
          {/* 画面全体基準で「左寄り」 */}
          <main className="flex justify-center px-4">
            <div className="w-full transform md:-translate-x-24">
              {children}
            </div>
          </main>
        </ClientLayout>

      </body>
    </html>
  )
}
