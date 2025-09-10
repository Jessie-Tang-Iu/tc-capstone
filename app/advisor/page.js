import React from 'react';
import Navbar from '../components/MemberNavBar'
import advisors from '../data/advisors.json'
import AdvisorCard from '../components/advisorCard';

export default function AdvisorPage() {
  return (
    <div className="bg-gray-100 min-h-screen text-black">
        <Navbar />
        <h1 className="text-3xl text-center font-bold mt-8">Advisor Page</h1>
        <div className="mx-12">
            {advisors.map((advisor, index) => (
                <AdvisorCard key={index} advisor={advisor} />
            ))}            
        </div>

    </div>
  );
}