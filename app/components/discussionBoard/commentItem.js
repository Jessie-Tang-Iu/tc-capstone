"user client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import Button from "../ui/Button";

export default function CommentItem({ author_id, first_name, last_name, username, content }) {
  const userContext = useUser();
  const currentUserID = userContext?.user?.id;

  const displayName = first_name && last_name
    ? `${first_name} ${last_name}`
    : username || "Unknown";

  return (
    <div className="border-b border-gray-300 py-4">
      <div className="flex items-center text-sm text-gray-500">
        <p className="font-semibold text-black">{displayName}</p>
        {author_id === currentUserID && (
          <Button
            text="Edit Comment"
            onClick={() => alert("Edit comment feature coming soon!")}
            className="ml-auto"
          />
        )}
      </div>
      <p className="mt-2 ml-2 text-gray-700">{content}</p>
    </div>
  );
}