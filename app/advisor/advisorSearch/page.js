"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/MemberNavBar";
import advisors from "../../data/advisors.json";
import userAdvisors from "../../data/usersAdvisors.json"; // This is here for future implementation of connecting a advisor to a user account
import AdvisorCard from "../../components/advisorCard";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/ui/SearchBar";

export default function AdvisorSearchPage() {

  // Advisor State
  const [advisorList, setAdvisorList] = useState([]);

  // Query Status
  const [query, setQuery] = useState("");

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
        role: advisor.role,
        company_name: advisor.company_name,
        company_role: advisor.company_role,
        education: advisor.education,
        experience: advisor.experience,
      }));

      setAdvisorList(advisorArray);
      // console.log("Fetched Advisors: ", advisorArray);

      } catch (error) {
        console.error("Fetch error: ", error);
      }
    })();

  }, []);
  
  const handleBackToAdvisorList = () => {
      router.push('/advisor');
  }

  // filter advisors by search input
  const filteredAdvisor = advisorList.filter((u) =>
      u.first_name.toLowerCase().includes(query.toLowerCase()) ||
      u.last_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className='bg-linear-to-br from-[#f8eae2] to-white min-h-screen pb-5'>
      <Navbar />
      <div className='w-4/5 mx-auto mt-10'>
        <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2">&lt; Back to Advisor List</button>
        {/* header */}
        <div className='mb-10 text-center'>
          <h1 className="text-3xl font-bold text-[#E55B3C]">Advisor Search</h1>
          <div className="flex justify-center mt-5">
              <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSearch={() => {}}
                  placeholder="Advisor Name | Position | Skill Sets"
              />
          </div>
        </div>
        
        <div className="flex flex-wrap lg:justify-start sm:justify-center my-4 lg:space-x-6 sm:space-x-5 space-y-10 text-center text-black">
          {advisorList.length > 0 ? (
            filteredAdvisor.map((advisor) => (
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
