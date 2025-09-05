"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/app/components/NavBarBeforeSignIn";
import AdminSideBar from "@/app/components/adminDashboard/AdminSideBar";
import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import UserRow from "@/app/components/adminDashboard/UserRow";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import ChatWindow from "@/app/components/ChatWindow";
import usersData from "@/app/data/userForAdminPage.json" assert { type: "json" };

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [chatTo, setChatTo] = useState("");

  // initialize from JSON
  const [normal, setNormal] = useState(usersData.normal || []);
  const [employer, setEmployer] = useState(usersData.employer || []);

  const filteredNormal = useMemo(
    () =>
      normal.filter((u) => u.name.toLowerCase().includes(query.toLowerCase())),
    [normal, query]
  );

  const filteredEmployer = useMemo(
    () =>
      employer.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
      ),
    [employer, query]
  );

  const toggleBan = (listSetter, list, id) => {
    listSetter(
      list.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u))
    );
  };

  const openMessage = (name) => {
    setChatTo(name);
    setOpenChat(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Admin DashBoard
        </h1>

        <div className="flex gap-6">
          <AdminSideBar />

          <div className="flex-1">
            {/* Header: centered title, search on its own row */}
            <div className="mb-4 rounded-xl bg-white p-6 shadow text-center">
              <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
                User Management
              </div>
              <div className="flex justify-center">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSearch={() => {}}
                />
              </div>
            </div>

            {/* Normal Users */}
            <Section title="Normal User">
              {filteredNormal.length === 0 ? (
                <PlaceholderCard
                  title="No users found"
                  description="Try another search."
                />
              ) : (
                <div className="h-80 overflow-y-auto pr-2">
                  {filteredNormal.map((u) => (
                    <UserRow
                      key={u.id}
                      name={u.name}
                      subtitle={u.subtitle}
                      isBanned={u.banned}
                      onMessage={() => openMessage(u.name)}
                      onDetails={() => console.log("details", u.id)}
                      onBanToggle={() => toggleBan(setNormal, normal, u.id)}
                    />
                  ))}
                </div>
              )}
            </Section>

            {/* Employers */}
            <Section title="Employer">
              {filteredEmployer.length === 0 ? (
                <PlaceholderCard
                  title="No employers found"
                  description="Try another search."
                />
              ) : (
                <div className="h-80 overflow-y-auto pr-2">
                  {filteredEmployer.map((u) => (
                    <UserRow
                      key={u.id}
                      name={u.name}
                      subtitle={u.subtitle}
                      isBanned={u.banned}
                      onMessage={() => openMessage(u.name)}
                      onDetails={() => console.log("details", u.id)}
                      onBanToggle={() => toggleBan(setEmployer, employer, u.id)}
                    />
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>

        {openChat && (
          <ChatWindow
            recipient={chatTo}
            onClose={() => setOpenChat(false)}
            onSend={(text) => console.log("send:", { to: chatTo, text })}
          />
        )}
      </main>
    </div>
  );
}
