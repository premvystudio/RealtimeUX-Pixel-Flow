import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhooks(.*)',
  '/api/public(.*)',
];

// Define static assets that should be ignored
const ignoredRoutes = [
  '/((?!api|trpc))(_next|.+\\.[\\w]+$)',
  '/favicon.ico',
  '/assets/(.*)',
  '/illustrations/(.*)',
];

export default function middleware(req: NextRequest) {
  // Check if the route is a static asset that should be ignored
  if (ignoredRoutes.some(route => new RegExp(route).test(req.nextUrl.pathname))) {
    return NextResponse.next();
  }

  // Check if the route is public
  if (publicRoutes.some(route => new RegExp(route).test(req.nextUrl.pathname))) {
    return NextResponse.next();
  }

  // For now, allow all routes since we can't check auth without Clerk
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
