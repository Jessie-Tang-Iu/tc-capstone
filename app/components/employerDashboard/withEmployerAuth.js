"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { jwtDecode } from "jwt-decode";

const withEmployerAuth = (WrappedComponent) => {
  const EmployerAuthChecker = (props) => {
    const { session, isLoaded } = useSession();
    const router = useRouter();

    const [authStatus, setAuthStatus] = useState("loading");

    const checkEmployerRole = useCallback(async () => {
      if (!isLoaded) return;

      if (!session) {
        setAuthStatus("unauthorized");
        return;
      }

      try {
        // Retrieve the token with the custom role claims
        const token = await session.getToken({ template: "roleAuth" });
        if (!token) {
          setAuthStatus("unauthorized");
          return;
        }

        // Decode the token to get the role claim
        const decoded = jwtDecode(token);
        const role = decoded.role;

        // --- CHECK FOR EMPLOYER ROLE ---
        if (role === "employer") {
          setAuthStatus("authorized");
        } else {
          setAuthStatus("unauthorized");
        }
      } catch (err) {
        console.error("Clerk role check failed:", err);
        setAuthStatus("unauthorized");
      }
    }, [isLoaded, session]);

    useEffect(() => {
      checkEmployerRole();
    }, [checkEmployerRole]);

    // --- Loading State ---
    if (authStatus === "loading" || !isLoaded) {
      return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8eae2] to-white">
          <p className="text-xl font-medium text-gray-700">
            Checking employer access...
          </p>
        </main>
      );
    }

    // --- Unauthorized State ---
    if (authStatus === "unauthorized") {
      return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8eae2] to-white">
          <div className="text-center p-10 bg-white rounded-lg shadow-xl">
            <h1 className="text-4xl font-bold text-[#DD5B45] mb-4">
              Unauthorized Access
            </h1>
            <p className="text-gray-600">
              You must be logged in as an Employer to view this page.
            </p>
            <button
              onClick={() => router.push("/signIn")}
              className="mt-6 px-4 py-2 bg-[#E55B3C] text-white rounded hover:bg-[#DD5B45] transition cursor-pointer"
            >
              Go to Login Page
            </button>
          </div>
        </main>
      );
    }

    // --- Authorized State ---
    return <WrappedComponent {...props} />;
  };

  EmployerAuthChecker.displayName = `withEmployerAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return EmployerAuthChecker;
};

export default withEmployerAuth;
