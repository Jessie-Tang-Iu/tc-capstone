// app/components/event/eventCard.jsx
"use client";

import { useRouter } from "next/navigation";

export default function EventCard({
  id,
  date,
  title,
  location,
  highlight,
  tab,
  currentTab,
  onSelect,
  disableNav = false,
}) {
  const router = useRouter();
  const activeTab = tab ?? currentTab ?? "upcoming";

  const navigate = () => {
    if (id === undefined || id === null) return;
    const target = `/event/${encodeURIComponent(
      String(id)
    )}?from=list&tab=${encodeURIComponent(activeTab)}`;
    router.push(target);
  };

  const handleClick = () => {
    if (onSelect) return onSelect();
    if (!disableNav) return navigate();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Inline formatting logic here
  let dateText = date || "Invalid date";
  if (date) {
    let d;

    // Case 1: pure date string "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, day] = date.split("-").map(Number);
      d = new Date(y, m - 1, day); // Local, no UTC shift
    } else {
      // Case 2: datetime string (e.g. ISO 8601)
      d = new Date(date);
    }

    if (!isNaN(d.getTime())) {
      const datePart = d.toLocaleDateString("en-GB"); // DD/MM/YYYY
      const timePart = date.includes("T") // only show time if datetime provided
        ? d.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "";
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });

      dateText = timePart
        ? `${datePart}, ${timePart} (${weekday})`
        : `${datePart} (${weekday})`;
    }
  }
  const isInteractive = !!onSelect || !disableNav;

  return (
    <div
      role={isInteractive ? "button" : "group"}
      tabIndex={isInteractive ? 0 : -1}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      className={`bg-white rounded-lg shadow px-6 py-4 space-y-2 text-black
        ${isInteractive ? "cursor-pointer hover:opacity-95 transition" : ""}`}
      aria-label={isInteractive ? `Open event ${title}` : undefined}
    >
      {/* Date */}
      <div className="text-[13px] text-gray-700 uppercase tracking-wide font-medium">
        {dateText}
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-black leading-snug">{title}</h2>

      {/* Location */}
      {location && <div className="text-sm text-gray-400">{location}</div>}

      {/* Description */}
      {highlight && (
        <div className="pt-2 text-sm">
          <p className="font-semibold text-black">{highlight}</p>
        </div>
      )}
    </div>
  );
}
