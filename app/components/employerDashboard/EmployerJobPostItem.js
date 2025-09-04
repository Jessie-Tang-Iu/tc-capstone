"use client";

import React from "react";

export default function EmployerJobPostItem({
  title,
  company,
  location,
  workplace,
  status = "open",
  weeksAgo,
  views,
  selected,
  onClick,
  onManage,
}) {
  const statusText = `${
    status === "open" ? "Open" : "Closed"
  } | ${weeksAgo} weeks ago | ${views} views`;
  const rowBg = selected ? "bg-gray-200" : "bg-white";

  return (
    <div
      onClick={onClick}
      className={`${rowBg} flex cursor-pointer items-center justify-between gap-4 px-4 py-4 transition hover:bg-gray-100`}
    >
      <div className="flex min-w-0 flex-col">
        <div className="truncate text-base font-semibold text-black">
          {title}
        </div>
        <div className="mt-1 truncate text-sm text-black">
          {company} | {location} | {workplace}
        </div>
        <div className="mt-2 text-sm font-semibold text-black">
          {statusText}
        </div>
      </div>

      <div className="shrink-0">
        <button
          className="rounded-md bg-[#EE7D5E] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onManage && onManage();
          }}
        >
          Manage
        </button>
      </div>
    </div>
  );
}
