"use client";

import React from "react";
import Button from "../ui/Button";

export default function ReportRow({
  category,
  reportId,
  reporter,
  issue,
  timeAgo,
  isRemoved,
  isBanned,
  onDetails,
}) {
  return (
    <div className="flex items-stretch gap-4 bg-white border-b border-black py-3">
      {/* Left mini card */}
      <div className="w-40 rounded-md border bg-[#F0E0D5] px-3 py-3 text-xs text-black">
        <div className="font-semibold">{category}</div>
        <div className="mt-2">Report #:</div>
        <div className="font-mono">{reportId}</div>
      </div>

      {/* Middle details */}
      <div className="flex-1 text-sm text-black">
        <div className="font-semibold">{reporter}</div>
        {issue && <div className="mt-1">{issue}</div>}
        {timeAgo && <div className="mt-1 text-gray-500">{timeAgo}</div>}

        {/* Status flags */}
        <div className="mt-2 flex gap-3 text-xs">
          <span
            className={`px-2 py-1 rounded ${
              isRemoved
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isRemoved ? "Completed" : "Active"}
          </span>
          {isBanned && (
            <span className="px-2 py-1 rounded bg-red-100 text-red-700">
              Banned
            </span>
          )}
        </div>
      </div>

      {/* Right action */}
      <div className="flex items-center">
        <Button text="Details" onClick={onDetails} />
      </div>
    </div>
  );
}
