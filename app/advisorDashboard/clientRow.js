import { useEffect, useState } from "react";




export default function ClientRow({
    client,
    onMessage,
}) {

    const [statusStyle, setStatusStyle] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(client.status || "active");
    const [expanded, setExpanded] = useState(false);


    useEffect(() => {
        if(!selectedStatus) return;

        if(selectedStatus === 'active') {
            setStatusStyle("px-2 py-1 rounded bg-blue-100 text-blue-700");
        } else if(selectedStatus === 'closed') {
            setStatusStyle("px-2 py-1 rounded bg-red-100 text-red-700");
        } else if(selectedStatus === 'pending') {
            setStatusStyle("px-2 py-1 rounded bg-yellow-100 text-yellow-700");
        }
    }, [selectedStatus]);

    const handleChangeStatus = (newStatus) => {
        const userConfirmed = confirm("Are you sure to change the " + client.first_name + ' ' + client.last_name + " status to: " + newStatus + "?");
        if (userConfirmed) {
            setSelectedStatus(newStatus);
            saveStatus(newStatus);
        } else {
            // Optional: Add logic for when the user cancels
            console.log("User cancelled the status change.");
        }
    };


    const saveStatus = async (newStatus) => {

        // sessionId and new Status
        const newStatusItem = {
            sessionId: client.session_id,
            status: newStatus
        };

        try {
            const res = await fetch(`/api/advisory_sessions`, {
                    method: 'PATCH',
                    headers: {  "Content-Type": "application/json" },
                    body: JSON.stringify(newStatusItem)});

            if (!res.ok) {console.error("Failed to save change"); return;}

            const changeStatus = await res.json();
            console.log("Save Change: ", changeStatus);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }

    // Display message
    const toggleExpanded = () => setExpanded((prev) => !prev);

    const displayMessage = client.message
        ? expanded
        ? client.message
        : client.message.slice(0, 50) + (client.message.length > 50 ? "..." : "")
        : "Client has not sent a request yet";

    return(
        <div className="flex flex-row justify-between text-black text-start border-b py-3">
            <p className="w-1/12 px-2 py-1">{client.session_id}</p>
            <p className="w-1/12 px-2 py-1">{client.first_name} {client.last_name}</p>
            <p className="w-2/12 px-2 py-1">{client.email}</p>
            <div className="w-4/12 px-2 py-1">
                <p>{displayMessage}</p>
                {client.message && client.message.length > 50 && (
                    <button
                    onClick={toggleExpanded}
                    className="text-gray-500 hover:underline"
                    >
                    {expanded ? "Show less" : "Show more"}
                    </button>
                )}
            </div>
            <div className="w-1/12">
                {selectedStatus && (
                    <select 
                    className={`w-4/5 h-8 border rounded text-black ${statusStyle}`}
                    id="dropdown" 
                    value={selectedStatus} 
                    onChange={(e) => handleChangeStatus(e.target.value)}>
                        <option value="active" className="p-3 border rounded text-blue-700 bg-blue-100">Active</option>
                        <option value="pending" className="p-3 border rounded text-yellow-700 bg-yellow-100">Pending</option>
                        <option value="closed" className="p-3 border rounded text-red-700 bg-red-100">Closed</option>
                    </select>
                )}
            </div>
            <p className="w-2/12 px-2 py-1">10/5/2025 20:00 MTU</p>
            <div className="w-1/12">
                <button
                    onClick={onMessage}
                    className="rounded-md w-4/5 h-8 px-2 py-1 bg-yellow-600 text-sm font-semibold text-white
                            hover:bg-yellow-700 active:scale-[0.98] transition"
                >
                    Message
                </button>
            </div>
            
        </div>
    );
}