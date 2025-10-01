"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/MemberNavBar'
import advisors from '../data/advisors.json'
import userAdvisors from "../data/usersAdvisors.json";
import AdvisorCard from '../components/advisorCard';
import { useUser } from '@clerk/nextjs';
import Button from '../components/ui/Button';
import { useRouter } from "next/navigation";

export default function AdvisorPage() {
  const userContext = useUser();
  const userID = userContext?.user?.id;
  const router = useRouter();

  // find advisorIDs for this user
  const contactedIDs = userAdvisors
    .filter((contact) => contact.userID === userID)
    .map((contact) => contact.advisorID);

  // filter advisors that match those IDs
  const contactedAdvisors = advisors.filter((advisor) =>
    contactedIDs.includes(advisor.advisorID)
  );

  // navigate to search advisor page
  const handleNewAdvisor = () => {
    router.push('/advisor/advisorSearch');
  }

  return (
    <main className='bg-gray-100 min-h-screen'>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* header */}
        <div className='mb-10 text-center'>
          <h1 className="text-3xl font-bold text-[#E55B3C]">Your Advisor Page</h1>
        </div>
        
        <div className='flex justify-end'>
          <Button onClick={handleNewAdvisor} text="Register New Advisor" />
        </div>
        
        <div className="mx-12">
          {contactedAdvisors.length > 0 ? (
            contactedAdvisors.map((advisor) => (
              <AdvisorCard key={advisor.advisorID} advisor={advisor} />
            ))
          ) : (
            <p className="text-center mt-8 text-black">You haven’t contacted any advisors yet.</p>
          )}            
        </div>
      </div>
    </main>
    
  );
}