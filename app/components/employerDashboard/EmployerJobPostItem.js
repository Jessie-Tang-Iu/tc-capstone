"use client";

import React from "react";

export default function EmployerJobPostItem({
  title,
  company,
  location,
  workplace,
  status = "A", // A = Active, I = Inactive
  salary_per_hour,
  posted_at,
  selected,
  onClick,
  onManage,
}) {
  const isActive = status === "A";
  const statusText = isActive ? "Active" : "Inactive";

  // compute how long ago it was posted
  const weeksAgo = posted_at
    ? Math.floor((Date.now() - new Date(posted_at)) / (1000 * 60 * 60 * 24 * 7))
    : 0;

  const rowBg = selected ? "bg-gray-200" : "bg-white";

  return (
    <div
      onClick={onClick}
      className={`${rowBg} flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-gray-100 cursor-pointer`}
    >
      {/* Job Info */}
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <div className="truncate text-base font-semibold text-black">
            {title}
          </div>

          {/* Status badge */}
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusText}
          </span>
        </div>

        <div className="mt-1 truncate text-sm text-black">
          {company} | {location} | {workplace}
        </div>

        <div className="mt-1 text-xs text-gray-600">
          Posted {weeksAgo} week{weeksAgo !== 1 ? "s" : ""} ago
        </div>

        {salary_per_hour != null &&
          salary_per_hour !== "" &&
          !isNaN(salary_per_hour) && (
            <div className="mt-1 text-sm font-semibold text-[#EE7D5E]">
              ${Number(salary_per_hour).toFixed(2)} / hour
            </div>
          )}
      </div>

      {/* Manage Button */}
      <div className="shrink-0">
        <button
          className="rounded-md bg-[#EE7D5E] px-4 py-2 text-sm font-medium text-white hover:opacity-90 cursor-pointer"
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
