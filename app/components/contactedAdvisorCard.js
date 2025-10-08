"use client";

import Link from "next/link";
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

export default function ContactedAdvisorCard({ advisor }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const router = useRouter();

    // navigate to advisor detail page
    const handleViewProfile = (advisorID) => {
        router.push(`/advisor/${advisorID}`)
    }



    return(
        <div className="bg-[#F3E1D5] shadow-md rounded-lg p-6 m-4">
            <div>
                <h2 className="text-2xl text-black font-bold mb-2">Advisor ID: {advisor.advisor_id}</h2>
            </div>
            <div className='flex flex-row space-x-2'>
                <Button onClick={() => handleViewProfile(advisor.advisor_id)} text="View Profile" />
                <Button onClick={() => setIsChatOpen(true)} text="Message" />
                <Button text="Check Availability" />
            </div>
            

            {isChatOpen && (
                <div className="fixed bottom-4 right-4 w-80 h-96 z-50">
                    <ChatWindow
                        recipient={advisor.name}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}