"Use client";

import { useState } from "react";
import Navbar from "../components/NavBarBeforeSignIn";



export default function advisorRegister() {

    // form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [title, setTitle] = useState("");
    const [companyName, setCompanyName] = useState("");

    // ui
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registerAdvisor = (e) => {
        e.preventDefault();

        setError("");
        if(error === "") {
            setLoading(true);
        }
    }

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
                                    placeholder="Front-end Developer"
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                    />
                                </div>
                            </div>
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