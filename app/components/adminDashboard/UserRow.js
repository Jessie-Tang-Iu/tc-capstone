"use client";

import React, { useState } from "react";

export default function UserRow({
  id,
  name,
  subtitle,
  status, // <-- pass the DB status string
  onMessage,
  onDetails,
  onStatusChange,
}) {
  const [loading, setLoading] = useState(false);

  const handleBanToggle = async () => {
    if (loading) return;
    setLoading(true);

    // toggle active ↔ banned
    const newStatus = status === "banned" ? "active" : "banned";

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      // push back to parent
      onStatusChange?.(updated);
    } catch (err) {
      console.error("Ban/Unban failed:", err);
      alert("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const isBanned = status === "banned";

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

          <button
            onClick={onDetails}
            className="rounded-md bg-[#4AA3FF] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition"
          >
            Details
          </button>

          <button
            onClick={handleBanToggle}
            disabled={loading}
            className={`w-28 rounded-md py-2 text-sm font-semibold text-white text-center transition
              ${isBanned ? "bg-[#2E7D32]" : "bg-[#D32F2F]"}
              ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 active:scale-[0.98]"
              }`}
          >
            {loading ? "Updating..." : isBanned ? "Unban User" : "Ban User"}
          </button>
        </div>
      </div>
    </div>
  );
}
