"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import Navbar from "./components/NavBarBeforeSignIn";
import Link from "next/link";

function PageContent() {
  const { isLoaded, sessionId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (sessionId) {
      router.replace("/post-login");
    }
  }, [isLoaded, sessionId, router]);

  return (
    <>
      <Navbar />
      {/* Page content for signed-out users */}
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
  return <PageContent />;
}
