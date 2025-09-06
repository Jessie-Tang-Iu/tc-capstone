"use client";

import MessagePage from "../components/MessagePage";
import Navbar from "../components/NavBarBeforeSignIn";
import { useState } from "react";
import MyClientPage from "./myClient";
import Invoice from "./invoice";



export default function AdvisorDashboard() {

    let [menuSelection, setMenuSelection] = useState("message");

    const handleMenuSelection = (event) => {
        const selected = event.target.value;
        setMenuSelection(selected);
        console.log("Selected menu:", selected);
    };

    const MOCK_MESSAGES = [
    {
        id: 1,
        name: "John Doe",
        message: "Sure! You can see my available time on the booking management",
        date: "Jun 15, 2025",
    },
    // dummy data → total 50 messages
    ...Array.from({ length: 49 }, (_, i) => ({
        id: i + 2,
        name: `Dummy ${i + 1}`,
        message: "Yes, you are right about the job application, i will have a …",
        date: "Jun 15, 2025",
    })),
    ];

    return(
        <div className="min-h-screen bg-white">
            <Navbar />
        
            <main className="mx-auto w-full px-6 py-8 bg-white rounded-xl">
                <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
                    Advisor DashBoard
                </h1>

                <div className="flex flex-row">
                    <div className="flex gap-6 flex-col items-start">
                        {/*Advisor Side Bar*/}
                        <button
                            className="text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="message"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="message"}
                        >Message</button>
                        <button
                            className="text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="booking"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="booking"}
                        >View My Booking</button>
                        <button
                            className="text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="client"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="client"}
                        >View My Client</button>
                        <button
                            className="text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="availability"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="availability"}
                        >My Availability</button>
                        <button
                            className="text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="invoice"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="invoice"}
                        >Invoice</button>
                    </div>

                    <div className="ml-12">
                        {menuSelection === "message" && <MessagePage messageList={MOCK_MESSAGES} />}
                        {menuSelection === "booking" && <h1 className="text-black">Booking</h1>}
                        {menuSelection === "client" && <MyClientPage />}
                        {menuSelection === "availability" && <h1 className="text-black">Availability</h1>}
                        {menuSelection === "invoice" && <Invoice />}
                    </div>
                </div>

            </main>
        </div>
            
    );
}