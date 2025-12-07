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
      case "S":
        setStatusStyle("bg-gray-100 text-gray-800");
        break;
      case "U":
        setStatusStyle("bg-blue-100 text-blue-800");
        break;
      case "I":
        setStatusStyle("bg-green-100 text-green-800");
        break;
      case "R":
        setStatusStyle("bg-red-100 text-red-800");
        break;
      case "O":
        setStatusStyle("bg-yellow-100 text-yellow-800");
        break;
      case "D":
        setStatusStyle("bg-orange-100 text-orange-800");
        break;
    }
  }, [selectedStatus]);

  const handleStatusChange = async (newStatus) => {
    if (loading || newStatus === selectedStatus) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/application/${applicationNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
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
      <div className="w-40 rounded-md border bg-[#F0E0D5] px-3 py-3 text-sm text-black">
        <div className="font-semibold">{jobTitle}</div>
        <div className="mt-2">Application #:</div>
        <div className="font-mono">{applicationNo}</div>
      </div>

      {/* Middle details */}
      <div className="flex-1 text-base text-black">
        <div className="font-semibold">{applicant}</div>

        {/* Status flags */}
        <div className="mt-2 flex gap-3 text-sm">
          <span className={`px-2 py-1 rounded ${statusStyle}`}>
            {selectedStatus === "U"
              ? "Under review"
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
        <Button text="View detail" onClick={onManage} />
        <select
          disabled={loading}
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`w-32 h-9 rounded-md text-base font-semibold border text-center ${statusStyle} ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 active:scale-[0.98] transition"
          }`}
        >
          <option value="S" className="bg-gray-100 text-gray-800">
            Submitted
          </option>
          <option value="U" className="bg-blue-100 text-blue-800">
            Under Review
          </option>
          <option value="I" className="bg-green-100 text-green-800">
            Interview
          </option>
          <option value="R" className="bg-red-100 text-red-800">
            Rejected
          </option>
          <option value="O" className="bg-yellow-100 text-yellow-800">
            Offer
          </option>
          <option value="D" className="bg-orange-100 text-orange-800">
            Withdrawn
          </option>
        </select>
      </div>
    </div>
  );
}
