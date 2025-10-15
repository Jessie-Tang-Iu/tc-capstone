"use client";

import React from "react";

export default function PostItem({ title, first_name, last_name, username, onClick, disabled = false }) {
  const displayName = first_name && last_name
    ? `${first_name} ${last_name}`
    : username || "Unknown";

  return (
    <button
      className="w-full border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md disabled:bg-[#E2B596]"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex justify-start items-start">
        <p className="text-left font-semibold text-black">{displayName}</p>
      </div>
      <p className="text-left text-gray-700 text-sm mt-1">{title}</p>
    </button>
  );
}