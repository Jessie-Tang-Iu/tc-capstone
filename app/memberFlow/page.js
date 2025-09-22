"use client";

import MemberNavbar from "../components/MemberNavBar";
import Link from "next/link";
import { useUserContext } from "../context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MessagePage from "../components/MessagePage";
import { useUser } from "@clerk/nextjs";

function PageContent() {
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  useEffect(() => {
    console.log("User: ", user);
  }, [user]);

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
      name: `User Dummy ${i + 1}`,
      message: "Yes, you are right about the job application, i will have a …",
      date: "Jun 15, 2025",
    })),
  ];

  if (!isLoaded) return <p>Loading...</p>;

  if (!isSignedIn) {
    router.push("/signIn"); 
  }

  return (
    <>
      {/* Navigation */}
      <MemberNavbar />

      {/* Page content */}
      <main className="bg-gray-100 min-h-screen">
        {/* <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
            Welcome to Tech Connect Alberta
          </h1>
          <p className="text-center text-gray-700">
            Connect with your community and explore upcoming events.
          </p>
          <Link
            href="/testing"
            className="block text-center mt-6 text-blue-600 hover:underline"
          >
            Go to Testing Page
          </Link>
        </div> */}

        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-[#E55B3C]">
              Welcome back{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              This is your personal message box. Stay connected and manage your
              conversations easily.
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
