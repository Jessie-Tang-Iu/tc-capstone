import React from "react";

export default function PostItem({ author, time, title, likes, commentsCount, onClick }) {
  return (
    <div 
      className="border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md" 
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
      <p className="text-gray-700 text-sm mt-1">{title}</p>
    </div>
  );
}
