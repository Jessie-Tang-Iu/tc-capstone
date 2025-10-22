"use client";

import React from "react";

export default function EmployerJobPostItem({
  title,
  company,
  location,
  workplace, // could be joined from job_workplace table (e.g., "On-site")
  status = "A", // A = Active, I = Inactive
  salary_per_hour,
  posted_at,
  selected,
  onClick,
  onManage,
}) {
  // derive readable fields
  const isActive = status === "A";
  const statusText = isActive ? "Active" : "Inactive";

  // compute weeks ago from posted_at
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
        <div className="truncate text-base font-semibold text-black">
          {title}
        </div>

        <div className="mt-1 truncate text-sm text-black">
          {company} | {location} | {workplace}
        </div>

        <div className="mt-2 text-sm text-gray-700 font-semibold">
          {statusText} | Posted {weeksAgo} week{weeksAgo !== 1 ? "s" : ""} ago
        </div>

        {salary_per_hour && (
          <div className="mt-1 text-sm font-semibold text-[#EE7D5E]">
            ${salary_per_hour.toFixed(2)} / hour
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
