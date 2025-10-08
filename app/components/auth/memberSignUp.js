"use client";

import { useSignUp } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ClerkSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { getToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      // Create user
      const result = await signUp.create({
        emailAddress: email,
        password,
        username,
        firstName,
        lastName,
      });

      if (result.status === "complete") {
        // Activate the session first
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
        }

        const token = await getToken({ template: "backend" }); 

        await fetch("/api/users/metadata", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
           },
          body: JSON.stringify({
            role: "employer",
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phoneNumber,
          }),
        });

        router.push("/"); // redirect after everything is done
      } else {
        setError("Unexpected signup state: " + result.status);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.errors ? err.errors[0].message : err.message);
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
          {error && <p className="text-red-600 font-bold">{error}</p>}

          <div className="text-black">
            {/* Email + Password */}
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <label>Email Address</label>
                <input
                  required
                  type="email"
                  className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div className="flex flex-col">
                <label>Password</label>
                <input
                  required
                  type="password"
                  className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            {/* Name fields */}
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <label>First Name</label>
                <input
                  required
                  type="text"
                  className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>

              <div className="flex flex-col">
                <label>Last Name</label>
                <input
                  required
                  type="text"
                  className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col">
              <label>Username</label>
              <input
                required
                type="text"
                className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            {/* Clerk CAPTCHA */}
            <div id="clerk-captcha" className="my-4"></div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded px-3 py-2 w-72 mt-6 hover:bg-green-500 active:bg-amber-400 mx-auto block disabled:opacity-60"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            {/* Redirect link */}
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
