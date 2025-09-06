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
        <main className="w-full min-h-screen bg-white">
            <Navbar />
        
            <div className="mx-auto w-full max-w-8xl px-6 py-8">
                <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
                    Advisor DashBoard
                </h1>

                <div className="flex flex-row">
                    <div className="ml-0 w-60 h-57 rounded-lg bg-white p-1 flex flex-col shadow">
                        {/*Advisor Side Bar*/}
                        <button
                            className="w-full text-left rounded-md px-4 py-3 text-sm font-medium transition text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="message"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="message"}
                        >Message <span className="ml-1"></span>{">"}</button>
                        <button
                            className="w-full text-left rounded-md px-4 py-3 text-sm font-medium transition text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="booking"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="booking"}
                        >View My Booking <span className="ml-1"></span>{">"}</button>
                        <button
                            className="w-full text-left rounded-md px-4 py-3 text-sm font-medium transition text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="client"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="client"}
                        >View My Client <span className="ml-1"></span>{">"}</button>
                        <button
                            className="w-full text-left rounded-md px-4 py-3 text-sm font-medium transition text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="availability"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="availability"}
                        >My Availability <span className="ml-1"></span>{">"}</button>
                        <button
                            className="w-full text-left rounded-md px-4 py-3 text-sm font-medium transition text-black disabled:bg-[#E2B596] hover:bg-[#F0E0D5]"
                            type="button"
                            value="invoice"
                            onClick={handleMenuSelection}
                            disabled={menuSelection =="invoice"}
                        >Invoice <span className="ml-1"></span>{">"}</button>
                    </div>

                    <div className=" w-full ml-6">
                        {menuSelection === "message" && <MessagePage messageList={MOCK_MESSAGES} />}
                        {menuSelection === "booking" && <h1 className="text-black">Booking</h1>}
                        {menuSelection === "client" && <MyClientPage />}
                        {menuSelection === "availability" && <h1 className="text-black">Availability</h1>}
                        {menuSelection === "invoice" && <Invoice />}
                    </div>
                </div>

            </div>
        </main>
            
    );
}