"use client";

import React, { useState } from "react";
import Navbar from "../../components/MemberNavBar";
import advisors from "../../data/advisors.json";
import userAdvisors from "../../data/usersAdvisors.json"; // This is here for future implementation of connecting a advisor to a user account
import AdvisorCard from "../../components/advisorCard";

export default function AdvisorSearchPage() {

  return (
    <main className='bg-gray-100 min-h-screen'>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* header */}
        <div className='mb-10 text-center'>
          <h1 className="text-3xl font-bold text-[#E55B3C]">Advisor Search</h1>
        </div>
        
        <div className="mx-10">
          {advisors.length > 0 ? (
            advisors.map((advisor) => (
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
