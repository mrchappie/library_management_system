import Link from 'next/link';

export default function Home() {
  return (
    <main className="grid grid-cols-2 place-items-center gap-8 mt-[200px] p-4">
      <h1 className="text-2xl font-bold shadow-lg rounded-md shadow-custom-shadow-color p-4 col-span-2 text-center">
        Welcome to our Books Management App
      </h1>
      <div className="shadow-lg rounded-md shadow-custom-shadow-color w-[150px] sm:w-[200px] aspect-square justify-center items-center flex font-bold text-xl">
        <Link href="/login">Login</Link>
      </div>
      <div className="shadow-lg rounded-md shadow-custom-shadow-color w-[150px] sm:w-[200px] aspect-square justify-center items-center flex font-bold text-xl">
        <Link href="/register">Register</Link>
      </div>
    </main>
  );
}
