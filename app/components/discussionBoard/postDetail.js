"use client";

import React, { useEffect, useState } from "react";
import Button from "../ui/Button";

export default function PostDetail({
  id,
  title,
  author_id,
  first_name,
  last_name,
  username,
  author_name,
  content,
  created_at,
  onEdit,
  tags,
}) {
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setMounted(true);
    setFormattedDate(new Date(created_at).toLocaleString());
  }, [created_at]);

  if (!mounted) return null; // skip rendering until mounted

  const displayName =
    (first_name && last_name ? `${first_name} ${last_name}` : username) ||
    author_name ||
    "Unknown";

  const formattedTags =
    typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : Array.isArray(tags)
      ? tags
      : [];

  return (
    <div className="p-4 mb-10">
      <div className="flex flex-row justify-between items-start">
        <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
        {author_id && (
          <div className="flex justify-end">
            <Button
              text="Edit Post"
              onClick={() =>
                onEdit &&
                onEdit({
                  id,
                  title,
                  content,
                  tags,
                })
              }
            />
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        By {displayName} on {formattedDate}
      </p>

      {formattedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {formattedTags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="post-content mt-5 border-t border-gray-500 pt-4 text-black space-y-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
