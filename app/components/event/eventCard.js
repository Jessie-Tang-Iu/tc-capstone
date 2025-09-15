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
}) {
  const router = useRouter();

  const activeTab = tab ?? currentTab ?? "upcoming";

  const handleClick = () => {
    if (id === undefined || id === null) return;
    const target = `/event/${encodeURIComponent(
      String(id)
    )}?from=list&tab=${encodeURIComponent(activeTab)}`;
    router.push(target);
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

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-lg shadow px-6 py-4 space-y-2 text-black cursor-pointer hover:opacity-95 transition"
      aria-label={`Open event ${title}`}
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
      {(highlight || description) && (
        <div className="pt-2 text-sm">
          {highlight && <p className="font-semibold text-black">{highlight}</p>}
          {description && <p className="line-clamp-1">{description}</p>}
        </div>
      )}
    </div>
  );
}
