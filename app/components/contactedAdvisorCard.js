"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ContactedAdvisorCard({ advisor }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const router = useRouter();
    const userContext = useUser();
    const userID = userContext?.user?.id;

    // navigate to advisor detail page
    const handleViewProfile = (advisorID) => {
        router.push(`/advisor/${advisorID}`)
    }

    const handleCheckAvailability = (advisorID) => {
        router.push(`/advisor/checkAvailability/${advisorID}`)
    }

    console.log("Contacted Advisor Card - Advisor: ", advisor);

    return(
        <div className="bg-[#F3E1D5] shadow-md rounded-lg p-6 my-4">
            <div>
                <h2 className="text-2xl text-black font-bold mb-2">Advisor: {advisor.first_name} {advisor.last_name}</h2>
            </div>
            <div className='flex flex-row space-x-2'>
                <Button onClick={() => handleViewProfile(advisor.advisorID)} text="View Profile" />
                <Button onClick={() => setIsChatOpen(true)} text="Message" />
                <Button onClick={() => handleCheckAvailability(advisor.advisorID)} text="Check Availability" />
            </div>
            

            {isChatOpen && (
                <div className="fixed bottom-4 right-4 w-80 h-96 z-50">
                    <ChatWindow
                        me={userID}
                        recipient={advisor.advisorID}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}