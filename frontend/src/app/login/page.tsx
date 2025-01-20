'use client';

import { useActionState } from 'react';
import { handleLogin } from './actions';

function Login() {
  const [state, action, pending] = useActionState(handleLogin, null);
  return (
    <div className="w-full flex justify-center items-center h-full-screen">
      <form action={action} className="flex flex-col max-w-[200px] gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="text-black p-2 rounded-md"
        />
        {state?.errors?.email && (
          <p className="text-red-500">{state.errors.email}</p>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="text-black p-2 rounded-md"
        />
        {state?.errors?.password && (
          <p className="text-red-500">{state.errors.password}</p>
        )}
        <button
          disabled={pending}
          className="bg-white text-black p-2 rounded-md font-bold"
        >
          {pending ? 'Submitting...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
