"use client";

import React from "react";
import Button from "../ui/Button";

export default function ApplicationItem({
  jobTitle,
  applicationNo,
  applicant,
  headline,
  location,
  appliedAgo,
  onManage,
}) {
  return (
    <div className="flex items-stretch gap-4">
      {/* Left mini card */}
      <div className="w-52 rounded-md border bg-[#F7F3F0] px-3 py-3 text-xs text-black">
        <div className="font-semibold">{jobTitle}</div>
        <div className="mt-2">Application #:</div>
        <div className="font-mono">{applicationNo}</div>
      </div>

      {/* Middle details */}
      <div className="flex-1 text-sm text-black">
        <div className="font-semibold">{applicant}</div>
        {headline && <div className="mt-1">{headline}</div>}
        {location && <div className="mt-1 font-semibold">{location}</div>}
        {appliedAgo && <div className="mt-1">{appliedAgo}</div>}
      </div>

      {/* Right action */}
      <div className="flex items-center">
        <Button text="Manage" onClick={onManage} />
      </div>
    </div>
  );
}
