import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/feed', '/favorites', '/trending'];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuth = req.cookies.get('auth')?.value === '1';

  if (isProtected && !isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/feed/:path*', '/favorites/:path*', '/trending/:path*'],
};


