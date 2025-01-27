'use client';
import { Button } from './button';

export default function Book({ book }: any) {
  function handleReturnBook(bookId: number) {
    console.log(bookId);
  }
  function handleExtendBook(bookId: number) {
    console.log(bookId);
  }

  return (
    <div
      key={book.id}
      className="border p-2 flex flex-col justify-center items-center gap-4 max-w-[250px]"
    >
      <p>
        <strong>Book Title:</strong> {book.title}
      </p>
      <p>
        <strong>Borrow Date:</strong> {book.borrow_date}
      </p>
      <p>
        <strong>Return Date:</strong> {book.return_date}
      </p>
      <div className="flex gap-4">
        <Button title="Return" handleClick={() => handleReturnBook(book.id)} />
        <Button title="Extend" handleClick={() => handleExtendBook(book.id)} />
      </div>
    </div>
  );
}
