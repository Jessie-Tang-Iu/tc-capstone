"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/supabase_auth";
import { ensureProfile } from "@/lib/user_crud";
import { useUserContext } from "@/app/context/userContext";

export default function SupabaseAuth() {
  const { user, setUser, email, setEmail, setRole } = useUserContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // read from query params once
  const qpEmail = searchParams.get("email") || "";
  const qpPassword = searchParams.get("password") || "";

  // controlled inputs (editable)
  // const [email, setEmail] = useState(qpEmail);
  const [password, setPassword] = useState(qpPassword);

  // local profile state
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState("");
  // const [role, setRole] = useState("");

  // ui
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const [profile, setProfile] = useState(null);

  // if query params change (rare), sync once
  useEffect(() => {
    setEmail(qpEmail);
    setPassword(qpPassword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qpEmail, qpPassword]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1) authenticate (creates session)
      console.log("Logging in with:", { email, password });
      await signIn(email, password);

      // 2) ensure there is a profile (creates minimal one if missing)
      const p = await ensureProfile({
        username: (email || "").trim().toLowerCase().split("@")[0] || "",
        status: "active",
      });

      if (!p) {
        setError("Signed in, but profile could not be created due to RLS.");
        return;
      }

      // 3) reflect on UI
      setUser(p);
      setUsername(p.username || "");
      setFirstName(p.firstName || "");
      setLastName(p.lastName || "");
      setStatus(p.status || "");
      setRole(p.role || "member");

      // 4) redirect
      switch (p.role) {
        case "admin":
          router.push("/adminFlow");
          break;
        case "member":
          router.push("/memberFlow");
          break;
        case "employer":
          router.push("/employerFlow");
          break;
        case "advisor":
          router.push("/advisorFlow");
          break;
      }
      console.log(p);
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setStatus(user.status || "");
      setRole(user.role || "member");
    }
    console.log("Current user:", user);
  }, [user]);

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleAuth}>
        <div className="bg-[#F3E1D5] rounded-2xl p-10 flex flex-row lg:w-250 justify-center items-center">
          <div className="text-[#DD5B45] font-bold p-5 flex-2/3">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="w-40 h-40 rounded-2xl shadow-2xl mb-7 mx-auto"
            />
            <p className="text-5xl">Hello!</p>
            <p className="text-2xl">Community.</p>
            <p className="text-2xl">Purpose.</p>
            <p className="text-2xl mb-10">People First.</p>
            <p className="text-black font-normal">
              Imagine a world where Tech Talent, Job Seeker, and Entrepreneurs
              support each other
            </p>
          </div>

          <div className="w-px bg-gray-400 h-130 mx-4" />

          <div className="p-5 flex-1/3">
            <p className="text-black font-bold text-2xl mb-5">Welcome Back!</p>
            <p className="text-black text-sm">
              Do not have an account?{" "}
              <Link href="/signUp" className="underline hover:text-blue-400">
                Create an account now
              </Link>
            </p>
            <p className="text-black text-sm mb-2">It is FREE!</p>

            {error ? <p className="text-red-600 font-bold">{error}</p> : null}

            <div className="flex flex-col">
              <label className="text-black">Email Address</label>
              <input
                required
                type="email"
                className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100 text-black"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-black">Password</label>
              <input
                required
                type="password"
                className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100 text-black"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded px-3 py-2 w-72 hover:bg-green-500 active:bg-amber-400 disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-gray-600 text-sm mt-2 text-center">
              Forget Password?{" "}

              <Link href="/forgetPassword" className="underline hover:text-blue-400">
                Click Here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
