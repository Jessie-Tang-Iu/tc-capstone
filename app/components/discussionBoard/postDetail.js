import React from "react";
import CommentItem from "./commentItem";

export default function PostDetail({ title, author, content, comments }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">{title}</h1>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <p className="font-semibold text-black mr-2">{author}</p>
        </div>
        <div className="bg-gray-200 h-40 flex items-center justify-center text-gray-600 mt-4">
          IMAGE IF HAVE
        </div>
        <p className="mt-4 text-gray-700 leading-relaxed">{content}</p>
      </div>

      <div className="space-y-6">
        {comments.map((c) => (
          <CommentItem key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
