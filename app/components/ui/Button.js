export default function Button({ text, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95
        ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#E55B3C] hover:bg-[#d14f32] text-white"
        }`}
    >
      {text}
    </button>
  );
}
