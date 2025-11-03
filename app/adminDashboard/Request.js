"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import RequestRow from "@/app/components/adminDashboard/RequestRow";

export default function RequestsPanel({ onShowDetails }) {
  const [query, setQuery] = useState("");
  const [requestsByRole, setRequestsByRole] = useState({});
  const [activeTab, setActiveTab] = useState("advisor");
  const [fetchedRoles, setFetchedRoles] = useState({});

  const roles = [
    { key: "advisor", label: "Advisors" },
    { key: "employer", label: "Employers" },
  ];

  // --- Fetch logic ---
  const fetchRequestsByRole = async (roleKey) => {
    try {
      const res = await fetch(`/api/users?status=underreview&role=${roleKey}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      const filtered = data.filter(
        (u) =>
          u.role === roleKey && u.status !== "active" && u.status !== "banned"
      );
      setRequestsByRole((prev) => ({ ...prev, [roleKey]: filtered }));
      setFetchedRoles((prev) => ({ ...prev, [roleKey]: true }));
    } catch (err) {
      console.error(`Error loading ${roleKey} requests:`, err);
      setRequestsByRole((prev) => ({ ...prev, [roleKey]: [] }));
    }
  };

  useEffect(() => {
    fetchRequestsByRole(activeTab);
  }, []);

  const handleTabClick = (roleKey) => {
    setActiveTab(roleKey);
    if (!fetchedRoles[roleKey]) fetchRequestsByRole(roleKey);
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      return await res.json();
    } catch (err) {
      console.error("Update status error:", err);
      return null;
    }
  };

  const acceptRequest = async (roleKey, id) => {
    const updated = await updateUserStatus(id, "active");
    if (updated) {
      setRequestsByRole((prev) => ({
        ...prev,
        [roleKey]: prev[roleKey].filter((u) => u.id !== id),
      }));
    }
  };

  const refuseRequest = async (roleKey, id) => {
    const updated = await updateUserStatus(id, "banned");
    if (updated) {
      setRequestsByRole((prev) => ({
        ...prev,
        [roleKey]: prev[roleKey].filter((u) => u.id !== id),
      }));
    }
  };

  const currentList = requestsByRole[activeTab] || [];

  const filterByQuery = (list) => {
    const q = query.toLowerCase();
    return list.filter((u) =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
    );
  };

  // --- UI ---
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 rounded-xl bg-white p-6 shadow">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C] text-center">
          Request Management
        </div>
        {/* Centered Search Bar */}
        <div className="flex justify-center">
          <SearchBar
            placeholder="Search by name or email"
            value={query}
            onChange={setQuery}
            onSearch={() => {}}
          />
        </div>
      </div>

      {/* Section with browser-style tabs */}
      <Section>
        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-4">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => handleTabClick(r.key)}
              className={`px-5 py-2 text-sm font-semibold rounded-t-md transition-all
                ${
                  activeTab === r.key
                    ? "bg-white border-x border-t border-gray-300 text-[#E55B3C]"
                    : "text-gray-600 hover:text-[#E55B3C] bg-gray-100"
                }`}
              style={{
                marginBottom: activeTab === r.key ? "-1px" : "0",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* List or Placeholder */}
        {filterByQuery(currentList).length === 0 ? (
          <PlaceholderCard
            title={`No pending ${activeTab} requests`}
            description="Nothing to review here."
          />
        ) : (
          <div className="h-[700px] overflow-y-auto pr-2 bg-white  rounded-b-md ">
            {filterByQuery(currentList).map((r) => (
              <RequestRow
                {...r}
                key={r.id}
                name={`${r.first_name} ${r.last_name}`}
                subtitle={r.email}
                onAccept={() => acceptRequest(activeTab, r.id)}
                onRefuse={() => refuseRequest(activeTab, r.id)}
                onDetails={() => onShowDetails?.(r)}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
