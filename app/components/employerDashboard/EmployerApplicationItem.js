"use client";

import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

export default function ApplicationItem({
  jobTitle,
  applicationNo,
  applicant,
  appliedAgo,
  status,
  onManage,
}) {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [statusStyle, setStatusStyle] = useState("");

  useEffect(() => {
    switch (selectedStatus) {
      case "A":
        setStatusStyle("bg-green-100 text-green-700");
        break;
      case "R":
        setStatusStyle("bg-red-100 text-red-700");
        break;
      case "I":
        setStatusStyle("bg-yellow-100 text-yellow-700");
        break;
      case "O":
        setStatusStyle("bg-blue-100 text-blue-700");
        break;
      case "D":
        setStatusStyle("bg-gray-300 text-gray-700");
        break;
      default:
        setStatusStyle("bg-gray-100 text-gray-600");
    }
  }, [selectedStatus]);

  const handleStatusChange = async (newStatus) => {
    if (loading || newStatus === selectedStatus) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/application/${applicationNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setSelectedStatus(updated.status);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-stretch gap-4">
      {/* Left mini card */}
      <div className="w-40 rounded-md border bg-[#F0E0D5] px-3 py-3 text-xs text-black">
        <div className="font-semibold">{jobTitle}</div>
        <div className="mt-2">Application #:</div>
        <div className="font-mono">{applicationNo}</div>
      </div>

      {/* Middle details */}
      <div className="flex-1 text-sm text-black">
        <div className="font-semibold">{applicant}</div>

        {/* Status flags */}
        <div className="mt-2 flex gap-3 text-xs">
          <span className={`px-2 py-1 rounded ${statusStyle}`}>
            {selectedStatus === "A"
              ? "Approved"
              : selectedStatus === "R"
              ? "Rejected"
              : selectedStatus === "I"
              ? "Interview"
              : selectedStatus === "O"
              ? "Offer"
              : selectedStatus === "D"
              ? "Withdrawn"
              : "Submitted"}
          </span>
        </div>

        {appliedAgo && <div className="mt-2 text-gray-400">{appliedAgo}</div>}
      </div>

      {/* Right action */}
      <div className="flex items-center gap-3">
        <Button text="Manage" onClick={onManage} />
        <select
          disabled={loading}
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`w-32 h-9 rounded-md text-sm font-semibold border text-center ${statusStyle} ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 active:scale-[0.98] transition"
          }`}
        >
          <option value="S" className="bg-gray-100 text-gray-700">
            Submitted
          </option>
          <option value="U" className="bg-gray-100 text-gray-700">
            Under Review
          </option>
          <option value="I" className="bg-yellow-100 text-yellow-700">
            Interview
          </option>
          <option value="R" className="bg-red-100 text-red-700">
            Rejected
          </option>
          <option value="O" className="bg-blue-100 text-blue-700">
            Offer
          </option>
          <option value="D" className="bg-gray-300 text-gray-700">
            Withdrawn
          </option>
          <option value="A" className="bg-green-100 text-green-700">
            Approved
          </option>
        </select>
      </div>
    </div>
  );
}
