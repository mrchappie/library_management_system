import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = await fetch('http://localhost:3002/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: request.headers.get('cookie') || '',
    },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const data = await res.json();
  console.log(data);

  return NextResponse.next();
}

export const config = {
  matcher: '/account',
};
