"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { jwtDecode } from "jwt-decode";

const withAdminAuth = (WrappedComponent) => {
  const AdminAuthChecker = (props) => {
    const { session, isLoaded } = useSession();
    const router = useRouter();

    const [authStatus, setAuthStatus] = useState("loading");

    const checkAdminRole = useCallback(async () => {
      if (!isLoaded) return;

      if (!session) {
        setAuthStatus("unauthorized");
        return;
      }

      try {
        const token = await session.getToken({ template: "roleAuth" });
        if (!token) {
          setAuthStatus("unauthorized");
          return;
        }

        const decoded = jwtDecode(token);
        const role = decoded.role;

        if (role === "admin") {
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
      checkAdminRole();
    }, [checkAdminRole]);

    if (authStatus === "loading" || !isLoaded) {
      return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8eae2] to-white">
          <p className="text-xl font-medium text-gray-700">
            Checking administrator access...
          </p>
        </main>
      );
    }

    if (authStatus === "unauthorized") {
      return (
        <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8eae2] to-white">
          <div className="text-center p-10 bg-white rounded-lg shadow-xl">
            <h1 className="text-4xl font-bold text-[#DD5B45] mb-4">
              Unauthorized Access
            </h1>
            <p className="text-gray-600">
              You do not have the necessary permissions to view this page.
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

    return <WrappedComponent {...props} />;
  };

  AdminAuthChecker.displayName = `withAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return AdminAuthChecker;
};

export default withAdminAuth;
