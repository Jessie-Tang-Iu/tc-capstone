"use client";
import { useEffect, useState } from "react";

const formatKey = (k) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const LabelValue = ({label, value}) => (
  <div
    key={label}
    className="flex flex-col bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
  >
    <span className="text-sm font-semibold text-gray-500">
      {formatKey(label)}
    </span>
    <span className="mt-1 text-gray-900 wrap-break-word">
      {String(value ?? "—")}
    </span>
  </div>
)

export default function UserDetailsCard({ isPublic=true, user, roleLabel, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const hideContent = isPublic ? ["clerk_id", "username", "role", "status", "show_email", "show_phone"] : ["show_email", "show_phone"];

  useEffect(() => {
    if (!user?.clerk_id) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/users/${user.clerk_id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("User fetch failed:", err);
        setError("Failed to load live data. Showing cached info.");
        setDetails(user);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.clerk_id]);

  if (!user) return null;
  const data = details || {};
  const displayName =
    data.first_name && data.last_name
      ? `${data.first_name} ${data.last_name}`
      : data.name ?? "N/A";

  const title =
    {
      admin: "Admin Profile",
      employer: "Employer Profile",
      advisor: "Advisor Profile",
      member: "Member Profile",
    }[roleLabel?.toLowerCase()] ?? "User Profile";

  const formatKey = (k) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  
  const skip = ["password", "token", "metadata", "created_at", "updated_at"];
  const keys = Object.keys(data).filter((k) => !skip.includes(k.toLowerCase()));

  const statusColor =
    data.status === "active"
      ? "bg-green-100 text-green-800"
      : data.status === "banned"
      ? "bg-red-100 text-red-800"
      : data.status === "under-review"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-gray-100 text-gray-600";

  return (
    <section className="flex-1 rounded-2xl bg-white shadow p-8 text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#E55B3C]">{title}</h2>
        <button
          onClick={onClose}
          className="rounded-lg bg-[#E2B596] px-4 py-2 text-sm font-medium hover:bg-[#d1a482] transition"
        >
          Close
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-6">Loading details…</div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F9E7E2] text-3xl font-semibold text-[#E55B3C]">
              {displayName[0] ?? "?"}
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xl font-bold">{displayName}</div>
              <div className="text-gray-600">{roleLabel}</div>
              {data.status && (
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
                >
                  {data.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="text-center text-sm text-red-600 mb-4">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {keys.map((key) => {
              if (!hideContent.includes(key) && data[key] && data[key].trim() !== "" && data[key].replaceAll("|","").trim() !== "") {
                if (key === "email") {
                  return data.show_email ? <LabelValue key={key} label="Email" value={data.email} /> : null;
                } else if (key === "phone") {
                  return data.show_phone ? <LabelValue key={key} label="Phone number" value={data.phone} /> : null;
                } else {
                  return <LabelValue key={key} label={key} value={data[key]} />;
                }
              }
              return null;
            })}
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
