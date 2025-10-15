"use client";

import MemberNavbar from "@/app/components/MemberNavBar";
import Button from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function RegisterAdvisor({ params }) {

    const { advisorID } = use(params);
    const router = useRouter();

    // user context
    const userContext = useUser();
    const userID = userContext?.user?.id;

    // Register advisor state
    const [newAdvisor, setNewAdvisor] = useState({ advisorId: advisorID, clientId: userID , status: 'active'});

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
                setNewAdvisor({ advisorId: advisorID, clientId: userID , status: 'active'  }); // reset form

                console.log("Registration response: ", registeredAdvisor);
                router.push('/advisor');
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        })();
    };

    return (
        <main className="bg-gray-100 min-h-screen">
            <MemberNavbar />
            <div className="max-w-6xl mx-auto px-20 py-10">
                <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2">&lt; Back to Advisor List</button>
                {/* Session 1 */}
                <div className='my-7 mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-[#E55B3C] mb-6">Register Advisory Session {advisorID}</h1>
                    <p className="text-gray-700 mb-7">At Tech Connect, we believe technology should amplify your mission—not your expenses. That&apos;s why we&apos;re offering free or low-cost tech and automation support to nonprofits, based on your organization&apos;s size and budget.</p>
                    <hr className='text-black' />
                </div>

                {/* Session 2 */}
                <div className='my-7 mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-[#E55B3C] mb-6">Why We Do This</h1>
                    <p className="text-gray-700 mb-7">Nonprofits do the hardest and most meaningful work often with the fewest resources. We want to change that.</p>
                    <p className="text-red-600 mb-7">Note: Our team of skilled volunteers and professionals will work with you based on your size and needs—many services at minimal cost or completely free for grassroots or emerging organizations.</p>
                    <hr className='text-black' />
                </div>

                {/* Payment */}
                <div className='my-7 mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-black mb-6">Next Steps: Payment</h1>
                    <Button text="Payment Gateway" onClick={handleRegisterAdvisor}/>
                </div>
            </div>
        </main>
    );
}