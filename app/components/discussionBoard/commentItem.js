"use client";

import React, { useEffect, useState } from "react";
import Button from "../ui/Button";

export default function CommentItem({
  author_id,
  first_name,
  last_name,
  username,
  author_name,
  content,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const displayName =
    (first_name && last_name ? `${first_name} ${last_name}` : username) ||
    author_name ||
    "Unknown";

  return (
    <div className="border-b border-gray-300 py-4">
      <div className="flex items-center text-sm text-gray-500">
        <p className="font-semibold text-black">{displayName}</p>
      </div>
      <p className="mt-2 ml-2 text-gray-700">{content}</p>
    </div>
  );
}
