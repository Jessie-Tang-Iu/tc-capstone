"use client";

import React from "react";
import Button from "../ui/Button";
import { useUser } from "@clerk/nextjs";

export default function PostDetail({ title, author_id, first_name, last_name, username, content, created_at }) {
  const userContext = useUser();
  const userID = userContext?.user?.id;

  const displayName = first_name && last_name
    ? `${first_name} ${last_name}`
    : username || "Unknown";

  return (
    <div className="p-4 mb-10">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
        {author_id === userID && (
          <div className="flex justify-end">
            <Button text="Edit Post" onClick={() => alert("Edit post feature coming soon!")} />
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">
        By {displayName} on {new Date(created_at).toLocaleString()}
      </p>
      <p className="text-black whitespace-pre-wrap mt-5 border-t border-gray-500 pt-4">{content}</p>
    </div>
  );
}