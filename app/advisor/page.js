"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/MemberNavBar'
import advisors from '../data/advisors.json'
import userAdvisors from "../data/usersAdvisors.json";
import { useUser } from '@clerk/nextjs';
import Button from '../components/ui/Button';
import { useRouter } from "next/navigation";
import ContactedAdvisorCard from '../components/contactedAdvisorCard';

export default function AdvisorPage() {

  const [myAdvisorList, setMyAdvisorList] = useState([]);

  const userContext = useUser();
  const userID = userContext?.user?.id;
  const router = useRouter();

  const ME = '11111111-1111-1111-1111-111111111111'; // for testing without login

  useEffect(() => {
    if (!ME) return;

    (async () => {
        try {
            const res = await fetch(
                `/api/advisory_sessions?clientId=${ME}`
            );
            if (!res.ok) {console.error("Failed to fetch advisory sessions"); return;}
      
            const data = await res.json();

            setMyAdvisorList(data);
            console.log("Return Array: ", data);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    })();
  }, [ME]);

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
          {myAdvisorList.length > 0 ? (
            myAdvisorList.map((advisor) => (
              <ContactedAdvisorCard key={advisor.advisor_id} advisor={advisor} />
            ))
          ) : (
            <p className="text-center mt-8 text-black">You haven’t contacted any advisors yet.</p>
          )}            
        </div>
      </div>
    </main>
    
  );
}