"use client";

import React from "react";
import Button from "../ui/Button";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PostDetail({ id, title, author_id, first_name, last_name, username, content, created_at, onEdit }) {
  const { user } = useUser();
  const userID = user?.id;

  const dummyTags = "Tag1,Tag2,Tag3"; // Placeholder for tags

  const displayName =
    first_name && last_name
      ? `${first_name} ${last_name}`
      : username || "Unknown";

  const formattedDate = new Date(created_at).toLocaleString();

  return (
    <div className="p-4 mb-10">
      <div className="flex flex-row justify-between items-start">
        <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>

        {author_id === userID && (
          <div className="flex justify-end">
            <Button
              text="Edit Post"
              onClick={() =>
                onEdit &&
                onEdit({
                  id,
                  title,
                  content,
                })
              }
            />
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        By {displayName} on {formattedDate}
      </p>

      <div>
        Tags: 
      </div>

      {/* Allows the content to render the HTML output from quill, TO-DO: Sanitize input to prevent XSS */}
      <div
        className="post-content mt-5 border-t border-gray-500 pt-4 text-black space-y-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}