"use client";

import React from "react";

export default function RequestRow({
  name,
  subtitle,
  onDetails,
  onAccept,
  onRefuse,
}) {
  return (
    <div className="mb-3 rounded-xl border border-gray-200 bg-[#F7EAE0] p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-black">{name}</div>
          <div className="text-xs text-gray-700">{subtitle}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDetails}
            className="w-[92px] rounded-md bg-[#C58E2C] px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
          >
            Details
          </button>
          <button
            onClick={onAccept}
            className="w-[92px] rounded-md bg-[#3B82F6] px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
          >
            Accept
          </button>
          <button
            onClick={onRefuse}
            className="w-[92px] rounded-md bg-[#E11D48] px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
          >
            Refuse
          </button>
        </div>
      </div>
    </div>
  );
}
