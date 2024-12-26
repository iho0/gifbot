import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI GIF Studio',
  description: 'Create amazing GIFs with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="text-xl font-bold text-white">
                AI GIF Studio
              </Link>
              
              <div className="flex items-center space-x-6">
                <Link 
                  href="/pricing" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  价格
                </Link>
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  登录
                </Link>
                <Link 
                  href="/create" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  开始创作
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  )
}
