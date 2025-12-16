"use client";

import React, { use, useEffect, useState } from 'react';
import Navbar from '../../components/MemberNavBar'
import advisors from '../../data/advisors.json'
import { useRouter } from 'next/navigation';

export default function AdvisorPage({ params }) {

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
        skill_1: null,
        skill_2: null,
        skill_3: null,
    });

    const router = useRouter();

    const { advisorID } = use(params);

    useEffect(() => {
    
        (async() => {
          try {
          const res = await fetch(`/api/advisor_list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ advisorId: advisorID })}
                );
          if (!res.ok) throw new Error("Failed to fetch advisors");
    
          const data = await res.json();

          setAdvisor(data);
    
          } catch (error) {
            console.error("Fetch error: ", error);
          }
        })();
    
      }, []);

    // console.log("Advisor: ", advisor);

    if (!advisor) {
    return (
        <main className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-10">
            <p className="text-xl text-center text-gray-600">Loading advisor data...</p>
        </div>
        </main>
    );
    }

    const handleBackToAdvisorList = () => {
        router.push('/advisor/advisorSearch');
    }


    return (
        <main className="bg-linear-to-br from-[#f8eae2] to-white min-h-screen">
            <Navbar />
            <div className="w-4/5 mx-auto mt-10">
                <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2 cursor-pointer hover:underline">&lt; Back to Advisor List</button>
                {/* header */}
                <div className='mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-[#E55B3C] mt-5 mb-10">Advisor Details</h1>
                </div>

                {/* Advisor Details */}                
                <div className="my-8 p-6 bg-white rounded-lg shadow-md text-black">
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold">{advisor.first_name} {advisor.last_name}</h1>
                        <p>{advisor.company_role}</p>
                        <p className="text-gray-600">{advisor.company_name}</p>
                    </div>

                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Skills</h1>
                        {!advisor.skill_1 && !advisor.skill_2 && !advisor.skill_3 &&
                            <div className='border border-gray-300 shadow-lg rounded-xl bg-white/10 backdrop-blur-sm px-2 '>
                                <p className='text-[20px]'>No Skills Provided</p>
                            </div>
                        }

                        {advisor.skill_1 && (
                            <div className='w-fit border border-gray-300 shadow-lg rounded-xl bg-[#f6f0bb] backdrop-blur-sm px-2 mb-3'>
                                <p className='text-[20px]'>{advisor.skill_1 || ""}</p>
                            </div>
                        )}

                        {advisor.skill_2 && (
                            <div className='w-fit border border-gray-300 shadow-lg rounded-xl bg-[#c7ecee] backdrop-blur-sm px-2 mb-3'>
                                <p className='text-[20px]'>{advisor.skill_2 || ""}</p>
                            </div>
                        )}

                        {advisor.skill_3 && (
                            <div className='w-fit border border-gray-300 shadow-lg rounded-xl bg-[#c1e7bb] backdrop-blur-sm px-2 mb-3'>
                                <p className='text-[20px]'>{advisor.skill_3 || ""}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Experience</h1>
                        <p style={{ whiteSpace: 'pre-line' }}>{advisor.experience || "No experience information available."}</p>
                    </div>
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Education</h1>
                        <p style={{ whiteSpace: 'pre-line' }}>{advisor.education || "No education information available."}</p> 
                    </div>
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Contact Information</h1>
                        {advisor.phone && <p>Phone: {advisor.phone}</p>}
                        <p>Email: {advisor.email}</p>
                    </div>
                </div>
            </div>
            
        </main>
    );
}