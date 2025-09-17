// app/components/event/eventCard.jsx
"use client";

import { useRouter } from "next/navigation";
import { formatDateToFullDisplay } from "@/app/components/ui/formatDate";

export default function EventCard({
  id,
  date,
  title,
  location,
  highlight,
  description,
  tab,
  currentTab,
  /** NEW: if provided, clicking the card will call this instead of navigating */
  onSelect,
  /** OPTIONAL: if true, suppress navigation even if onSelect is not provided */
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
    if (onSelect) return onSelect(); // ← admin usage
    if (!disableNav) return navigate(); // ← default/public usage
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const dateText =
    date && !Number.isNaN(Date.parse(date))
      ? formatDateToFullDisplay(date)
      : date || "Invalid date";

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
          {highlight && <p className="font-semibold text-black">{highlight}</p>}
        </div>
      )}
    </div>
  );
}
