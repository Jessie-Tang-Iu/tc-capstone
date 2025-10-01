"use client";

import { useState } from "react";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "../components/NavBarBeforeSignIn";

export default function AdvisorRegister() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const { getToken } = useAuth();
    const router = useRouter();

    // form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [title, setTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");

    // ui
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const registerAdvisor = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
        setLoading(true);
        setError("");

        // Create Clerk account
        const result = await signUp.create({
            emailAddress: email,
            username,
            password,
            firstName,
            lastName,
        });

        if (result.status === "complete") {
            // Activate Clerk session
            if (result.createdSessionId) {
            await setActive({ session: result.createdSessionId });
            }

            // Optional: update metadata via API if needed
            const token = await getToken({ template: "backend" });
            await fetch("/api/users/metadata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                role: "advisor",
            }),
            });

            router.push("/advisorDashboard"); // redirect after signup
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
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <h1 className="text-4xl text-[#DD5B45] text-center font-bold mt-20 mb-2">Register as Advisor</h1>
            <p className="text-black text-center mb-10">Connect with Alberta top tech professionals.</p>
            <div className="flex justify-center items-center">
                <form onSubmit={registerAdvisor}>
                    <div className="bg-[#F3E1D5] rounded-2xl p-10 lg:w-200 justify-center items-center">
                        <h1 className="text-[#DD5B45] text-2xl font-bold">
                            Required Information
                        </h1>
                        <p className="text-black mb-7">* fields must be filled</p>
                        {error ? <p className="text-red-600 font-bold">{error}</p> : null}
                        <div className="text-black">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-col">
                                    <label className="text-black">First Name *</label>
                                    <input
                                        required
                                        type="text"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        value={firstName}
                                    />
                                    <label className="text-black">Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        placeholder="Email Address"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                    />
                                    <label className="text-black">Organization/ Company Name</label>
                                    <input
                                        type="text"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        placeholder="Tech Connect Alberta"
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        value={companyName}
                                    />
                                    <label className="text-black">Username</label>
                                    <input
                                        required
                                        type="text"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        placeholder="Ex. JohnDoe123"
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-black">Last Name *</label>
                                    <input
                                        required
                                        type="text"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        onChange={(e) => setLastName(e.target.value)}
                                        value={lastName}
                                    />
                                    <label className="text-black">Password *</label>
                                    <input
                                        required
                                        type="password"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                    />
                                    <label className="text-black">Your Title *</label>
                                    <input
                                        required
                                        type="text"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        placeholder="Ex. Front-end Developer"
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                    />
                                    <label className="text-black">Phone Number</label>
                                    <input
                                        required
                                        type="text"
                                        className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100"
                                        placeholder="Ex. 1112223333"
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        value={phoneNumber}
                                    />
                                </div>
                            </div>

                            {/* Clerk CAPTCHA */}
                            <div id="clerk-captcha" className="my-4"></div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white rounded px-3 py-2 w-72 mt-6 hover:bg-green-500 active:bg-amber-400 mx-auto block disabled:opacity-60"
                                >
                                {loading ? "Sending request..." : "Sign Up"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}