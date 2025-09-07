"use client";

import MessagePage from "../components/MessagePage";
import Navbar from "../components/NavBarBeforeSignIn";
import { useState } from "react";
import UsersPanel from "@/app/adminDashboard/User";
import RequestsPanel from "@/app/adminDashboard/Request";
import ReportsPanel from "@/app/adminDashboard/Report";

export default function AdvisorDashboard() {
  const [tab, setTab] = useState("users");

  const TabBtn = ({ v, children }) => (
    <button
      value={v}
      onClick={(e) => setTab(e.currentTarget.value)}
      className={`w-full text-left rounded-md px-4 py-3 text-sm font-medium transition
        text-black hover:bg-[#F0E0D5] ${tab === v ? "bg-[#E2B596]" : ""}`}
    >
      {children} <span className="ml-1"></span>
      {">"}
    </button>
  );

  const MOCK_MESSAGES = [
    {
      id: 1,
      name: "John Doe",
      message: "Sure! You can see my available time on the booking management",
      date: "Jun 15, 2025",
    },
    // dummy data → total 50 messages
    ...Array.from({ length: 49 }, (_, i) => ({
      id: i + 2,
      name: `Dummy ${i + 1}`,
      message: "Yes, you are right about the job application, i will have a …",
      date: "Jun 15, 2025",
    })),
  ];

  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto w-full max-w-8xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Advisor DashBoard
        </h1>

        <div className="flex flex-row">
          <div className="ml-0 w-60 h-57 rounded-lg bg-white p-1 flex flex-col shadow">
            {/*Advisor Side Bar*/}
            <TabBtn v="message">Message</TabBtn>
            <TabBtn v="users">Users</TabBtn>
            <TabBtn v="requests">Requests</TabBtn>
            <TabBtn v="reports">Reports</TabBtn>
          </div>

          <div className=" w-full ml-6">
            {tab === "message" && <MessagePage messageList={MOCK_MESSAGES} />}
            {tab === "users" && <UsersPanel />}
            {tab === "requests" && <RequestsPanel />}
            {tab === "reports" && <ReportsPanel />}
          </div>
        </div>
      </div>
    </main>
  );
}
