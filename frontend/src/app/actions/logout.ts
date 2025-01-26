import { redirect } from 'next/navigation';

export default async function handleLogout() {
  const res = await fetch('http://localhost:3002/logout', {
    method: 'DELETE',
    credentials: 'include',
  });
  if (res.ok) {
    redirect('/');
  }
}
