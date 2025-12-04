"use client";

import { useSession } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function PostLogin() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      if (!session) return; // Clerk session not ready yet

      try {
        const token = await session.getToken({ template: "roleAuth" });
        if (!token) return;

        const decoded = jwtDecode(token);
        const role = decoded.role;

        if (role === "advisor") {
          router.replace("/advisorDashboard");
        } else if (role === "employer") {
          router.replace("/employerDashboard/message");
        } else if (role === "member") {
          router.replace("/memberFlow");
        } else if (role === "admin") {
          router.replace("/adminDashboard");
        } else {
          router.replace("/"); // fallback
        }
      } catch (err) {
        console.error("Error decoding roleAuth token:", err);
        router.replace("/"); // fallback
      }
    };

    redirectUser();
  }, [session, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-600">
        Redirecting you to your dashboard...
      </p>
    </div>
  );
}
