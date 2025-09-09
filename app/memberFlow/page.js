"use client";

import Navbar from "../components/MemberNavBar";
import Link from "next/link";
import { useUserContext } from "../context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MessagePage from "../components/MessagePage";

function PageContent() {

  const { user, role } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("User's role: ", role);
    }
    console.log("User: ", user);
  }, []);

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
  
  return (
    <>
      <Navbar />
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

        <div className="p-10">
          <MessagePage messageList={MOCK_MESSAGES} />
        </div>
        
      </main>
    </>
  );
}

export default function Page() {
  return (
    <PageContent />
  );
}
