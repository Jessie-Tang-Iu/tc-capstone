"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../components/MemberNavBar'
import { useUser } from '@clerk/nextjs';
import Button from '../components/ui/Button';
import { useRouter } from "next/navigation";
import ContactedAdvisorCard from '../components/contactedAdvisorCard';
import SearchBar from '../components/ui/SearchBar';

export default function AdvisorPage() {

  const [myAdvisorList, setMyAdvisorList] = useState([]);

  const [query, setQuery] = useState("");

  const userContext = useUser();
  const userID = userContext?.user?.id;
  const router = useRouter();

  useEffect(() => {
    if (!userID) return;

    (async () => {
        try {
            const res = await fetch(
                `/api/advisory_sessions?clientId=${userID}`
            );
            if (!res.ok) {console.error("Failed to fetch advisory sessions"); return;}
      
            const data = await res.json();

            setMyAdvisorList(data);
            console.log("Return Array: ", data);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    })();
  }, [userID]);

  // navigate to search advisor page
  const handleNewAdvisor = () => {
    router.push('/advisor/advisorSearch');
  }

  // filter advisor by search input
    const filteredAdvisors = myAdvisorList.filter((u) =>
        u.first_name.toLowerCase().includes(query.toLowerCase()) ||
        u.last_name.toLowerCase().includes(query.toLowerCase()) ||
        u.company_role.toLowerCase().includes(query.toLowerCase()) ||
        u.status.toLowerCase().includes(query.toLowerCase())
    );


  return (
    <main className='bg-gray-100 min-h-screen'>
      <Navbar />

      <div className='w-4/5 h-200 mx-auto mt-10'>
        {/* Header: centered title, search on its own row */}
        <div className="mb-4 rounded-xl bg-white p-6 shadow text-center">
            <div className="mb-4 text-4xl font-semibold text-[#E55B3C]">
                Your Advisor Page
            </div>
            <div className="flex justify-center">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSearch={() => {}}
                    placeholder="Advisor Name | Work Title | Status"
                />
            </div>
        </div>

        <div className='flex justify-end'>
          <Button onClick={handleNewAdvisor} text="Register New Advisor" />
        </div>

        <div className="flex flex-wrap justify-start my-4 lg:space-x-6 sm:space-x-5 space-y-10 text-center text-black">
          {filteredAdvisors.length > 0 ? (
            filteredAdvisors.map((advisor) => { 
              return(<ContactedAdvisorCard key={advisor.advisor_id} advisor={advisor} />)
            })
          ) : (
            <div className="w-full">
              <p className="text-center mt-8 text-black font-bold text-[20px]">There is no Registered Advisor.</p>
              <p className="text-center mt-3 text-gray-700">Try to register a new advisor</p>
            </div>
          )}            
        </div>
        
      </div>

      <p className='text-red-700 w-4/5 mx-auto mt-10 mb-10'>* Disclaimer: View Availability feature is only available when status is &#39;active&#39;!</p>

    </main>
    
  );
}