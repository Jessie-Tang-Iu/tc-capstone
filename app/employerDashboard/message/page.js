"use client";

import Navbar from "@/app/components/EmployerNavBar";
import EmployerSidebar from "@/app/components/employerDashboard/EmployerSideBar";
import MessagePage from "@/app/components/MessagePage";
import { useUser } from "@clerk/nextjs";

export default function EmployerMessagePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    // router.push("/");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#f8eae2] to-white">
      <Navbar />

      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[#DD5B45]">
          Employer DashBoard
        </h1>

        <div className="flex gap-6">
          {/* Sidebar */}
          <EmployerSidebar />

          {/* Main message panel */}
          <div className="flex-1">
            {user && <MessagePage currentUserId={user.id} />}
          </div>
        </div>
      </main>
    </div>
  );
}
