"use client";

import React from "react";

export default function PostItem({ title, first_name, last_name, username, onClick, disabled = false }) {
  const displayName = first_name && last_name
    ? `${first_name} ${last_name}`
    : username || "Unknown";

  return (
    <button
      className="w-full bg-white rounded-lg px-3 py-3 mb-2 space-y-1 text-black cursor-pointer transition hover:bg-gray-50 disabled:ring-2 disabled:ring-[#E55B3C]"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex justify-start items-start">
        <p className="text-left text-base font-semibold text-black">{title}</p>
      </div>
      <p className="text-left text-gray-700 text-sm mt-1">{displayName}</p>
    </button>
  );
}