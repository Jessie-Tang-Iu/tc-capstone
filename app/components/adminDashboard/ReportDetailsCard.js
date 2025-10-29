"use client";

import { useState, useEffect } from "react";

export default function ReportDetailsCard({
  report,
  onClose,
  onBanToggle,
  onRemove,
}) {
  const [details, setDetails] = useState(report);
  const [loading, setLoading] = useState(false);
  const [confirmData, setConfirmData] = useState(null); // {type, message, action}

  // --- Normalize helper ---
  const normalizeReport = (r) =>
    !r
      ? null
      : {
          id: r.id || r.report_id,
          public_code: r.public_code,
          category: r.source_page,
          issue: r.reason,
          reporter: r.reporter,
          reported_user_id: r.reported_user_id,
          created_at: r.created_at,
          is_removed: r.is_removed,
          is_banned: r.is_banned,
        };

  // --- Fetch latest ---
  useEffect(() => {
    if (!report?.report_id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/reports/${report.report_id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setDetails(normalizeReport(data));
      } catch (err) {
        console.error(err);
        setDetails(normalizeReport(report));
      } finally {
        setLoading(false);
      }
    })();
  }, [report?.report_id]);

  // --- Handlers ---
  const confirmAction = (type) => {
    if (type === "ban") {
      const newStatus = !details.is_banned;
      const action = newStatus ? "ban" : "unban";
      setConfirmData({
        type,
        message: `Are you sure you want to ${action} this user?`,
        action: async () => {
          const res = await fetch(`/api/reports/${details.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_banned: newStatus }),
          });
          if (!res.ok) throw new Error("Update failed");
          const updated = normalizeReport(await res.json());
          setDetails(updated);
          onBanToggle?.(updated);
          onClose(); // close after success
        },
      });
    } else if (type === "remove") {
      setConfirmData({
        type,
        message: "Mark this report as completed?",
        action: async () => {
          const res = await fetch(`/api/reports/${details.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_removed: true }),
          });
          if (!res.ok) throw new Error("Remove failed");
          const updated = normalizeReport(await res.json());
          setDetails(updated);
          onRemove?.(updated);
          onClose(); // close after success
        },
      });
    }
  };

  const executeAction = async () => {
    try {
      await confirmData.action();
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmData(null);
    }
  };

  const cancelAction = () => setConfirmData(null);

  // --- UI ---
  const statusColor = details?.is_banned
    ? "bg-red-100 text-red-800"
    : details?.is_removed
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";

  const displayName = details?.reporter || "Unknown Reporter";
  const formatKey = (k) =>
    k
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace("Id", "ID");
  const skipKeys = ["is_banned", "is_removed"];
  const displayKeys = Object.keys(details || {}).filter(
    (k) => !skipKeys.includes(k)
  );

  return (
    <section className="relative flex-1 rounded-2xl bg-white shadow p-8 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#E55B3C]">
          Report Details
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg bg-[#E2B596] px-4 py-2 text-sm font-medium hover:bg-[#D1A482] transition"
        >
          Close
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading details…</div>
      ) : (
        <>
          {/* Summary */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F9E7E2] text-3xl font-semibold text-[#E55B3C]">
              {displayName[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xl font-bold">{displayName}</div>
              <div className="text-gray-600">Reporter</div>
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
              >
                {details?.is_removed
                  ? "COMPLETED"
                  : details?.is_banned
                  ? "BANNED"
                  : "ACTIVE"}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayKeys.map((key) => (
              <div
                key={key}
                className="flex flex-col bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
              >
                <span className="text-sm font-semibold text-gray-500">
                  {formatKey(key)}
                </span>
                <span className="mt-1 text-gray-900 break-words">
                  {String(details[key] ?? "—")}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={() => confirmAction("ban")}
              className="rounded-md bg-[#E55B3C] px-4 py-2 text-sm font-semibold text-white hover:brightness-95 transition"
            >
              {details?.is_banned ? "Unban User" : "Ban User"}
            </button>
            <button
              onClick={() => confirmAction("remove")}
              disabled={details?.is_removed}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                details?.is_removed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#C58E2C] hover:brightness-95"
              }`}
            >
              Mark as Finished
            </button>
          </div>
        </>
      )}

      {/* --- Confirmation Modal (no dark overlay) --- */}
      {confirmData && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl text-center p-6 w-[340px] pointer-events-auto animate-fadeIn">
            <p className="text-gray-800 mb-6 font-medium">
              {confirmData.message}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={executeAction}
                className="bg-[#E55B3C] text-white px-4 py-2 rounded-md hover:brightness-95 transition"
              >
                Confirm
              </button>
              <button
                onClick={cancelAction}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
