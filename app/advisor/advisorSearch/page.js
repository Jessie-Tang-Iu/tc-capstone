"use client";

import React, { useState } from "react";
import Navbar from "../../components/MemberNavBar";
import advisors from "../../data/advisors.json";
import userAdvisors from "../../data/usersAdvisors.json";
import AdvisorCard from "../../components/AdvisorCard";

export default function AdvisorSearchPage() {

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <Navbar />
      <h1 className="text-3xl text-center font-bold mt-8">Advisor Search</h1>
      <div className="mx-12">
        {advisors.length > 0 ? (
          advisors.map((advisor) => (
            <AdvisorCard key={advisor.advisorID} advisor={advisor} />
          ))
        ) : (
          <p className="text-gray-600 p-4">No advisors found.</p>
        )}
      </div>
    </div>
  );
}
