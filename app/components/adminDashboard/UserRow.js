// app/components/adminDashboard/UserRow.jsx
"use client";

import React from "react";

export default function UserRow({
  name,
  subtitle,
  isBanned = false,
  onMessage,
  onDetails,
  onBanToggle,
}) {
  return (
    <div className="mb-3 rounded-xl bg-[#F7EAE2] px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: name + subtitle */}
        <div className="min-w-0">
          <div className="text-lg font-bold text-black">{name}</div>
          {subtitle && (
            <div className="truncate text-[13px] text-gray-700">{subtitle}</div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Dark yellow message button with white text */}
          <button
            onClick={onMessage}
            className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white
                       hover:bg-yellow-700 active:scale-[0.98] transition"
          >
            Message
          </button>

          {/* Details (blue) */}
          <button
            onClick={onDetails}
            className="rounded-md bg-[#4AA3FF] px-4 py-2 text-sm font-semibold text-white
                       hover:opacity-90 active:scale-[0.98] transition"
          >
            Details
          </button>

          {/* Fixed width Ban / Unban */}
          <button
            onClick={onBanToggle}
            className={`w-28 rounded-md py-2 text-sm font-semibold text-white text-center
                        hover:opacity-90 active:scale-[0.98] transition
                        ${isBanned ? "bg-[#2E7D32]" : "bg-[#D32F2F]"}`}
          >
            {isBanned ? "Unban User" : "Ban User"}
          </button>
        </div>
      </div>
    </div>
  );
}
