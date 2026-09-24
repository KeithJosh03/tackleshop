import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  const token = await getToken({
    req: request,
    secret
  });

  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    // 1. Unauthenticated users -> redirect to login with callback URL
    if (!token) {
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Authenticated non-admin users -> redirect to unauthorized page
    const userRole = String(token.role ?? '').toLowerCase();
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

// Config matcher prevents running middleware on static resources under /admin
export const config = {
  matcher: ['/admin/:path*'],
};