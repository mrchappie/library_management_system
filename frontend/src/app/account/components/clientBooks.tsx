import Book from './book';

async function ClientBooks({ accessToken }: { accessToken: string }) {
  const res = await fetch(
    `http://localhost:3001/api/borrow_book/all_borrowed_books`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const books = await res.json();

  return (
    <div className="border p-2 flex flex-col justify-center items-center gap-4">
      <h3>Book Information</h3>
      <section className="grid grid-cols-1 place-items-center center sm:grid-cols-3 lg:grid-cols-4 max-w-[1200px] m-auto gap-4">
        {books && books.map((book: any) => <Book key={book.id} book={book} />)}
      </section>
    </div>
  );
}

export default ClientBooks;
