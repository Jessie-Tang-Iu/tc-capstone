"use client";

import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { RxAvatar, RxCalendar, RxChatBubble, RxIdCard, RxPencil2 } from "react-icons/rx";

export default function AdvisorCard({ advisor }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const router = useRouter();
    const userContext = useUser();
    const userID = userContext?.user?.id;

    // navigate to advisor detail page
    const handleViewProfile = (advisorID) => {
        router.push(`/advisor/${advisorID}`)
    }

    const handleRegister = (advisorID) => {
        router.push(`/advisor/registerAdvisor/${advisorID}`)
    }


    return(
        <div className='w-115 h-45 bg-white shadow rounded-xl flex flex-row py-3 px-4 text-start'>
            <div className='flex flex-col flex-2'>
                <div className="flex flex-row space-x-2 mr-5">
                    <RxAvatar size={90} />
                    <div className="text-start">
                        <p className='font-bold text-[20px] mb-2'>{advisor.first_name} {advisor.last_name}</p>
                        <p className='text-gray-500'>{ advisor.company_role || "No Role Provided" }</p>
                        <p className='text-gray-500 mb-2'>{ advisor.company_name || "No Company Provided"}</p>
                    </div>
                </div>
                
                

                {/* Skills Tag */}
                <div className="flex flex-wrap justify-center text-center mt-2 gap-1.5">
                    {!advisor.skill_1 && !advisor.skill_2 && !advisor.skill_3 &&
                        <div className='border border-gray-300 shadow-lg rounded-xl bg-white/10 backdrop-blur-sm px-2 '>
                            <p>No Skills Provided</p>
                        </div>
                    }

                    {advisor.skill_1 && (
                        <div className='border  border-gray-300 shadow-lg rounded-xl bg-[#f6f0bb] backdrop-blur-sm px-2'>
                            <p>{advisor.skill_1 || ""}</p>
                        </div>
                    )}

                    {advisor.skill_2 && (
                        <div className='border border-gray-300 shadow-lg rounded-xl bg-[#c7ecee] backdrop-blur-sm px-2'>
                            <p>{advisor.skill_2 || ""}</p>
                        </div>
                    )}

                    {advisor.skill_3 && (
                        <div className='border border-gray-300 shadow-lg rounded-xl bg-[#c1e7bb] backdrop-blur-sm px-2'>
                            <p>{advisor.skill_3 || ""}</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className='flex flex-col my-3 justify-between items-start space-x-3.5 ml-auto'>
                <button onClick={() => handleViewProfile(advisor.advisorID)} className='flex flex-row hover:text-sky-600 active:text-gray-500'>
                    <RxIdCard className='mr-2' size={24} />
                    View Profile
                </button>
                <button onClick={() => setIsChatOpen(true)} className='flex flex-row hover:text-sky-600 active:text-gray-500'>
                    <RxChatBubble className='mr-2' size={24} />
                    Message
                </button>
                <button onClick={() => handleRegister(advisor.advisorID)} className='flex flex-row hover:text-sky-600 active:text-gray-500'>
                    <RxPencil2 className='mr-2' size={24} />
                    Register
                </button>
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