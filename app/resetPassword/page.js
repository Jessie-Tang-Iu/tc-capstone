"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { updatePassword, getAccessToken } from "@/lib/supabase_auth";
import Navbar from "../components/NavBarBeforeSignIn";
import { useRouter } from "next/navigation";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionRestored, setSessionRestored] = useState(false);
    const router = useRouter();

    // Extract tokens from URL fragment and set the session
    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.slice(1)); // remove '#'

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
            supabase.auth
            .setSession({ access_token, refresh_token })
            .then(({ error }) => {
                if (error) {
                setError("Failed to restore session.");
                } else {
                setSessionRestored(true);
                }
            });
        } else {
            setError("Missing access or refresh token in URL.");
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setStatus("");
        setError("");
        setLoading(true);

        const token = await getAccessToken();
        if (!token) {
        setError("Session still missing.");
        setLoading(false);
        return;
        }

        try {
            await updatePassword(password);
            setStatus("Password updated successfully!");
        
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
        <form 
            onSubmit={handleUpdate}
            className="flex flex-col items-center mt-10 gap-4"
        >
            <h1 className="text-5xl text-[#DD5B45] text-center font-bold mt-20 mb-2">Trouble With Logging In?</h1>
            <p className="text-black text-center mb-10">Enter your email so that we can send you the reset password link</p>
            <div className="flex flex-col text-black">
                <label>Enter Your New Password</label>
                <input
                    type="password"
                    required
                    placeholder="New password"
                    className="px-2 py-1 mb-3 w-72 rounded border border-black focus:bg-orange-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!sessionRestored}
                />

                <button 
                    type="submit" 
                    className={`rounded px-3 py-2 w-72 text-white
                        ${loading || !sessionRestored
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black hover:bg-green-500 active:bg-amber-400"
                        }`}
                    disabled={loading || !sessionRestored}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </div>
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

export default ResetPassword;
