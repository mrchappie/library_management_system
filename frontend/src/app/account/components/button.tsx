'use client';
export const Button = ({
  title,
  handleClick,
}: {
  title: string;
  handleClick?: () => void;
}) => {
  return (
    <button
      className="bg-white text-black p-2 rounded-md font-bold hover:scale-95"
      onClick={handleClick}
    >
      {title}
    </button>
  );
};
