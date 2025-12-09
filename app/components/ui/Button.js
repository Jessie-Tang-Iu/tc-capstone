"use client";

export default function Button({ text, onClick, disabled, className, type="button" }) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        min-h-10 px-4 py-2 rounded-md font-semibold
        ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-default"
            : "bg-[#E55B3C] text-white hover:bg-[#d04f32] cursor-pointer"
        }
        ${className || ""}
      `}
    >
      {text}
    </button>
  );
}
