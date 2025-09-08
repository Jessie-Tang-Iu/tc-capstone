"use client";

import Navbar from "./components/NavBar";
import Link from "next/link";
import { getSession } from "@/lib/supabase_auth";
import { useUserContext } from "./context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserByEmail } from "@/lib/user_crud";

function PageContent() {

  const { setUser, setEmail } = useUserContext();

  const router = useRouter();

  const getCurrentSession = async () => {
    try {
      const session = await getSession();
      setEmail(session?.user?.email || '');
      if (!session) { 
        router.push('/signIn');
      } else {
        const p = await getUserByEmail(session?.user?.email);
        if (!p) {
          setError("Signed in, but profile could not be created due to RLS.");
          return;
        }

        // reflect on UI
        setUser(p);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      alert("Error", "Failed to fetch session. Please sign in again.");
    }
  };

  useEffect(() => {
    getCurrentSession();
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
