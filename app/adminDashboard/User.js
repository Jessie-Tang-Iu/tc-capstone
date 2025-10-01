"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import UserRow from "@/app/components/adminDashboard/UserRow";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import ChatWindow from "@/app/components/ChatWindow";

export default function UsersPanel({ onShowDetails }) {
  const [query, setQuery] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [chatTo, setChatTo] = useState("");
  const [users, setUsers] = useState([]);

  // fetch from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.filter((u) => u.status !== "underreview"));
      } catch (err) {
        console.error("Error loading users:", err);
      }
    })();
  }, []);

  // group by role
  const normal = useMemo(
    () => users.filter((u) => u.role === "member"),
    [users]
  );
  const employer = useMemo(
    () => users.filter((u) => u.role === "employer"),
    [users]
  );
  const advisor = useMemo(
    () => users.filter((u) => u.role === "advisor"),
    [users]
  );
  const admin = useMemo(() => users.filter((u) => u.role === "admin"), [users]);

  // filter by search query
  const filterByQuery = (list) =>
    list.filter((u) =>
      `${u.first_name} ${u.last_name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  async function updateUserStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      const updated = await res.json();

      // update source of truth
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

      return updated;
    } catch (err) {
      console.error("Update status error:", err);
      return null;
    }
  }

  const handleBanToggle = async (user) => {
    const newStatus = user.status === "banned" ? "active" : "banned";
    await updateUserStatus(user.id, newStatus);
  };

  const openMessage = (name) => {
    setChatTo(name);
    setOpenChat(true);
  };

  const showDetails = (user, roleLabel) => {
    if (onShowDetails) onShowDetails({ user, roleLabel });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 rounded-xl bg-white p-6 shadow text-center">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
          User Management
        </div>
        <div className="flex justify-center">
          <SearchBar value={query} onChange={setQuery} onSearch={() => {}} />
        </div>
      </div>

      {/* Admins */}
      <Section title="Admins">
        {filterByQuery(admin).length === 0 ? (
          <PlaceholderCard
            title="No admins found"
            description="Try another search."
          />
        ) : (
          <div className="h-80 overflow-y-auto pr-2">
            {filterByQuery(admin).map((u) => (
              <UserRow
                key={u.id}
                id={u.id}
                name={`${u.first_name} ${u.last_name}`}
                subtitle={u.email}
                status={u.status} // <-- pass status directly
                onMessage={() => openMessage(u.email)}
                onDetails={() => showDetails(u, u.role)}
                onStatusChange={(updated) => {
                  setUsers((prev) =>
                    prev.map((x) => (x.id === updated.id ? updated : x))
                  );
                }}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Employers */}
      <Section title="Employers">
        {filterByQuery(employer).length === 0 ? (
          <PlaceholderCard
            title="No employers found"
            description="Try another search."
          />
        ) : (
          <div className="h-80 overflow-y-auto pr-2">
            {filterByQuery(employer).map((u) => (
              <UserRow
                key={u.id}
                name={`${u.first_name} ${u.last_name}`}
                subtitle={u.email}
                isBanned={u.banned}
                onMessage={() => openMessage(`${u.first_name} ${u.last_name}`)}
                onDetails={() => showDetails(u, "Employer")}
                onBanToggle={() => toggleBan(u.id)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Advisors */}
      <Section title="Advisors">
        {filterByQuery(advisor).length === 0 ? (
          <PlaceholderCard
            title="No advisors found"
            description="Try another search."
          />
        ) : (
          <div className="h-80 overflow-y-auto pr-2">
            {filterByQuery(advisor).map((u) => (
              <UserRow
                key={u.id}
                name={`${u.first_name} ${u.last_name}`}
                subtitle={u.email}
                isBanned={u.banned}
                onMessage={() => openMessage(`${u.first_name} ${u.last_name}`)}
                onDetails={() => showDetails(u, "Advisor")}
                onBanToggle={() => toggleBan(u.id)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Normal Members */}
      <Section title="Normal Users">
        {filterByQuery(normal).length === 0 ? (
          <PlaceholderCard
            title="No users found"
            description="Try another search."
          />
        ) : (
          <div className="h-80 overflow-y-auto pr-2">
            {filterByQuery(normal).map((u) => (
              <UserRow
                key={u.id}
                name={`${u.first_name} ${u.last_name}`}
                subtitle={u.email}
                isBanned={u.banned}
                onMessage={() => openMessage(`${u.first_name} ${u.last_name}`)}
                onDetails={() => showDetails(u, "Normal User")}
                onBanToggle={() => toggleBan(u.id)}
              />
            ))}
          </div>
        )}
      </Section>

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
