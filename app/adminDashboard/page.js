// app/adminDashboard/page.js
"use client";

import { useState } from "react";
import Navbar from "../components/NavBarBeforeSignIn";
import MessagePage from "../components/MessagePage";
import UsersPanel from "@/app/adminDashboard/User";
import RequestsPanel from "@/app/adminDashboard/Request";
import ReportsPanel from "@/app/adminDashboard/Report";
import UserDetailsCard from "../components/adminDashboard/UserDetailsCard";

export default function AdvisorDashboard() {
  const [tab, setTab] = useState("message");
  // when null -> show UsersPanel; otherwise show UserDetailsCard
  const [details, setDetails] = useState(null); // { user, roleLabel } | null

  const TabBtn = ({ v, children }) => (
    <button
      value={v}
      onClick={(e) => {
        setTab(e.currentTarget.value);
        setDetails(null); // ← reset detail view when switching tabs
      }}
      className={`w-full text-left rounded-md px-4 py-3 text-sm font-medium transition
        text-black hover:bg-[#F0E0D5] ${tab === v ? "bg-[#E2B596]" : ""}`}
    >
      {children} <span className="ml-1">{">"}</span>
    </button>
  );

  const MOCK_MESSAGES = [
    { id: 1, name: "John Doe", message: "…", date: "Jun 15, 2025" },
    ...Array.from({ length: 49 }, (_, i) => ({
      id: i + 2,
      name: `Dummy ${i + 1}`,
      message: "Yes, you are right about the job application, i will have a …",
      date: "Jun 15, 2025",
    })),
  ];

  const renderUsers = () =>
    details?.type === "user" ? (
      <UserDetailsCard
        user={details.data.user}
        roleLabel={details.data.roleLabel}
        onClose={() => setDetails(null)}
      />
    ) : (
      <UsersPanel
        onShowDetails={({ user, roleLabel }) =>
          setDetails({ type: "user", data: { user, roleLabel } })
        }
      />
    );

  const renderReports = () =>
    details?.type === "report" ? (
      <UserDetailsCard
        user={{
          name: details.data.reporter,
          id: details.data.id,
          subtitle: details.data.issue,
          email: "—",
          location: details.data.category,
          banned: false,
        }}
        roleLabel={`Report #${details.data.reportId}`}
        onClose={() => setDetails(null)}
      />
    ) : (
      <ReportsPanel onShowDetails={(payload) => setDetails(payload)} />
    );

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto w-full max-w-8xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Admin DashBoard
        </h1>

        <div className="flex flex-row gap-6">
          {/* Sidebar */}
          <div className="ml-0 w-60 rounded-lg bg-white p-1 flex flex-col shadow">
            <TabBtn v="message">Message</TabBtn>
            <TabBtn v="users">Users</TabBtn>
            <TabBtn v="requests">Requests</TabBtn>
            <TabBtn v="reports">Reports</TabBtn>
            <TabBtn v="events">Events</TabBtn>
          </div>

          {/* Main area */}
          <div className="w-full">
            {tab === "message" && <MessagePage messageList={MOCK_MESSAGES} />}
            {tab === "users" && renderUsers()}
            {tab === "requests" && <RequestsPanel />}
            {tab === "reports" && <ReportsPanel />}
          </div>
        </div>
      </div>
    </main>
  );
}
