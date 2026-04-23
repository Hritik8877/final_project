import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session')?.value;
  const role = request.cookies.get('user-role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Unauthenticated users trying to access dashboard
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Prevent role mismatch
  if (session && role) {
    if (pathname.startsWith('/dashboard/instructor') && role !== 'instructor') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
    if (pathname.startsWith('/dashboard/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard/instructor', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/course/:path*/learn'],
};
