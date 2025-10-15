import React from "react";

export default function PostItem({ author, title, onClick, disabled=false }) {
  return (
    <button 
      className="w-full border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md disabled:bg-[#E2B596]" 
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex justify-start items-start">
        <p className="text-left font-semibold text-black">{author}</p>
      </div>
      <p className="text-left text-gray-700 text-sm mt-1">{title}</p>
    </button>
  );
}
