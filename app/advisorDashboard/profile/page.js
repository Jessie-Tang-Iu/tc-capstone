"use client";

import Button from "@/app/components/ui/Button";
import Navbar from "../../components/AdvisorNavBar";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";



export default function Profile() {

    const { user } = useUser();
    const advisorId = user?.id;

    const [advisor, setAdvisor] = useState({
        username: null, 
        first_name: null, 
        last_name: null,
        email: null,
        phone: null,
        role: null,
        company_name: null,
        company_role: null,
        education: null,
        experience: null,
    });

    const [skill1, setSkill1] = useState("");
    const [skill2, setSkill2] = useState("");
    const [skill3, setSkill3] = useState("");

    useEffect(() => {
        if (!advisorId) return;

       fetchAdvisor(advisorId);
    }, [advisorId]);

    const fetchAdvisor = async (advisorId) => {
        try {
            const res = await fetch(`/api/advisor_list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ advisorId: advisorId })}
            );
            if (!res.ok) {console.error("Failed to fetch advisor"); return;}

            const data = await res.json();
            setAdvisor(data);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    };

    // console.log("Advisor: ", advisor)

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // advisor personal info
        const newAdvisor = {
            clerk_id: advisor.clerk_id,
            first_name: advisor.first_name,
            last_name: advisor.last_name,
            email: advisor.email,
            phone: advisor.phone,
            company_name: advisor.company_name,
            company_role: advisor.company_role,
        }

        // advisor profile info
        const newAdvisorProfile = {
            advisorId: advisor.clerk_id,
            education: advisor.education,
            experience: advisor.experience,
        }

        console.log("Submitting advisor profile: ", newAdvisorProfile);

        try {
            const res = await fetch(`/api/advisor_list`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ advisorId: advisor.clerk_id,
                    education: advisor.education,
                    experience: advisor.experience, })}
                );
            if (!res.ok) {console.error("Failed to update profile"); return;}
        
            console.log("Profile updated successfully");

            fetchAdvisor(ME); // refresh data
            
        } catch (error) {
            console.error("Error submitting profile: ", error);
        }
        
    }

    return(
        <main className="bg-linear-to-br from-[#f8eae2] to-white min-h-screen">
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
                            <div className="flex flex-col">
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
                            
                        </div>

                        <div className="mb-10 flex flex-col">
                            <h1 className="text-2xl text-black font-bold mb-2">Skills</h1>

                            <div className="flex flex-row sm:flex-col space-x-4">
                                <div className="flex flex-row space-x-2 mb-6 items-center">
                                    <label className="text-1xl text-black">Skill 1:</label>
                                    <input
                                    className="border rounded border-black p-1"
                                    type="text"
                                    value={skill1}
                                    onChange={(e) => setSkill1(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-row space-x-2 mb-6 items-center">
                                    <label className="text-1xl text-black">Skill 2:</label>
                                    <input
                                    className="border rounded border-black p-1"
                                    type="text"
                                    value={skill2}
                                    onChange={(e) => setSkill2(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-row space-x-2 mb-6 items-center">
                                    <label className="text-1xl text-black">Skill 3:</label>
                                    <input
                                    className="border rounded border-black p-1"
                                    type="text"
                                    value={skill3}
                                    onChange={(e) => setSkill3(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            
                        </div>
                        
                        <div className='mb-10'>
                            <h1 className="text-2xl text-black font-bold mb-2">Experience</h1>
                            <textarea
                            className="w-full min-h-100 border rounded border-black mb-6 p-3 text-black"
                            placeholder={"2022/8 - Present\nFront-end Developer"}
                            value={advisor.experience || ""}
                            onChange={(e) => setAdvisor({...advisor, experience: e.target.value})}
                            />
                        </div>

                        <div className='mb-10'>
                            <h1 className="text-2xl text-black font-bold mb-2">Education</h1>
                            <textarea
                            className="w-full min-h-60 border rounded border-black mb-6 p-3 text-black"
                            placeholder={"University of Toronto\nMaster of ComputerScience\nSep 2020 - Jun 2022 \n\n\nUniversity of Calgary\nBachelor of Computer Science\nSep 2017 - Jun 2020"}
                            value={advisor.education || ""}
                            onChange={(e) => setAdvisor({...advisor, education: e.target.value})}
                            />
                        </div>

                    </form> 
                    </div>
                </div>

            </div>
        </main>
            
    );
}