'use server';

import { z } from 'zod';

const UserLoginSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 chars long')
    .max(16, 'Password must be less than 16 characters'),
});

export async function handleRegister(state: any, formData: any) {
  const validationResult = UserLoginSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const res = await fetch('http://localhost:4000/register', {
    method: 'POST',
    body: JSON.stringify({
      name: validationResult.data.name,
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
        name: err.errors.name || '',
        email: err.errors.email || '',
        password: err.errors.password || '',
      },
    };
  }

  return {
    errors: {
      name: '',
      email: '',
      password: '',
    },
    body: res.body,
  };
}
