"use client";

import Button from "../ui/Button";

export default function ReportDetailsCard({
  report,
  onClose,
  onBan,
  onRemove,
}) {
  if (!report) return null;

  const handleBan = async () => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      try {
        // Call API
        const res = await fetch(`/api/reports/${report.reportId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_banned: true }),
        });
        if (!res.ok) throw new Error("Failed to ban user");
        const updated = await res.json();
        onBan?.(updated);
      } catch (err) {
        alert(`Ban failed: ${err.message}`);
      }
    }
  };

  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove this report?")) {
      try {
        const res = await fetch(`/api/reports/${report.reportId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_removed: true }),
        });
        if (!res.ok) throw new Error("Failed to remove report");
        const updated = await res.json();
        onRemove?.(updated);
      } catch (err) {
        alert(`Remove failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg text-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#E55B3C]">Report Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Report info */}
      <div className="mb-6 space-y-2 text-sm">
        <div>
          <span className="font-medium">Report ID:</span> {report.reportId}
        </div>
        <div>
          <span className="font-medium">Public Code:</span>{" "}
          {report.publicCode || "—"}
        </div>
        <div>
          <span className="font-medium">Category:</span> {report.category}
        </div>
        <div>
          <span className="font-medium">Issue:</span> {report.issue}
        </div>
        <div>
          <span className="font-medium">Reporter:</span> {report.reporter}
        </div>
        <div>
          <span className="font-medium">Reported User:</span>{" "}
          {report.reportedUserId}
        </div>
        <div>
          <span className="font-medium">Created At:</span> {report.timeAgo}
        </div>
        <div>
          <span className="font-medium">Removed:</span>{" "}
          {report.isRemoved ? "Yes" : "No"}
        </div>
        <div>
          <span className="font-medium">Banned:</span>{" "}
          {report.isBanned ? "Yes" : "No"}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          text="Ban User"
          onClick={handleBan}
          disabled={report.isBanned}
        />
        <Button
          text="Remove Report"
          onClick={handleRemove}
          disabled={report.isRemoved}
        />
      </div>
    </div>
  );
}
