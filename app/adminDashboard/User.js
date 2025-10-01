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

  const filterByQuery = (list) =>
    list.filter((u) => {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const username = (u.username ?? "").toLowerCase();
      const q = query.toLowerCase();
      return fullName.includes(q) || email.includes(q) || username.includes(q);
    });

  async function updateUserStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      const updated = await res.json();
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
    onShowDetails?.({ user, roleLabel });
  };

  const renderUserSection = (title, list, roleLabel) => (
    <Section title={title}>
      {filterByQuery(list).length === 0 ? (
        <PlaceholderCard
          title={`No ${title.toLowerCase()} found`}
          description="Try another search."
        />
      ) : (
        <div className="h-80 overflow-y-auto pr-2">
          {filterByQuery(list).map((u) => (
            <UserRow
              key={u.id}
              id={u.id}
              name={`${u.first_name} ${u.last_name}`}
              subtitle={`${u.username ?? ""} | ${u.email ?? ""}`}
              status={u.status}
              onMessage={() => openMessage(u.email)}
              onDetails={() => showDetails(u, roleLabel)}
              onStatusChange={(updated) =>
                setUsers((prev) =>
                  prev.map((x) => (x.id === updated.id ? updated : x))
                )
              }
            />
          ))}
        </div>
      )}
    </Section>
  );

  return (
    <div className="w-full">
      <div className="mb-4 rounded-xl bg-white p-6 shadow text-center">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
          User Management
        </div>
        <div className="flex justify-center">
          <SearchBar
            placeholder="Username | Email"
            value={query}
            onChange={setQuery}
            onSearch={() => {}}
          />
        </div>
      </div>

      {renderUserSection("Admins", admin, "Admin")}
      {renderUserSection("Employers", employer, "Employer")}
      {renderUserSection("Advisors", advisor, "Advisor")}
      {renderUserSection("Normal Users", normal, "Member")}

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
