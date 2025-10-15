"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import MemberNavbar from "../components/MemberNavBar";
import MessagePage from "../components/MessagePage";

function PageContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/signIn");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    // Don’t render anything while redirecting
    return null;
  }

  const MOCK_MESSAGES = [
    {
      id: 1,
      name: "John Doe",
      message:
        "Sure! You can see my available time on the booking management",
      date: "Jun 15, 2025",
    },
    // dummy data → total 50 messages
    ...Array.from({ length: 49 }, (_, i) => ({
      id: i + 2,
      name: `User Dummy ${i + 1}`,
      message:
        "Yes, you are right about the job application, i will have a …",
      date: "Jun 15, 2025",
    })),
  ];

  return (
    <>
      {/* Navigation */}
      <MemberNavbar />

      {/* Page content */}
      <main className="bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-[#E55B3C]">
              Welcome back
              {user?.firstName ? `, ${user.firstName}` : ""}!
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              This is your personal message box. Stay connected and manage
              your conversations easily.
            </p>
          </div>

          {/* Message Section */}
          <section className="rounded-xl bg-white shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Messages
            </h2>
            <MessagePage messageList={MOCK_MESSAGES} />
          </section>
        </div>
      </main>
    </>
  );
}

export default function Page() {
  return <PageContent />;
}
