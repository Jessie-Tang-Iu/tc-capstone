"use client";

import Link from "next/link";
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function AdvisorCard({ advisor }) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return(
        <div className="bg-white shadow-md rounded-lg p-6 m-4">
            <h2 className="text-2xl font-bold mb-2">{advisor.name}</h2>
            <p className="text-gray-700 mb-4">{advisor.description}</p>
            <Link href={`/advisor/${advisor.advisorID}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    View Profile
                </button>
            </Link>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsChatOpen(true)}>
                Open Chat
            </button>

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