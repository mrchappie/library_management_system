import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const validateRes = await fetch(
    'http://localhost:3002/token/validate-access-token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
    }
  );

  if (!validateRes.ok) {
    const refreshRes = await fetch(
      'http://localhost:3002/token/refresh-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: request.headers.get('cookie') || '',
        },
      }
    );

    if (!refreshRes.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      const data = await refreshRes.json();
      (await cookies()).set('accessToken', data.accessToken, {
        httpOnly: true,
        // sameSite: 'none',
        // secure: false,
        // maxAge: 15 * 60 * 1000,
        maxAge: 15,
      });
      (await cookies()).set('refreshToken', data.refreshToken, {
        httpOnly: true,
        // sameSite: 'none',
        // secure: false,
        // maxAge: 30 * 60 * 1000,
        maxAge: 3600,
      });
    }
  }

  // const data = await res.json();
  // console.log(data);

  return NextResponse.next();
}

export const config = {
  matcher: '/account',
};
