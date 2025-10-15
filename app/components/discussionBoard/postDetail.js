import React from "react";
import CommentItem from "./commentItem";

export default function PostDetail({ title, author, content, created_at }) {
  return (
    <div className="p-4 mb-10">
      <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        By {author} on {new Date(created_at).toLocaleString()}
      </p>
      <p className="text-black whitespace-pre-wrap mt-5 border-t border-gray-500 pt-4">{content}</p>
    </div>
  );
}
