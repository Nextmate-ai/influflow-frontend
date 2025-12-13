import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 如果是 influxy.xyz 域名且访问根路径,重定向到 /home
  // 使用精确域名匹配，避免误匹配恶意域名
  const isInfluxyDomain =
    hostname === 'influxy.xyz' ||
    hostname === 'www.influxy.xyz' ||
    hostname.endsWith('.influxy.xyz');

  if (isInfluxyDomain && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 其他情况正常处理
  return NextResponse.next();
}

// 配置匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
