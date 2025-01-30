'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(16, 'Password must be less than 16 characters'),
});

export async function handleLogin(state: any, formData: any) {
  const validationResult = UserLoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const res = await fetch('http://localhost:3002/login', {
    method: 'POST',
    body: JSON.stringify({
      email: validationResult.data.email,
      password: validationResult.data.password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json();
    return {
      errors: {
        email: err.errors.email || '',
        password: err.errors.password || '',
      },
    };
  }

  if (res.ok) {
    const data = await res.json();
    // console.log(data);
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
    (await cookies()).set('client_id', data.client_id, {
      httpOnly: true,
      // sameSite: 'none',
      // secure: false,
      // maxAge: 30 * 60 * 1000,
      maxAge: 3600,
    });
  }
  redirect('/');
}
