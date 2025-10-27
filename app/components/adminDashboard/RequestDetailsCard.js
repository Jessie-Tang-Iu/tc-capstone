"use client";
import { useEffect, useMemo, useState } from "react";

export default function RequestDetailsCard({ request, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch up-to-date info from backend
  useEffect(() => {
    if (!request?.id) return;
    console.log("RequestDetailsCard props:", request);

    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/api/users/${request.id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch request details");
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Request details fetch failed:", err);
        setError("Failed to load request details.");
        setDetails(request); // fallback to local data
      } finally {
        setLoading(false);
      }
    })();
  }, [request?.id]);

  // Normalize key names and flatten
  const flatData = useMemo(() => {
    const raw = details || request || {};
    const result = {};
    Object.entries(raw).forEach(([k, v]) => {
      const key = k.replace(/([A-Z])/g, "_$1").toLowerCase();
      result[key] = v;
    });
    return result;
  }, [details, request]);

  const displayName =
    flatData.first_name && flatData.last_name
      ? `${flatData.first_name} ${flatData.last_name}`
      : flatData.name ?? "N/A";

  const title =
    flatData.role?.toLowerCase() === "advisor"
      ? "Advisor Request"
      : flatData.role?.toLowerCase() === "employer"
      ? "Employer Request"
      : "Request Details";

  const formatKey = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace("Id", "ID");

  const skipKeys = [
    "password",
    "token",
    "metadata",
    "created_at",
    "updated_at",
  ];
  const keys = Object.keys(flatData).filter(
    (k) => !skipKeys.includes(k.toLowerCase())
  );

  const statusColor =
    flatData.status === "active"
      ? "bg-green-100 text-green-800"
      : flatData.status === "banned"
      ? "bg-red-100 text-red-800"
      : flatData.status === "underreview"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-gray-100 text-gray-700";

  return (
    <section className="flex-1 rounded-2xl bg-white shadow p-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#E55B3C]">
          {title} Details
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
      ) : error ? (
        <div className="text-center text-red-600 py-6">{error}</div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F9E7E2] text-3xl font-semibold text-[#E55B3C]">
              {displayName[0] ?? "?"}
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xl font-bold">{displayName}</div>
              <div className="text-gray-600 capitalize">
                {flatData.role ?? "N/A"}
              </div>
              {flatData.status && (
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                >
                  {flatData.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {keys.map((key) => (
              <div
                key={key}
                className="flex flex-col bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
              >
                <span className="text-sm font-semibold text-gray-500">
                  {formatKey(key)}
                </span>
                <span className="mt-1 text-gray-900 break-words">
                  {String(flatData[key] ?? "—")}
                </span>
              </div>
            ))}
          </div>

          {keys.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No additional details found.
            </div>
          )}
        </>
      )}
    </section>
  );
}
