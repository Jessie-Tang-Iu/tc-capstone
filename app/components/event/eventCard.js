"use client";

import { useRouter } from "next/navigation";

export default function EventCard({
  id,
  date,
  title,
  location,
  highlight,
  description,
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/event/${id}`);
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
    timeZone: "America/Edmonton", // MST/MDT
  }).format(new Date(date));

  return (
    <div
      className="bg-white rounded-lg shadow px-6 py-4 space-y-2 text-black cursor-pointer hover:opacity-95 transition"
      onClick={handleClick}
    >
      {/* Date */}
      <div className="text-[13px] text-gray-700 uppercase tracking-wide font-medium">
        {formattedDate}
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-black leading-snug">{title}</h2>

      {/* Location */}
      <div className="text-sm text-gray-400">{location}</div>

      {/* Description */}
      <div className="pt-2 text-sm">
        <p className="font-semibold text-black">{highlight}</p>
        <p className="line-clamp-1">{description}</p>{" "}
      </div>
    </div>
  );
}
