"use client";

import React, { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { RxCalendar, RxChatBubble, RxIdCard } from "react-icons/rx";

export default function ContactedAdvisorCard({ advisor }) {

    // Chat Status
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Style Status
    const [statusStyle, setStatusStyle] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

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

    // console.log("Contacted Advisor Card - Advisor: ", advisor);

    // Status Style
     useEffect(() => {
        if(!advisor.status) return;

        if(advisor.status === 'active') {
            setStatusStyle("px-2 py-1 rounded bg-blue-100 text-blue-700");
            setIsDisabled(false);
        } else if(advisor.status === 'closed') {
            setStatusStyle("px-2 py-1 rounded bg-red-100 text-red-700");
            setIsDisabled(true);
        } else if(advisor.status === 'pending') {
            setStatusStyle("px-2 py-1 rounded bg-yellow-100 text-yellow-700");
            setIsDisabled(true);
        }
    }, [advisor]);

    return(
        <div className='w-85 h-30 bg-white shadow rounded-xl flex flex-row py-3 px-4 text-start'>
            <div className='w-2/3 flex flex-col justify-between'>
                <p className='font-bold text-[25px] mb-2'>{advisor.first_name} {advisor.last_name}</p>
                <p className='text-gray-500'>{advisor.company_role}</p>
                <p className='text-gray-500'>10+ years experience</p>
            </div>

            <div className="flex flex-col justify-between items-end">
                
                <div className={`text-center w-20 h-8 border rounded-4xl text-black ${statusStyle}`}>
                    {advisor.status}
                </div>

                <div className='flex flex-row items-end space-x-3.5 ml-auto'>
                    {/* View Profile Button */}
                    <button 
                        onClick={() => handleViewProfile(advisor.advisor_id)} 
                        className='hover:text-sky-600 active:text-gray-500'>
                            <RxIdCard size={24} />
                    </button>
                    {/* Message Button */}
                    <button 
                        onClick={() => setIsChatOpen(true)} 
                        className='hover:text-sky-600 active:text-gray-500'>
                            <RxChatBubble size={24} />
                    </button>
                    {/* View Availability Button */}
                    <button 
                        onClick={() => handleCheckAvailability(advisor.advisor_id)} 
                        className='hover:text-sky-600 active:text-gray-500 disabled:text-gray-300'
                        disabled={isDisabled}>
                            <RxCalendar size={24} />
                    </button>
                </div>
            </div>
            
            

            {isChatOpen && (
                <div className="fixed bottom-4 right-4 w-80 h-96 z-50">
                    <ChatWindow
                        me={userID}
                        recipient={advisor.advisor_id}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}