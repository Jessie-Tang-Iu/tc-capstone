"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/MemberNavBar'
import advisors from '../data/advisors.json'
import userAdvisors from "../data/usersAdvisors.json";
import AdvisorCard from '../components/AdvisorCard';
import { useUserContext } from "../context/userContext";

export default function AdvisorPage() {
  const userContext = useUserContext();
  const userID = userContext?.user?.id;

  // find advisorIDs for this user
  const contactedIDs = userAdvisors
    .filter((contact) => contact.userID === userID)
    .map((contact) => contact.advisorID);

  // filter advisors that match those IDs
  const contactedAdvisors = advisors.filter((advisor) =>
    contactedIDs.includes(advisor.advisorID)
  );

  return (
    <div className="bg-gray-100 min-h-screen text-black">
        <Navbar />
        <h1 className="text-3xl text-center font-bold mt-8">Your Advisor Page</h1>
        <Link href="/advisor/advisorSearch" className="block text-center mt-6 text-blue-600 hover:underline">
          Search for Advisors
        </Link>
        <div className="mx-12">
          {contactedAdvisors.length > 0 ? (
            contactedAdvisors.map((advisor) => (
              <AdvisorCard key={advisor.advisorID} advisor={advisor} />
            ))
          ) : (
            <p className="text-center mt-8">You haven’t contacted any advisors yet.</p>
          )}            
        </div>

    </div>
  );
}