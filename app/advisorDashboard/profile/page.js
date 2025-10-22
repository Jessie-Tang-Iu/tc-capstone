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

    return(
        <main className="bg-gradient-to-br from-[#f8eae2] to-white min-h-screen">
            <Navbar />
        
            <div className="mx-auto mt-10">
                <h1 className="px-6 mb-6 text-2xl font-bold text-[#DD5B45]">
                    Advisor DashBoard
                </h1>

                <div className="w-4/5 mx-auto flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold text-[#E55B3C]">Advisor Profile</h1>

                    {/* Advisor Details */}                
                    <div className="w-full my-8 p-12 bg-white rounded-lg shadow-md text-black">
                        
                        <div className="flex justify-between">
                            <div className='mb-10'>
                                <h1 className="text-2xl text-black font-bold">{advisor.first_name} {advisor.last_name}</h1>
                                <p>{advisor.company_role}</p>
                                <p className="text-gray-600">{advisor.company_name}</p>
                            </div>
                            <div>
                                <Button text="Save" />
                            </div>
                        </div>
                            

                        <div className='mb-10'>
                            <h1 className="text-2xl text-black font-bold mb-2">Contact Information</h1>
                            <p>Phone: {advisor.phone}</p>
                            <p>Email: {advisor.email}</p>
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
                        
                    </div>
                </div>

            </div>
        </main>
            
    );
}