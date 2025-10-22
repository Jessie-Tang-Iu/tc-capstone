// app/components/advisorDashboard/sessionBigEvent.js


"use client";

import { IoTrashOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function SessionBigEvent({
  session,
  onDelete,
  onClose
}) {

    // advisor name status
    const [advisorName, setAdvisorName] = useState("");

    if (!session) return null;

    const dateStr = DateTime.fromISO(session.date).toFormat(
        "dd LLLL, yyyy (cccc)"
    );

    const description = session.description || "No description available.";

    useEffect(() => {
        if (!session.advisorId) return;

        (async () => {
            try {
                const res = await fetch(`/api/advisor_list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ advisorId: session.advisorId })}
                );
                if (!res.ok) {console.error("Failed to advisor"); return;}
        
                const data = await res.json();

                setAdvisorName(data.first_name + ' ' + data.last_name);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        })();
    }, [session.advisorId]);

  return (
    <div className="bg-[#e0f1f3] p-6 rounded-xl shadow-xl text-black relative w-full max-w-2xl mx-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">{session.title}</h2>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button onClick={onDelete} title="Delete">
              <IoTrashOutline
                className="cursor-pointer text-gray-600 hover:text-red-500"
                size={22}
              />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} title="Close">
              <RxCross2
                className="cursor-pointer text-gray-600 hover:text-black"
                size={22}
              />
            </button>
          )}
        </div>
      </div>

      {/* Date + Time */}
      <div className="text-sm text-gray-700 mb-2 flex justify-between">
        <span>{dateStr}</span>
        <span>{session.start_time} - {session.end_time}</span>
      </div>

      {/* Client */}
      <div className="text-sm mb-2">
        <span className="font-medium">Client: </span>
        {session.clientName}
      </div>

      {/* Advisor */}
      <div className="text-sm mb-4">
        <span className="font-medium">Advisor: </span>
        {advisorName}
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg p-4 shadow-inner mb-4 max-h-48 overflow-y-auto">
        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}
