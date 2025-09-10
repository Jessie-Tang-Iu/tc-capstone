"use client";

import React, { useState } from "react";
import Navbar from "../../components/MemberNavBar";
import advisors from "../../data/advisors.json";
import userAdvisors from "../../data/usersAdvisors.json";
import AdvisorCard from "../../components/advisorCard";
import { useUserContext } from "../../context/userContext";

export default function AdvisorSearchPage() {
  const userContext = useUserContext();
  const userID = userContext?.user?.id || 1; // fallback for demo

  // Start with advisors this user has already contacted
  const initialContacted = userAdvisors
    .filter((contact) => contact.userID === userID)
    .map((contact) => contact.advisorID);

  const [contactedIDs, setContactedIDs] = useState(initialContacted);

  const handleAddAdvisor = (advisorID) => {
    if (!contactedIDs.includes(advisorID)) {
      setContactedIDs([...contactedIDs, advisorID]);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <Navbar />

    </div>
  );
}
