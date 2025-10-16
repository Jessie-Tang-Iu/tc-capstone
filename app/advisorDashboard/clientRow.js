import { useEffect, useState } from "react";




export default function ClientRow({
    sessionID,
    name,
    message,
    subtitle,
    onMessage,
}) {

    const [subtitleStyle, setSubtitleStyle] = useState("");
    const [selectedValue, setSelectedValue] = useState(subtitle || "active");
    const [expanded, setExpanded] = useState(false);


    useEffect(() => {
        if(!selectedValue) return;

        if(selectedValue === 'active') {
            setSubtitleStyle("px-2 py-1 rounded bg-blue-100 text-blue-700");
        } else if(selectedValue === 'closed') {
            setSubtitleStyle("px-2 py-1 rounded bg-red-100 text-red-700");
        } else if(selectedValue === 'pending') {
            setSubtitleStyle("px-2 py-1 rounded bg-yellow-100 text-yellow-700");
        }
    }, [selectedValue]);

    useEffect(() => {
        if(!subtitle) return;

        if(subtitle === 'active') {
            setSubtitleStyle("px-2 py-1 rounded bg-blue-100 text-blue-700");
        }

        if(subtitle === 'closed') {
            setSubtitleStyle("px-2 py-1 rounded bg-red-100 text-red-700");
        }

        if(subtitle === 'pending') {
            setSubtitleStyle("px-2 py-1 rounded bg-yellow-100 text-yellow-700");
        }
    },[subtitle])

    const handleChangeStatus = () => {
        console.log("Status: ", selectedValue);
        saveStatus();
        alert("You have successfully changed the status to: " + selectedValue);
    }

    const saveStatus = async () => {

        // sessionId and new Status
        const newStatus = {
            sessionId: sessionID,
            status: selectedValue
        };

        try {
            const res = await fetch(`/api/advisory_sessions`, {
                    method: 'PATCH',
                    headers: {  "Content-Type": "application/json" },
                    body: JSON.stringify(newStatus)});

            if (!res.ok) {console.error("Failed to save change"); return;}

            const changeStatus = await res.json();
            console.log("Save Change: ", changeStatus);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }

    // Display message
    const toggleExpanded = () => setExpanded((prev) => !prev);

    const displayMessage = message
        ? expanded
        ? message
        : message.slice(0, 50) + (message.length > 50 ? "..." : "")
        : "Client has not sent a request yet";

    return(
        <div className="mb-3 rounded-xl bg-[#F7EAE2] px-4 py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Left: name + subtitle */}
                <div className="min-w-0">
                    <div className="text-[20px] font-bold text-black text-left">{name}</div>
                    <p className="text-gray-700 text-left">Session ID: {sessionID}</p>

                    <div className="text-gray-700 text-left max-w-120">
                        <p>Client Request: {displayMessage}</p>

                        {/* Toggle button only if message exists and is long */}
                        {message && message.length > 50 && (
                            <button
                            onClick={toggleExpanded}
                            className="mt-1 text-sm text-grey-600 hover:underline"
                            >
                            {expanded ? "Show less" : "Show more"}
                            </button>
                        )}
                    </div>
                    
                </div>

                {/* Right: actions */}
                <div className="flex flex-col shrink-0 items-end gap-3">
                    {subtitle && (
                        <select 
                        className={`w-25 border rounded text-black ${subtitleStyle}`}
                        id="dropdown" 
                        value={selectedValue} 
                        onChange={(e) => setSelectedValue(e.target.value)}>
                            <option value="active" className="w-20 p-3 border rounded text-blue-500 bg-blue-100">Active</option>
                            <option value="pending" className="w-20 p-3 border rounded text-yellow-500 bg-yellow-100">Pending</option>
                            <option value="closed" className="w-20 p-3 border rounded text-red-500 bg-red-100">Closed</option>
                        </select>
                    )}
                    <div className="flex gap-4">
                        {/* Dark yellow message button with white text */}
                        <button
                            onClick={onMessage}
                            className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white
                                    hover:bg-yellow-700 active:scale-[0.98] transition"
                        >
                            Message
                        </button>

                        {subtitle &&(
                            <button 
                                onClick={handleChangeStatus}
                                className="w-25 rounded-md bg-[#44a237] px-4 py-2 text-sm font-semibold text-white
                                hover:bg-green-700 active:scale-[0.98] transition">Save</button>
                        )}
                    
                    </div>
                    
                    
                    
                    
                </div>
            </div>
        </div>
    );
}