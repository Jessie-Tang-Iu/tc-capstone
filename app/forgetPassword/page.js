"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/supabase_auth";
import Navbar from "../components/NavBarBeforeSignIn";
import Link from "next/link";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setStatus("");
        setLoading(true);

        try {
            await resetPassword(email.trim(), {
                redirectTo: "http://localhost:3000/reset-password", // Change if deployed
            });
            setStatus("Reset link sent! Check your email.");
        } catch (error) {
            console.log("Reset error: " || error);
            setError(error?.message || String(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setStatus("");
        router.push("/signIn");
    };

    return (
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <Link href='/signIn'>
                <p className="text-black text-[18px] m-15 cursor-pointer underline hover:text-blue-400"> &lt; Back to Sign In</p>
            </Link>
            <form 
                onSubmit={handleReset}
                className="flex flex-col items-center mt-10 gap-4"
            >
            
            <h1 className="text-5xl text-[#DD5B45] text-center font-bold mt-20 mb-2">Trouble With Logging In?</h1>
            <p className="text-black text-center mb-10">Enter your email so that we can send you the reset password link</p>
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
                {loading ? "Loading..." : "Send Reset Email"}</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {status && (
                <div className="bg-white rounded p-6 max-w-sm text-center shadow-lg">
                    <p className="mb-4 text-black">{status}</p>
                    <button
                    onClick={handleCloseModal}
                    className="bg-[#DD5B45] text-white px-4 py-2 rounded hover:bg-[#bb4e39]"
                    >
                    Close
                    </button>
                </div>
            )}
            
            </form>
        </main>
        
    );
}

export default ForgetPassword;
