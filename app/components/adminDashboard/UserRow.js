"use client";

import React, { useState, useEffect } from "react";
import ChatWindow from "../ChatWindow";
import { useRouter } from "next/navigation";
import AdvisorDashboard from "@/app/advisorDashboard/page";

export default function UserRow({
  id,
  name,
  subtitle,
  status, 
  onMessage,
  role,
  onInvestigate,
  onDetails,
  onStatusChange,
}) {
  const [loading, setLoading] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [statusStyle, setStatusStyle] = useState("");
  const ME = "11111111-1111-1111-1111-111111111111"; // same admin ID as main panel

  useEffect(() => {
    if (selectedStatus === "active") {
      setStatusStyle("bg-blue-100 text-blue-700");
    } else if (selectedStatus === "banned") {
      setStatusStyle("bg-red-100 text-red-700");
    } else {
      setStatusStyle("bg-gray-100 text-gray-700");
    }
  }, [selectedStatus]);

  const handleStatusChange = async (newStatus) => {
    if (loading || newStatus === selectedStatus) return;
    const confirmChange = confirm(`Change ${name}'s status to: ${newStatus}?`);
    if (!confirmChange) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setSelectedStatus(updated.status);
      onStatusChange?.(updated);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const isBanned = selectedStatus === "banned";

  return (
    <div className="mb-3 rounded-xl bg-[#F7EAE2] px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-bold text-black">{name}</div>
          {subtitle && (
            <div className="truncate text-[13px] text-gray-700">{subtitle}</div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={onMessage}
            className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700 active:scale-[0.98] transition"
          >
            Message
          </button>

          {/* Only show investigate button for advisors */}
          {
            role === "advisor" && (
            <button
              onClick={onInvestigate}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.98] transition"
            >
              Investigate
            </button>
            )
          }
          
          <button
            onClick={onDetails}
            className="rounded-md bg-[#4AA3FF] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition"
          >
            Details
          </button>

          <select
            disabled={loading}
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`w-28 h-9 rounded-md text-sm font-semibold border text-center ${statusStyle} ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 active:scale-[0.98]"
            }`}
          >
            <option value="active" className="bg-blue-100 text-blue-700">
              Active
            </option>
            <option value="banned" className="bg-red-100 text-red-700">
              Banned
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
