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

    console.log("Advisor: ", advisor);

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
        <main className="bg-gradient-to-br from-[#f8eae2] to-white min-h-screen">
            <Navbar />
            <div className="w-4/5 mx-auto mt-10">
                <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2">&lt; Back to Advisor List</button>
                {/* header */}
                <div className='mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-[#E55B3C] mt-5 mb-10">Advisor Details</h1>
                    {/* <hr className='text-black' /> */}
                </div>

                {/* Advisor Details */}                
                <div className="my-8 p-6 bg-white rounded-lg shadow-md text-black">
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold">{advisor.first_name} {advisor.last_name}</h1>
                        <p>{advisor.company_role}</p>
                        <p className="text-gray-600">{advisor.company_name}</p>
                    </div>
                    
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Experience</h1>
                        <p>{advisor.experience || "No experience information available."}</p>
                    </div>
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Education</h1>
                        <p>{advisor.education || "No education information available."}</p> 
                    </div>
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Contact Information</h1>
                        <p>Phone: {advisor.phone}</p>
                        <p>Email: {advisor.email}</p>
                    </div>

                    <div>
                        <h1 className="text-2xl text-black font-bold mb-2">Availability</h1>
                        {/* <ul>
                            {Object.entries(advisor.availability).map(([day, hours]) => (
                                <li key={day}>
                                    {day}: {hours ? `${hours.from} - ${hours.to}` : "Not Available"}
                                </li>
                            ))}
                        </ul> */}
                    </div>
                </div>
            </div>
            
        </main>
    );
}