"use client";

import Navbar from "./components/NavBar";
import Link from "next/link";
import { useUserContext } from "./context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function PageContent() {

  const { user, getCurrentSession, } = useUserContext();

  const router = useRouter();

  useEffect(() => {
    getCurrentSession();
  }, []);

  useEffect (() => {
    if (user)
      switch (user.role) {
        case "admin":
          router.push("/adminDashboard");
          break;
        case "member":
          router.push("/memberFlow");
          break;
        case "employer":
          router.push("/employerDashboard/application");
          break;
        case "advisor":
          router.push("/advisorDashboard");
         break;
      }
  }, [user])
  
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
