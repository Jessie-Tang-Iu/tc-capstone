"use client";

import { useState } from "react";
import Button from "../ui/Button";

// helper to map snake_case -> camelCase
function normalizeReport(r) {
  if (!r) return null;
  return {
    reportId: r.report_id,
    publicCode: r.public_code,
    category: r.source_page,
    issue: r.reason,
    reporter: r.reporter,
    timeAgo: new Date(r.created_at).toLocaleString(),
    isRemoved: r.is_removed,
    isBanned: r.is_banned,
  };
}

export default function ReportDetailsCard({
  report,
  onClose,
  onBanToggle,
  onRemove,
}) {
  if (!report) return null;

  const [localReport, setLocalReport] = useState(report);

  const handleBan = async () => {
    const newStatus = !localReport.isBanned;
    const action = newStatus ? "ban" : "unban";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const res = await fetch(`/api/reports/${localReport.reportId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_banned: newStatus }),
        });
        if (!res.ok) throw new Error(`Failed to ${action} user`);
        const updated = normalizeReport(await res.json());
        setLocalReport(updated);
        onBanToggle?.(updated);
      } catch (err) {
        alert(`${action} failed: ${err.message}`);
      }
    }
  };

  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove this report?")) {
      try {
        const res = await fetch(`/api/reports/${localReport.reportId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_removed: true }),
        });
        if (!res.ok) throw new Error("Failed to remove report");
        const updated = normalizeReport(await res.json());
        setLocalReport(updated);
        onRemove?.(updated);
      } catch (err) {
        alert(`Remove failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg text-black">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#E55B3C]">Report Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>

      <div className="mb-6 space-y-2 text-sm">
        <div>
          <span className="font-medium">Report ID:</span> {localReport.reportId}
        </div>
        <div>
          <span className="font-medium">Public Code:</span>{" "}
          {localReport.publicCode || "—"}
        </div>
        <div>
          <span className="font-medium">Category:</span> {localReport.category}
        </div>
        <div>
          <span className="font-medium">Issue:</span> {localReport.issue}
        </div>
        <div>
          <span className="font-medium">Reporter:</span> {localReport.reporter}
        </div>
        <div>
          <span className="font-medium">Reported User:</span>{" "}
          {localReport.reportedUserId}
        </div>
        <div>
          <span className="font-medium">Created At:</span> {localReport.timeAgo}
        </div>
        <div>
          <span className="font-medium">Removed:</span>{" "}
          {localReport.isRemoved ? "Yes" : "No"}
        </div>
        <div>
          <span className="font-medium">Banned:</span>{" "}
          {localReport.isBanned ? "Yes" : "No"}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          text={localReport.isBanned ? "Unban User" : "Ban User"}
          onClick={handleBan}
        />
        <Button
          text="Mark as finished"
          onClick={handleRemove}
          disabled={localReport.isRemoved}
          className={localReport.isRemoved ? "cursor-default opacity-50" : ""}
        />
      </div>
    </div>
  );
}
