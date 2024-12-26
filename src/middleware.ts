import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

// 创建限流器
const limiter = rateLimit({
  interval: 60 * 1000, // 1 分钟
  uniqueTokenPerInterval: 500 // 最大用户数
})

export async function middleware(request: NextRequest) {
  // 只对 API 路由进行限制
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // 检查请求来源
    const referer = request.headers.get('referer')
    if (!referer?.includes(process.env.NEXT_PUBLIC_APP_URL || '')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
      // 应用速率限制
      const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'anonymous'
      await limiter.check(10, ip.toString()) // 每分钟最多 10 个请求
    } catch {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
} 