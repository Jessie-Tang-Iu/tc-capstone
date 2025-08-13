"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/supabase_auth";
import { addUser } from "@/lib/user_crud";

export default function SupabaseAuthSignUp() {
  const router = useRouter();

  // form
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // ui
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();

    if (!username || !firstName || !lastName || !email || !password) {
      setError("* All required fields must be filled.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1) Sign up and pass minimal metadata (no birth/shortBio)
      const data = await signUp(email, password, {
        data: { firstName, lastName, username, phone },
      });

      // If email confirmations are ON, no session yet -> skip DB insert here
      if (!data?.session) {
        // Keep local setters per your requirement
        setUsername(username);
        setLastName(lastName);
        router.push(
          `/signIn?email=${encodeURIComponent(
            email
          )}&password=${encodeURIComponent(password)}`
        );
        return;
      }

      // 2) Confirmations OFF -> we have a session, insert profile now (RLS-safe)
      await addUser({
        username,
        firstName,
        lastName,
        status: "active",
        // phone optional in your table mapping; include only if you store it
        // If your table doesn't have phone, remove the next line
        // phone,
      });

      // Keep local setters per your requirement
      setUsername(username);
      setLastName(lastName);

      router.push("/signIn");
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={registerUser}>
        <div className="bg-[#F3E1D5] rounded-2xl p-10 lg:w-200 justify-center items-center">
          <h1 className="text-[#DD5B45] text-2xl font-bold mb-7">
            Required Information
          </h1>
          {error ? <p className="text-red-600 font-bold">{error}</p> : null}

          <div className="text-black">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="text-black">Email Address</label>
                <input
                  required
                  type="email"
                  className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
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
                  className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="text-black">First Name</label>
                <input
                  required
                  type="text"
                  className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black">Last Name</label>
                <input
                  required
                  type="text"
                  className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <label className="text-black">Username</label>
                <input
                  required
                  type="text"
                  className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-black">Phone Number</label>
                <input
                  type="tel"
                  className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100"
                  placeholder="1234567890"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded px-3 py-2 w-72 mt-6 hover:bg-green-500 active:bg-amber-400 mx-auto block disabled:opacity-60"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <p className="text-black text-sm mt-4 text-center">
              Already have an account?{" "}
              <Link href="/signIn" className="underline hover:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
