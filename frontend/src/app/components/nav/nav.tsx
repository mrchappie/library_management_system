'use client';
import handleLogout from '@/app/actions/logout';
import Link from 'next/link';

function Nav() {
  return (
    <nav className="flex justify-between h-[var(--navbar-height)]">
      <h1 className="p-4 font-bold italic text-xl">BookVerse</h1>
      <ul className="flex gap-4 justify-end items-center">
        <Link href="/">
          <li className="p-4 hover:text-blue-500">Home</li>
        </Link>
        <Link href="/books">
          <li className="p-4 hover:text-blue-500">Books</li>
        </Link>
        <Link href="/account">
          <li className="p-4 hover:text-blue-500">Account</li>
        </Link>
        <a onClick={handleLogout}>
          <li className="p-4 hover:text-blue-500 cursor-pointer">Logut</li>
        </a>
      </ul>
    </nav>
  );
}

export default Nav;
