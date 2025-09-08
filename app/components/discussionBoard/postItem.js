import React from "react";

export default function PostItem({ author, title, onClick }) {
  return (
    <div 
      className="border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md" 
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-black">{author}</p>
      </div>
      <p className="text-gray-700 text-sm mt-1">{title}</p>
    </div>
  );
}
