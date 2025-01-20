'use server';

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

  const res = await fetch('http://localhost:4000/login', {
    method: 'POST',
    body: JSON.stringify({
      email: validationResult.data.email,
      password: validationResult.data.password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
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

  return {
    errors: {
      email: '',
      password: '',
    },
    body: res.body,
  };
}
