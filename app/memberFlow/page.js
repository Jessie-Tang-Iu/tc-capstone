"use client";

import Navbar from "../components/MemberNavBar";
import Link from "next/link";
import { useUserContext } from "../context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function PageContent() {

  const { user, role } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("User's role: ", role);
    }
    console.log("User: ", user);
  }, []);
  
  return (
    <>
      <Navbar />
      {/* Page content */}
      <main className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
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
