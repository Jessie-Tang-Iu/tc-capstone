// app/adminDashboard/page.js
/*
data need to change to postgres db
- users
- reports
- events (DONE)
- requests
- messages (DONE)
*/
"use client";

import { useState } from "react";
import Navbar from "../components/NavBarBeforeSignIn";
import MessagePage from "../components/MessagePage";
import UsersPanel from "@/app/adminDashboard/User";
import RequestsPanel from "@/app/adminDashboard/Request";
import ReportsPanel from "@/app/adminDashboard/Report";
import UserDetailsCard from "../components/adminDashboard/UserDetailsCard";
import EventPanel from "@/app/adminDashboard/Event";
import RequestDetailsCard from "@/app/components/adminDashboard/RequestDetailsCard";
import ReportDetailsCard from "@/app/components/adminDashboard/ReportDetailsCard";

const ME = "11111111-1111-1111-1111-111111111111";

export default function AdminDashboard() {
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

  const renderRequests = () =>
    details?.type === "request" ? (
      <RequestDetailsCard
        request={details.data}
        onClose={() => setDetails(null)}
      />
    ) : (
      <RequestsPanel
        onShowDetails={(request) =>
          setDetails({ type: "request", data: request })
        }
      />
    );

  const renderReports = () =>
    details?.type === "report" ? (
      <ReportDetailsCard
        report={details.data}
        onClose={() => setDetails(null)}
        onBan={(r) => console.log("Ban user:", r.reporter)}
        onRemove={(r) => console.log("Remove report:", r.reportId)}
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
            {tab === "message" && <MessagePage currentUserId={ME} />}
            {tab === "users" && renderUsers()}
            {tab === "requests" && renderRequests()}
            {tab === "reports" && renderReports()}
            {tab === "events" && <EventPanel />}
          </div>
        </div>
      </div>
    </main>
  );
}
