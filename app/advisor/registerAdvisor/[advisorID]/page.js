"use client";

import MemberNavbar from "@/app/components/MemberNavBar";
import Button from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IoLogoElectron } from "react-icons/io5";

export default function RegisterAdvisor({ params }) {

    const { advisorID } = use(params);
    const router = useRouter();

    // user context
    const userContext = useUser();
    const userID = userContext?.user?.id;

    // Register advisor state
    const [newAdvisor, setNewAdvisor] = useState({ advisorId: advisorID, clientId: userID , message: '', status: 'pending'});

    const handleBackToAdvisorList = () => {
        router.push('/advisor/advisorSearch');
    }

    const handleRegisterAdvisor = () => {
        // Post request to register advisor
        (async () => {
            try {
                const res = await fetch(`/api/advisory_sessions`, {
                    method: 'POST',
                    headers: {  "Content-Type": "application/json" },
                    body: JSON.stringify(newAdvisor)
                });

                if (!res.ok) throw new Error("Failed to register advisor");
                const registeredAdvisor = await res.json();
                setNewAdvisor({ advisorId: advisorID, clientId: userID , message: '', status: 'pending'  }); // reset form

                console.log("Registration response: ", registeredAdvisor);
                router.push('/advisor');
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        })();
    };

    const handleMessageChange = (e) => {
        setNewAdvisor({ advisorId: advisorID, clientId: userID , message: e.target.value, status: 'pending' });
        alert("Your payment is pending! Please wait for confirmation!");
    }

    console.log(newAdvisor);

    return (
        <main className="bg-gray-100 min-h-screen">
            <MemberNavbar />
            <div className="w-4/5 h-full mx-auto mt-10 pb-10">
                <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-5">&lt; Back to Advisor List</button>

                <div className="flex flex-row mb-4 rounded-xl bg-gradient-to-br from-[#F3E1D5] to-white shadow text-center px-20">
                    <div className="w-3/5 flex flex-col items-start">
                        {/* Session 1 */}
                        <div className='my-7 mb-10 text-left'>
                            <h1 className="text-[25px] font-bold text-[#E55B3C] mb-6">Register Advisory Session {advisorID}</h1>
                            <p className="text-[15px] text-gray-700">At Tech Connect, we believe technology should amplify your mission—not your expenses. That&apos;s why we&apos;re offering free or low-cost tech and automation support to nonprofits, based on your organization&apos;s size and budget.</p>
                            {/* <hr className='text-black' /> */}
                        </div>

                        {/* Session 2 */}
                        <div className='mb-7 text-left'>
                            <h1 className="text-[25px] font-bold text-[#E55B3C] mb-6">Why We Do This</h1>
                            <p className="text-[15px] text-gray-700 mb-3">Nonprofits do the hardest and most meaningful work often with the fewest resources. We want to change that.</p>
                            <p className="text-[15px] text-red-600">Note: Our team of skilled volunteers and professionals will work with you based on your size and needs—many services at minimal cost or completely free for grassroots or emerging organizations.</p>
                        </div>
                    </div>
                    
                    <div className="w-2/5 flex justify-center items-center">
                        <IoLogoElectron size={200} className="text-[#E55B3C]" />
                    </div>
                    
                </div>
                

                <div className="flex flex-row mb-4 rounded-xl bg-white shadow text-center px-20">
                    {/* Leave Message */}
                    <div className='w-1/2 my-7 mb-10 text-center px-17'>
                        <h1 className="text-[25px] font-bold text-[#E55B3C] mb-6">Step 1: Leave A Message To {advisorID}</h1>
                        <p className="text-gray-700 mb-7">Sharing a short message about your goals, questions, or needs will help your advisor understand how best to support you — and respond faster with relevant guidance.</p>
                        <textarea
                            className="border rounded border-black lg:w-130 sm:w-40 min-h-40 mb-6 p-3 text-black"
                            onChange={handleMessageChange}
                            placeholder="I am working in front-end development and need some advise"
                            />
                    </div>

                    {/* Payment */}
                    <div className='w-1/2 my-7 mb-10 text-center px-17'>
                        <h1 className="text-[25px] font-bold text-[#E55B3C] mb-6">Step 2: Make Your Payment</h1>
                        <p className="text-gray-700 mb-12">Once the payment is confirmed, you can create the appointment with your advisor.</p>
                        <Button text="Payment Gateway" onClick={handleRegisterAdvisor}/>
                    </div>
                </div>
                
            </div>
        </main>
    );
}