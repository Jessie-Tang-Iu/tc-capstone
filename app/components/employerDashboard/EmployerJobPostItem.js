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

  // Conditional styling
  const rowBg = selected ? "bg-orange-50 ring-2 ring-[#EE7D5E]" : "bg-white";
  const statusClasses = isActive
    ? "bg-emerald-100 text-emerald-800"
    : "bg-rose-100 text-rose-800";

  // Format salary
  const formattedSalary =
    salary_per_hour != null && salary_per_hour !== "" && !isNaN(salary_per_hour)
      ? `$${Number(salary_per_hour).toFixed(2)} / hr`
      : "N/A";

  return (
    <div
      onClick={onClick}
      // Apply shadow on hover for a modern lift effect
      className={`${rowBg} flex items-center justify-between gap-6 p-4 rounded-lg shadow-sm transition duration-200 hover:shadow-md cursor-pointer border border-gray-100`}
    >
      {/* 1. Primary Job Details (Left) */}
      <div className="flex min-w-0 flex-col flex-grow">
        <div className="flex items-center gap-3">
          {/* Job Title */}
          <div className="truncate text-lg font-bold text-gray-900">
            {title}
          </div>

          {/* Status badge - more pronounced */}
          <span
            className={`px-3 py-0.5 text-xs font-semibold rounded-full tracking-wider ${statusClasses}`}
          >
            {statusText}
          </span>
        </div>

        {/* Company, Location, Workplace */}
        <div className="mt-1 text-sm text-gray-600 truncate">
          <span className="font-medium text-black">{company}</span> &bull;{" "}
          {location} &bull; {workplace}
        </div>

        {/* Posting Time */}
        <div className="mt-1 text-xs text-gray-500">
          Posted {weeksAgo} week{weeksAgo !== 1 ? "s" : ""} ago
        </div>
      </div>

      {/* 2. Salary (Middle-Right) */}
      <div className="flex flex-col items-end justify-center w-36 shrink-0">
        <div className="text-base font-bold text-[#EE7D5E] whitespace-nowrap">
          {formattedSalary}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">ESTIMATED PAY</div>
      </div>

      {/* 3. Manage Button (Action Zone) */}
      <div className="shrink-0 w-24 flex justify-end">
        <button
          className="w-full rounded-md bg-[#EE7D5E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#D46B4E] active:scale-[0.98] focus:ring-2 focus:ring-[#EE7D5E]"
          onClick={(e) => {
            // Stop propagation prevents the click from triggering the parent onClick
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
