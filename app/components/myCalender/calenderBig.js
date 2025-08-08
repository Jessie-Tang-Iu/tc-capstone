// components/booking/CalendarBigEvent.tsx
"use client";

import { IoTrashOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { DateTime } from "luxon";

export default function CalendarBigEvent({ workshop, onDelete, onClose }) {
  if (!workshop) return null;

  const dateStr = DateTime.fromISO(workshop.date).toFormat(
    "dd LLLL, yyyy (cccc)"
  );
  const timeStr = `${workshop.start_time} – ${workshop.end_time} MDT`;
  const location =
    workshop.location || "Online (Please use the link to enter our meeting)";
  const advisor = workshop.advisor || "N/A";
  const registerLink = workshop.register_link || "";
  const organizer = workshop.organizer || "Tech Connect Alberta";

  return (
    <div className="bg-[#FDF1EC] p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
      {/* Top right icons */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold mr-4">{workshop.title}</h2>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button onClick={onDelete} title="Delete">
              <IoTrashOutline
                className="cursor-pointer text-gray-600 hover:text-red-500"
                size={20}
              />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} title="Close">
              <RxCross2
                className="cursor-pointer text-gray-600 hover:text-black"
                size={20}
              />
            </button>
          )}
        </div>
      </div>

      {/* Date + Time */}
      <div className="text-sm text-gray-700 mb-2 flex justify-between">
        <span>{dateStr}</span>
        <span>{timeStr}</span>
      </div>

      {/* Location */}
      <div className="text-sm mb-2">
        <span className="font-medium">Location: </span>
        {location}
      </div>

      {/* Advisor */}
      <div className="text-sm mb-2">
        <span className="font-medium">Speaker: </span>
        {advisor}
      </div>

      <hr className="my-3" />

      {/* Register link */}
      {registerLink && (
        <div className="text-sm mb-2 break-words">
          <span className="font-medium">Register Link: </span>
          <a
            href={registerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {registerLink}
          </a>
        </div>
      )}

      {/* Organizer */}
      <div className="text-sm">
        <span className="font-medium">Organizer: </span>
        {organizer}
      </div>
    </div>
  );
}
