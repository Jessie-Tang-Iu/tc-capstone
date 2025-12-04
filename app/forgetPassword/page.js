"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/NavBarBeforeSignIn";
import Link from "next/link";
import { useAuth, useSignIn } from "@clerk/nextjs";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('')
  const [success, setSuccess] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  if (!isLoaded) {
    return null
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then((_) => {
        setSuccess(true);
        setLoading(false);
      })
      .catch ((err) => {
        console.log("Reset error: ", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
        setLoading(false);
      })
    };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true)
        } else if (result.status === 'complete') {
          // Set the active session to the newly created session (user is now signed in)
          setActive({
            session: result.createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Check for tasks and navigate to custom UI to help users resolve them
                // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                console.log(session?.currentTask)
                return
              }
              router.push('/')
              setLoading(false);
            },
          })
        } else {
          console.log(result)
        }

      })
      .catch((err) => {
        console.log('Create new password - error: ', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
        setLoading(false);
      })
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <Navbar />
      <Link href='/signIn'>
        <p className="text-black text-[18px] m-15 cursor-pointer underline hover:text-blue-400"> &lt; Back to Sign In</p>
      </Link>
      <form 
        onSubmit={!success ? handleReset : handleCreate}
        className="flex flex-col items-center mt-10 gap-4"
      >
        <h1 className="text-5xl text-[#DD5B45] text-center font-bold mt-20 mb-2">Trouble With Logging In?</h1>
        <p className="text-black text-center mb-10">Enter your email so that we can send you the reset password link</p>
        
        {!success && (
          <>
            <div className="flex flex-col text-black">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="Your email"
                className="px-2 py-1 mb-3 w-72 rounded border border-black focus:bg-orange-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
                
          <button 
            type="submit"
            className="bg-black text-white rounded px-3 py-2 w-72 hover:bg-green-500 active:bg-amber-400 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Loading..." : "Send password reset code"}
          </button>
          </>
        )}
            
        {success && (
          <>
            <div className="flex flex-col text-black">
              <label>Enter Your New Password</label>
              <input
                type="password"
                required
                placeholder="New password"
                className="px-2 py-1 mb-3 w-72 rounded border border-black focus:bg-orange-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // disabled={!sessionRestored}
              />
              <label>Enter the password reset code that was sent to your email</label>
              <input
                type="text"
                required
                className="px-2 py-1 mb-3 w-72 rounded border border-black focus:bg-orange-100"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                // disabled={!sessionRestored}
              />

              <button 
                type="submit" 
                className={`rounded px-3 py-2 w-72 text-white
                  ${loading 
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-green-500 active:bg-amber-400"
                  }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {secondFactor && <p>2FA is required, but this UI does not handle that</p>}
      </form>
    </main>
        
  );
}

export default ForgetPassword;
