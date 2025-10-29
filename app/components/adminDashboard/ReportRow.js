"use client";

import React, { useState } from "react";
import Button from "../ui/Button";

function formatDate(dateString) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday = d >= today;
  const isYesterday = d >= yesterday && d < today;

  const timePart = d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today, ${timePart}`;
  if (isYesterday) return `Yesterday, ${timePart}`;
  return `${d.toLocaleDateString("en-GB")}, ${timePart}`;
}

export default function ReportRow({
  category,
  reportId,
  reporter,
  issue,
  timeAgo,
  isRemoved,
  isBanned,
  onDetails,
  onDelete, // callback from parent to update list
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;
    const confirmDelete = confirm(`Delete report #${reportId}?`);
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      onDelete?.(reportId);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        {timeAgo && (
          <div className="mt-1 text-gray-500">{formatDate(timeAgo)}</div>
        )}

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

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button
          text="Details"
          onClick={onDetails}
          className="h-9 px-4 text-sm font-semibold"
        />
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`h-9 px-4 rounded-md text-sm font-semibold text-white transition active:scale-[0.98] shadow-sm 
            ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
