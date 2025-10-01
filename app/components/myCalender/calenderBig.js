// components/booking/CalendarBigEvent.js
"use client";

import { IoTrashOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { DateTime } from "luxon";

export default function CalendarBigEvent({
  workshop,
  onDelete,
  onClose,
  onView,
}) {
  if (!workshop) return null;

  const dateStr = DateTime.fromISO(workshop.date).toFormat(
    "dd LLLL, yyyy (cccc)"
  );
  // Format time range in AM/PM format
  const formatTime = (time) => {
    if (!time) return "";
    return DateTime.fromFormat(time, "HH:mm:ss").toFormat("h:mm a");
  };

  const timeStr = `${formatTime(workshop.start_time)} – ${formatTime(
    workshop.end_time
  )}`;

  const location =
    workshop.location || "Online (Please use the link to enter our meeting)";
  const advisor = workshop.advisor || "N/A";
  const registerLink = workshop.register_link || "";
  const organizer = workshop.organizer || "Tech Connect Alberta";
  const description = workshop.description || "No description available.";

  return (
    <div className="bg-[#FDF1EC] p-6 rounded-xl shadow-xl text-black relative w-full max-w-2xl mx-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">{workshop.title}</h2>
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
        <span>{timeStr}</span>
      </div>

      {/* Location */}
      <div className="text-sm mb-2">
        <span className="font-medium">Location: </span>
        {location}
      </div>

      {/* Speaker */}
      <div className="text-sm mb-2">
        <span className="font-medium">Speaker: </span>
        {advisor}
      </div>

      {/* Organizer */}
      <div className="text-sm mb-4">
        <span className="font-medium">Organizer: </span>
        {organizer}
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg p-4 shadow-inner mb-4 max-h-48 overflow-y-auto">
        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-auto flex justify-center">
        {registerLink ? (
          <a
            href={registerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#E55B3C] hover:bg-[#d44f32] text-white font-semibold rounded-lg transition"
          >
            View / Register
          </a>
        ) : onView ? (
          <button
            onClick={onView}
            className="px-6 py-3 bg-[#E55B3C] hover:bg-[#d44f32] text-white font-semibold rounded-lg transition"
          >
            View Event Page
          </button>
        ) : null}
      </div>
    </div>
  );
}
