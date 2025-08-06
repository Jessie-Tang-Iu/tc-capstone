export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-600 transition"
    >
      {text}
    </button>
  );
}
