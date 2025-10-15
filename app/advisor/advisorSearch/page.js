"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/MemberNavBar";
import advisors from "../../data/advisors.json";
import userAdvisors from "../../data/usersAdvisors.json"; // This is here for future implementation of connecting a advisor to a user account
import AdvisorCard from "../../components/advisorCard";
import { useRouter } from "next/navigation";

export default function AdvisorSearchPage() {

  const [advisorList, setAdvisorList] = useState([]);

  const router = useRouter();

  useEffect(() => {

    (async() => {
      try {
      const res = await fetch(
          `/api/advisor_list`
      ); // fetch all advisors from the backend
      if (!res.ok) throw new Error("Failed to fetch advisors");

      const data = await res.json();

      const advisorArray = data.map(advisor => ({
        advisorID: advisor.clerk_id,
        username: advisor.username,
        first_name: advisor.first_name,
        last_name: advisor.last_name,
        email: advisor.email,
        phone: advisor.phone,
        role: advisor.role}));

      setAdvisorList(advisorArray);

      } catch (error) {
        console.error("Fetch error: ", error);
      }
    })();

  }, []);
  
  const handleBackToAdvisorList = () => {
      router.push('/advisor');
  }

  return (
    <main className='bg-gray-100 min-h-screen'>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2 mx-15">&lt; Back to Advisor List</button>
        {/* header */}
        <div className='mb-10 text-center'>
          <h1 className="text-3xl font-bold text-[#E55B3C]">Advisor Search</h1>
        </div>
        
        <div className="mx-10">
          {advisorList.length > 0 ? (
            advisorList.map((advisor) => (
              <AdvisorCard key={advisor.advisorID} advisor={advisor} />
            ))
          ) : (
            <p className="text-gray-600 p-4">No advisors found.</p>
          )}
        </div>
      </div>
    </main>
    
  );
}
