"use client";

import { useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import usersData from "@/app/data/userForAdminPage.json" assert { type: "json" };
import PlaceholderCard from "../components/adminDashboard/PlaceholderCard";
import ClientRow from "./clientRow";
import ChatWindow from "../components/ChatWindow";



export default function MyClientPage() {

    const [query, setQuery] = useState("");
    const [openChat, setOpenChat] = useState(false);
    const [chatTo, setChatTo] = useState("");

    // initialize from JSON
    const [clients, setClients] = useState(usersData.normal || []);

    const filteredClient = clients.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
    );

    const openMessage = (name) => {
        setChatTo(name);
        setOpenChat(true);
    };

    return(
        <main>
            {/* Header: centered title, search on its own row */}
            <div className="mb-4 rounded-xl bg-white p-6 shadow text-center">
                <div className="mb-4 text-4xl font-semibold text-[#E55B3C]">
                    Client Management
                </div>
                <div className="flex justify-center">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onSearch={() => {}}
                        placeholder="Client Name"
                    />
                </div>
            </div>

            {/* My Client */}
            <div className="mb-4 rounded-xl bg-white shadow text-center">
                <p className="flex items-start border-b px-4 py-3 text-2xl font-semibold text-black">Client List</p>
                <div className="p-4">
                    {filteredClient.length === 0 ? (
                        <PlaceholderCard
                            title="No clients found"
                            description="Try again"
                        />
                    ) : (
                        <div className="h-140 overflow-y-auto pr-2">
                            {filteredClient.map((u) => ( 
                                <ClientRow
                                key={u.id}
                                name={u.name}
                                subtitle={u.subtitle}
                                onMessage={() => openMessage(u.name)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {openChat && (
                <ChatWindow
                    recipient={chatTo}
                    onClose={() => setOpenChat(false)}
                    onSend={(text) => console.log("send:", { to: chatTo, text })}
                />
            )}
        </main>
    );
}