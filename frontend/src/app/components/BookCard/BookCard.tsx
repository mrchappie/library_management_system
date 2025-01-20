import Image from 'next/image';

function BookCard({ props }: any) {
  return (
    <div className="border p-2 flex flex-col justify-center items-center gap-4 max-w-[250px]">
      <Image
        src="https://fastly.picsum.photos/id/755/200/300.jpg?hmac=CfzLROBA3atEQnBKXK5SeavNo-1QRwZRwcqZwwdBMdM"
        alt="book"
        width={200}
        height={300}
      />
      <h2 className="font-extrabold text-xl">{props.title}</h2>
      <p className="italic">{props.author}</p>
      <p>
        <span className="font-bold">{props.quantity - props.borrowed}</span>{' '}
        books left to borrow
      </p>
      <button className="bg-white text-black p-2 rounded-md font-bold hover:scale-95">
        Borrow
      </button>
    </div>
  );
}

export default BookCard;
