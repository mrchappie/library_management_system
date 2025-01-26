import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = await fetch('http://localhost:3002/token/validate-token', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/account',
};
