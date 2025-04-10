import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the user is trying to access a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                          req.nextUrl.pathname.startsWith('/profile') ||
                          req.nextUrl.pathname.startsWith('/explore');
  
  // Check if the user is trying to access an auth route
  const isAuthRoute = req.nextUrl.pathname === '/login' || 
                     req.nextUrl.pathname === '/register' ||
                     req.nextUrl.pathname === '/forgot-password';

  // If trying to access a protected route without being logged in
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If trying to access auth routes while being logged in
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Specify which routes should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 