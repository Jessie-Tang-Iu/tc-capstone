"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MessagePage from "../components/MessagePage";
import UsersPanel from "@/app/adminDashboard/User";
import RequestsPanel from "@/app/adminDashboard/Request";
import ReportsPanel from "@/app/adminDashboard/Report";
import UserDetailsCard from "../components/adminDashboard/UserDetailsCard";
import EventsPanel from "@/app/adminDashboard/Event";
import Navbar from "@/app/components/AdminNavBar";
import RequestDetailsCard from "../components/adminDashboard/RequestDetailsCard";
import ReportDetailsCard from "../components/adminDashboard/ReportDetailsCard";
import withAdminAuth from "../components/adminDashboard/withAdminAuth";
import CoursePage from "@/app/adminDashboard/Courses";

const ME = "11111111-1111-1111-1111-111111111111";

function AdminDashboardCore() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState(() => searchParams.get("tab") || "message");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const current = params.get("tab");
    if (tab !== current) {
      params.set("tab", tab);
      const href = window.location.pathname + "?" + params.toString();
      router.push(href, { scroll: false });
    }
  }, [tab]);

  useEffect(() => {
    const syncFromUrl = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get("tab") || "message";
      setTab((prev) => (prev !== t ? t : prev));
      setDetails(null);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const TabBtn = ({ v, children }) => (
    <button
      value={v}
      onClick={(e) => {
        setTab(e.currentTarget.value);
        setDetails(null);
      }}
      className={`w-full text-left rounded-md px-4 py-3 text-sm font-medium transition
        text-black hover:bg-[#F0E0D5] ${tab === v ? "bg-[#E2B596]" : ""}`}
    >
      {children} <span className="ml-1">{">"}</span>
    </button>
  );

  const pushParams = (mutator) => {
    const params = new URLSearchParams(window.location.search);
    mutator(params);
    router.push(window.location.pathname + "?" + params.toString(), {
      scroll: false,
    });
  };

  const openUserDetails = ({ user, roleLabel }) => {
    pushParams((p) => {
      p.set("tab", "users");
      p.set("userId", user.id);
    });
    setDetails({ type: "user", user, roleLabel });
  };

  const openRequestDetails = (request) => {
    pushParams((p) => {
      p.set("tab", "requests");
      p.set("requestId", request.id);
    });
    setDetails({ type: "request", data: request });
  };

  const openReportDetails = (report) => {
    const rid = report.reportId ?? report.id;
    pushParams((p) => {
      p.set("tab", "reports");
      p.set("reportId", String(rid));
    });
    setDetails({ type: "report", data: report });
  };

  const closeDetails = () => {
    pushParams((p) => {
      p.delete("userId");
      p.delete("requestId");
      p.delete("reportId");
    });
    setDetails(null);
  };

  const renderUsers = () =>
    details?.type === "user" ? (
      <UserDetailsCard
        user={details.user}
        roleLabel={details.roleLabel}
        onClose={closeDetails}
      />
    ) : (
      <UsersPanel onShowDetails={openUserDetails} />
    );

  const renderRequests = () =>
    details?.type === "request" ? (
      <RequestDetailsCard request={details.data} onClose={closeDetails} />
    ) : (
      <RequestsPanel onShowDetails={openRequestDetails} />
    );

  const renderReports = () =>
    details?.type === "report" ? (
      <ReportDetailsCard
        report={details.data}
        onClose={closeDetails}
        onBan={(r) => console.log("Ban user:", r.reporter)}
        onRemove={(r) => console.log("Remove report:", r.reportId)}
      />
    ) : (
      <ReportsPanel onShowDetails={openReportDetails} />
    );

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white">
      <Navbar />

      <div className="mx-auto w-full max-w-8xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Admin DashBoard
        </h1>

        <div className="flex flex-row gap-6">
          <div className="ml-0 w-60 rounded-lg bg-white p-1 flex flex-col shadow">
            <TabBtn v="message">Message</TabBtn>
            <TabBtn v="users">Users</TabBtn>
            <TabBtn v="requests">Requests</TabBtn>
            <TabBtn v="reports">Reports</TabBtn>
            <TabBtn v="events">Events</TabBtn>
            <TabBtn v="courses">Courses</TabBtn>
          </div>

          <div className="w-full">
            {tab === "message" && <MessagePage currentUserId={ME} />}
            {tab === "users" && renderUsers()}
            {tab === "requests" && renderRequests()}
            {tab === "reports" && renderReports()}
            {tab === "events" && <EventPanel />}
            {tab === "courses" && <CoursePage />}
          </div>
        </div>
      </div>
    </main>
  );
}

const WrappedAdminDashboardCore = withAdminAuth(AdminDashboardCore);

export default function AdminDashboard() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <WrappedAdminDashboardCore />
    </Suspense>
  );
}
