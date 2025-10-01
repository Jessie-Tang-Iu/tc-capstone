"use client";

import React, { use } from 'react';
import Navbar from '../../components/MemberNavBar'
import advisors from '../../data/advisors.json'
import { useRouter } from 'next/navigation';

export default function AdvisorPage({ params }) {

    const router = useRouter();

    const { advisorID } = use(params);

    const id = Number(advisorID);
    const advisor = advisors.find((c) => c.advisorID === id);

    const handleBackToAdvisorList = () => {
        router.push('/advisor/advisorSearch');
    }


    return (
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 pt-10">
                <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2 mx-12">&lt; Back to Advisor List</button>
                {/* header */}
                <div className='mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-[#E55B3C] mt-5 mb-10">Advisor Details</h1>
                    <hr className='text-black mx-12' />
                </div>

                {/* Advisor Details */}
                <div className='mx-12'>
                    <h1 className="text-2xl text-black font-bold mb-2">{advisor.name}</h1>
                    <p className='text-black'>{advisor.description}</p>
                </div>
                
                <div className="mx-12 my-8 p-6 bg-[#F3E1D5] rounded-lg shadow-md text-black">
                    <h1 className="text-2xl text-black font-bold mb-2">Experience</h1>
                    <div className='mb-10'>
                        <h1 className="text-2xl text-black font-bold mb-2">Contact Information</h1>
                        <p>Phone: {advisor.phone}</p>
                        <p>Email: {advisor.email}</p>
                    </div>

                    <div>
                        <h1 className="text-2xl text-black font-bold mb-2">Availability</h1>
                        <ul>
                            {Object.entries(advisor.availability).map(([day, hours]) => (
                                <li key={day}>
                                    {day}: {hours ? `${hours.from} - ${hours.to}` : "Not Available"}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            
        </main>
    );
}