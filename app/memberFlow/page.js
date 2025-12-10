"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import MemberNavbar from "../components/MemberNavBar";
import MessagePage from "../components/MessagePage";

function PageContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/signIn");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    return null;
  }

  if (!user) {
    return <p>Loading user data...</p>;
  }

  const userID = user.id;

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
              {user.firstName ? `, ${user.firstName}` : ""}!
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              This is your personal message box. Stay connected and manage your
              conversations easily.
            </p>
          </div>

          {/* Message Section */}
          <section className="rounded-xl bg-white shadow-md p-6">
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Messages
            </h2> */}
            <MessagePage currentUserId={userID} />
          </section>
        </div>
      </main>
    </>
  );
}

export default function Page() {
  return <PageContent />;
}
