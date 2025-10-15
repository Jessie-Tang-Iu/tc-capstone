"use client";

import Navbar from "@/app/components/BlankNavBar";
import EmployerSidebar from "@/app/components/employerDashboard/EmployerSideBar";
import MessagePage from "@/app/components/MessagePage"; // <- your table component

const MOCK_MESSAGES = [
  {
    id: 1,
    name: "John Doe",
    message: "Sure! You can see my available time on the booking management",
    date: "Jun 15, 2025",
  },
  ...Array.from({ length: 49 }, (_, i) => ({
    id: i + 2,
    name: `Joy Wong ${i + 1}`,
    message: "Yes, you are right about the job application, I will have a …",
    date: "Jun 15, 2025",
  })),
];

export default function EmployerMessagePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Employer DashBoard
        </h1>

        <div className="flex gap-6">
          {/* Sidebar */}
          <EmployerSidebar />

          {/* Main message panel */}
          <div className="flex-1">
            <MessagePage messageList={MOCK_MESSAGES} />
          </div>
        </div>
      </main>
    </div>
  );
}
