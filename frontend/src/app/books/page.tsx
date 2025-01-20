import BookCard from '../components/BookCard/BookCard';

async function Books() {
  const data = await fetch('http://localhost:3000/api/books', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return (
    <div className="grid grid-cols-1 place-items-center center sm:grid-cols-3 lg:grid-cols-4 max-w-[1200px] m-auto gap-4">
      {data && data.map((book: any) => <BookCard key={book.id} props={book} />)}
    </div>
  );
}

export default Books;
