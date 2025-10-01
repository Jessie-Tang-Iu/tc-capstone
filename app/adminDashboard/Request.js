"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import RequestRow from "@/app/components/adminDashboard/RequestRow";

export default function RequestsPanel({ onShowDetails }) {
  const [query, setQuery] = useState("");
  const [employers, setEmployers] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users?status=underreview", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();

        setEmployers(
          data.filter(
            (u) => u.role === "employer" && u.status === "underreview"
          )
        );
        setAdvisors(
          data.filter((u) => u.role === "advisor" && u.status === "underreview")
        );
      } catch (err) {
        console.error("Error loading requests:", err);
      }
    })();
  }, []);

  // filtering by search query
  const filterByQuery = (list) =>
    list.filter((u) =>
      `${u.first_name} ${u.last_name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  // helper to update user status in DB
  async function updateUserStatus(userId, newStatus) {
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
  }

  const acceptFrom = async (list, setter, id) => {
    const updated = await updateUserStatus(id, "active");
    if (updated) setter(list.filter((u) => u.id !== id));
  };

  const refuseFrom = async (list, setter, id) => {
    const updated = await updateUserStatus(id, "banned");
    if (updated) setter(list.filter((u) => u.id !== id));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 rounded-xl bg-white p-6 text-center shadow">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
          Request Management
        </div>
        <div className="flex justify-center">
          <SearchBar value={query} onChange={setQuery} onSearch={() => {}} />
        </div>
      </div>

      {/* Advisor requests */}
      <Section title="Advisor Requests">
        {filterByQuery(advisors).length === 0 ? (
          <PlaceholderCard
            title="No advisor requests"
            description="Nothing to review here."
          />
        ) : (
          <div className="h-80 overflow-y-auto pr-2">
            {filterByQuery(advisors).map((r) => (
              <RequestRow
                key={r.id}
                name={`${r.first_name} ${r.last_name}`}
                subtitle={r.email}
                onDetails={() => onShowDetails?.(r)}
                onAccept={() => acceptFrom(advisors, setAdvisors, r.id)}
                onRefuse={() => refuseFrom(advisors, setAdvisors, r.id)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Employer requests */}
      <Section title="Employer Requests">
        {filterByQuery(employers).length === 0 ? (
          <PlaceholderCard
            title="No employer requests"
            description="All caught up!"
          />
        ) : (
          <div className="h-80 overflow-y-auto pr-2">
            {filterByQuery(employers).map((r) => (
              <RequestRow
                key={r.id}
                name={`${r.first_name} ${r.last_name}`}
                subtitle={r.email}
                onDetails={() => onShowDetails?.(r)}
                onAccept={() => acceptFrom(employers, setEmployers, r.id)}
                onRefuse={() => refuseFrom(employers, setEmployers, r.id)}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
