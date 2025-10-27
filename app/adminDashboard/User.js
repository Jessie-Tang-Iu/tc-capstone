"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import UserRow from "@/app/components/adminDashboard/UserRow";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import ChatWindow from "@/app/components/ChatWindow";

export default function UsersPanel({ onShowDetails }) {
  const [query, setQuery] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [chatTo, setChatTo] = useState("");
  const [usersByRole, setUsersByRole] = useState({});
  const [activeTab, setActiveTab] = useState("admin");
  const [fetchedRoles, setFetchedRoles] = useState({});

  const roles = [
    { key: "admin", label: "Admins" },
    { key: "employer", label: "Employers" },
    { key: "advisor", label: "Advisors" },
    { key: "member", label: "Members" },
  ];

  const fetchUsersByRole = async (roleKey) => {
    try {
      const res = await fetch(`/api/users?role=${roleKey}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const filtered = data.filter(
        (u) => u.status !== "underreview" && u.role === roleKey
      );
      setUsersByRole((prev) => ({ ...prev, [roleKey]: filtered }));
      setFetchedRoles((prev) => ({ ...prev, [roleKey]: true }));
    } catch (err) {
      console.error(`Error loading ${roleKey}:`, err);
      setUsersByRole((prev) => ({ ...prev, [roleKey]: [] }));
    }
  };

  useEffect(() => {
    fetchUsersByRole(activeTab);
  }, []);

  const handleTabClick = (roleKey) => {
    setActiveTab(roleKey);
    if (!fetchedRoles[roleKey]) fetchUsersByRole(roleKey);
  };

  const updateUserStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      const updated = await res.json();
      setUsersByRole((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((u) =>
          u.id === updated.id ? updated : u
        ),
      }));
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const openMessage = (userId) => {
    setChatTo(userId);
    setOpenChat(true);
  };

  const showDetails = (user, roleLabel) => {
    onShowDetails?.({ user, roleLabel });
  };

  const currentList = usersByRole[activeTab] || [];

  const filterByQuery = (list) => {
    const q = query.toLowerCase();
    return list.filter((u) => {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const username = (u.username ?? "").toLowerCase();
      return fullName.includes(q) || email.includes(q) || username.includes(q);
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 rounded-xl bg-white p-6 shadow">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C] text-center">
          User Management
        </div>

        {/* Search and Tabs in same row */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-3">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => handleTabClick(r.key)}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition
                  ${
                    activeTab === r.key
                      ? "bg-[#E55B3C] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <SearchBar
              placeholder="Search by username or email"
              value={query}
              onChange={setQuery}
              onSearch={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Section */}
      <Section title={roles.find((r) => r.key === activeTab)?.label}>
        {filterByQuery(currentList).length === 0 ? (
          <PlaceholderCard
            title={`No ${activeTab}s found`}
            description="Try another search."
          />
        ) : (
          <div className="h-[700px] overflow-y-auto pr-2">
            {filterByQuery(currentList).map((u) => (
              <UserRow
                key={u.id}
                id={u.id}
                name={`${u.first_name} ${u.last_name}`}
                subtitle={`${u.username ?? ""} | ${u.email ?? ""}`}
                status={u.status}
                onMessage={() => openMessage(u.id)}
                onDetails={() =>
                  showDetails(u, roles.find((r) => r.key === activeTab)?.label)
                }
                onStatusChange={(updated) =>
                  updateUserStatus(u.id, updated.status)
                }
              />
            ))}
          </div>
        )}
      </Section>

      {/* Chat Window */}
      {openChat && (
        <ChatWindow
          recipient={chatTo}
          onClose={() => setOpenChat(false)}
          onSend={(text) => console.log("send:", { to: chatTo, text })}
        />
      )}
    </div>
  );
}
