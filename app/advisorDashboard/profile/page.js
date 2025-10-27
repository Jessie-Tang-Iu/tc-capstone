"use client";

import Button from "@/app/components/ui/Button";
import Navbar from "../../components/AdvisorNavBar";
import { useEffect, useState } from "react";



export default function Profile() {

    const [advisor, setAdvisor] = useState({
        username: null, 
        first_name: null, 
        last_name: null,
        email: null,
        phone: null,
        role: null,
        company_name: null,
        company_role: null,
    });

    const ME = "testAdvisor1"; // for testing without login

    useEffect(() => {
        if (!ME) return;

        (async () => {
            try {
                const res = await fetch(`/api/advisor_list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ advisorId: ME })}
                );
                if (!res.ok) {console.error("Failed to advisor"); return;}
        
                const data = await res.json();

                setAdvisor(data);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        })();
    }, [ME]);

    console.log("Advisor: ", advisor)

    const handleProfileSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <main className="bg-gradient-to-br from-[#f8eae2] to-white min-h-screen">
            <Navbar />
        
            <div className="mx-auto mt-10">
                {/* <h1 className="px-6 mb-6 text-2xl font-bold text-[#DD5B45]">
                    Advisor DashBoard
                </h1> */}

                <div className="w-4/5 mx-auto flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold text-[#E55B3C]">Advisor Profile</h1>

                    {/* Advisor Details */}                
                    <div className="w-full my-8 p-12 bg-white rounded-lg shadow-md text-black">
                    <form onSubmit={handleProfileSubmit}>
                        
                        <div className="flex justify-between">
                            <div className='mb-10'>
                                <p className="mb-6 text-gray-600">* Indicates required</p>
                                <h1 className="text-2xl text-black font-bold mb-2">Personal Information</h1>

                                <div className="flex flex-row space-x-4">
                                    <div className="flex flex-col">
                                        <label className="text-1xl text-black font-bold">First Name: *</label>
                                        <input
                                        required
                                        className="border rounded border-black mb-6 p-1"
                                        type="text"
                                        value={advisor.first_name || ""}
                                        onChange={(e) => setAdvisor({...advisor, first_name: e.target.value})}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-1xl text-black font-bold">Last Name: *</label>
                                        <input
                                        required
                                        className="border rounded border-black mb-6 p-1"
                                        type="text"
                                        value={advisor.last_name || ""}
                                        onChange={(e) => setAdvisor({...advisor, last_name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col">
                                    <label className="text-1xl text-black font-bold">Role: *</label>
                                    <input
                                    required
                                    className="border rounded border-black mb-6 p-1"
                                    type="text"
                                    value={advisor.company_role || ""}
                                    onChange={(e) => setAdvisor({...advisor, company_role: e.target.value})}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-1xl text-black font-bold">Company Name: </label>
                                    <input
                                    className="border rounded border-black mb-6 p-1"
                                    type="text"
                                    value={advisor.company_name || ""}
                                    onChange={(e) => setAdvisor({...advisor, company_name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <Button text="Save" type="submit"/>
                            </div>
                        </div>
                            

                        <div className='mb-10'>
                            <h1 className="text-2xl text-black font-bold mb-2">Contact Information</h1>

                            {/* Phone Number */}
                            <div className="flex flex-row space-x-2 mb-6 items-center">
                                <label className="text-1xl text-black">Phone: </label>
                                <input
                                className="border rounded border-black p-1"
                                type="text"
                                value={advisor.phone || ""}
                                onChange={(e) => setAdvisor({...advisor, phone: e.target.value})}
                                />
                            </div>
                            

                            {/* Email */}
                            <div className="flex flex-row space-x-2 mb-6 items-center">
                                <label className="text-1xl text-black">Email:* </label>
                                <input
                                required
                                className="border rounded border-black p-1"
                                type="text"
                                value={advisor.email || ""}
                                onChange={(e) => setAdvisor({...advisor, email: e.target.value})}
                                />
                            </div>
                            
                        </div>
                        
                        <div className='mb-10'>
                            <h1 className="text-2xl text-black font-bold mb-2">Experience</h1>
                            <textarea
                            className="w-full min-h-100 border rounded border-black mb-6 p-3 text-black"
                            placeholder={"2022/8 - Present\nFront-end Developer"}
                            />
                        </div>

                        <div className='mb-10'>
                            <h1 className="text-2xl text-black font-bold mb-2">Education</h1>
                            <textarea
                            className="w-full min-h-60 border rounded border-black mb-6 p-3 text-black"
                            placeholder={"University of Toronto\nMaster of ComputerScience\nSep 2020 - Jun 2022 \n\n\nUniversity of Calgary\nBachelor of Computer Science\nSep 2017 - Jun 2020"}
                            />
                        </div>

                    </form> 
                    </div>
                </div>

            </div>
        </main>
            
    );
}