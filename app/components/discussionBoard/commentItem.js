"user client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import Button from "../ui/Button";

export default function CommentItem({ user_id, author, content }) {
  const userContext = useUser();
  const currentUserID = userContext?.user?.id;

  return (
    <div className="border-b border-gray-300 py-4">
      <div className="flex items-center text-sm text-gray-500">
        <p className="font-semibold text-black">{author}</p>
        {
          user_id === currentUserID && 
          <Button text="Edit Comment" onClick={() => alert("Edit comment feature coming soon!")} className="ml-auto" />
        }
        
      </div>
      <p className="mt-2 ml-2 text-gray-700">{content}</p>
    </div>
  );
}
