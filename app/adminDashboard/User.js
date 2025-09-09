// app/adminDashboard/User.js
"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/app/components/ui/SearchBar";
import Section from "@/app/components/adminDashboard/Section";
import UserRow from "@/app/components/adminDashboard/UserRow";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import ChatWindow from "@/app/components/ChatWindow";
import usersDataDefault from "@/app/data/userForAdminPage.json";

export default function UsersPanel({ data = usersDataDefault, onShowDetails }) {
  const [query, setQuery] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [chatTo, setChatTo] = useState("");

  const [normal, setNormal] = useState(data.normal || []);
  const [employer, setEmployer] = useState(data.employer || []);

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

  const showDetails = (user, roleLabel) => {
    if (onShowDetails) onShowDetails({ user, roleLabel });
  };

  return (
    <div className="w-full">
      <div className="mb-4 rounded-xl bg-white p-6 shadow text-center">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
          User Management
        </div>
        <div className="flex justify-center">
          <SearchBar value={query} onChange={setQuery} onSearch={() => {}} />
        </div>
      </div>

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
                onDetails={() => showDetails(u, "Normal User")} // ← HERE
                onBanToggle={() => toggleBan(setNormal, normal, u.id)}
              />
            ))}
          </div>
        )}
      </Section>

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
                onDetails={() => showDetails(u, "Employer")} // ← AND HERE
                onBanToggle={() => toggleBan(setEmployer, employer, u.id)}
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
