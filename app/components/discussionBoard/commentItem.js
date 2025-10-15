import React from "react";

export default function CommentItem({ author, content }) {
  return (
    <div className="border-b border-gray-300 py-4">
      <div className="flex items-center text-sm text-gray-500">
        <p className="font-semibold text-black">{author}</p>
      </div>
      <p className="mt-2 ml-2 text-gray-700">{content}</p>
    </div>
  );
}
