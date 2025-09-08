import React from "react";

export default function CommentItem({ author, time, content }) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center text-sm text-gray-500">
        <p className="text-gray-400">#no</p>
        <p className="ml-2 font-semibold text-black">{author}</p>
        <p className="ml-2">{time}</p>
      </div>
      <p className="mt-2 text-gray-700">{content}</p>
    </div>
  );
}
