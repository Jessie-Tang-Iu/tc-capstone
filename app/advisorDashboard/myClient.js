"use client";

import { useEffect, useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import PlaceholderCard from "../components/adminDashboard/PlaceholderCard";
import ClientRow from "./clientRow";
import ChatWindow from "../components/ChatWindow";



export default function MyClientPage({currentUserId}) {

    const [query, setQuery] = useState("");
    const [openChat, setOpenChat] = useState(false);
    const [chatTo, setChatTo] = useState("");

    // initialize from JSON
    const [clients, setClients] = useState([]);

    // fetch the clients for advisor by advisorId
    useEffect(() => {
        console.log("Fetching with advisorId:", currentUserId); 
        (async () => {
            try {
                const res = await fetch(
                    `/api/advisory_sessions/advisor?advisorId=${currentUserId}`
                );
                if (!res.ok) {console.error("Failed to fetch events"); return;}
          
                const data = await res.json();

                console.log("Fetched data:", data);
                setClients(data);
            } catch(error) {
                console.error("Fetch error: ", error);
            }
        })();
    }, [currentUserId])

    const openMessage = (e) => {
        setChatTo(e);
        setOpenChat(true);
    };

    // filter clients by search input
    const filteredClients = clients.filter((u) =>
        u.first_name.toLowerCase().includes(query.toLowerCase()) ||
        u.last_name.toLowerCase().includes(query.toLowerCase()) ||
        String(u.session_id).includes(query.toLowerCase())  ||
        u.status.toLowerCase().includes(query.toLowerCase())
    );

    // sorting clients list by status
    const statusOrder = {
        active: 1,
        pending: 2,
        closed: 3,
    };

    const sortedClients = [...filteredClients].sort((a, b) => {
        return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
    });

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
                        placeholder="Client Name | Session ID | Status"
                    />
                </div>
            </div>

            {/* My Client */}
            <div className="mb-4 rounded-xl bg-white shadow text-center">
                <div className="flex flex-row border-b rounded-t-xl text-white font-bold justify-between bg-[#E55B3C] px-4 py-3 text-1xl text-start">
                    <p className="w-1/12 px-2 py-1">Session ID</p>
                    <p className="w-1/12 px-2 py-1">Name</p>
                    <p className="w-2/12 px-2 py-1">Email</p>
                    <p className="w-4/12 px-2 py-1">Request</p>
                    <p className="w-1/12 px-2 py-1">Status</p>
                    <p className="w-2/12 px-2 py-1">Created Date</p>
                    <p className="w-1/12 px-2 py-1">Actions</p>
                </div>

                <div className="p-4">
                    {clients.length === 0 ? (
                        <PlaceholderCard
                            title="No clients found"
                            description="Try again"
                        />
                    ) : (
                        <div className="max-h-140 overflow-y-auto">
                            {sortedClients.map((u) => ( 
                                <ClientRow
                                key={u.session_id}
                                client={u}
                                onMessage={() => openMessage(u.client_id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {openChat && (
                <ChatWindow
                    me={currentUserId}
                    recipient={chatTo}
                    onClose={() => setOpenChat(false)}
                    onSend={(text) => console.log("send:", { to: chatTo, text })}
                />
            )}
        </main>
    );
}