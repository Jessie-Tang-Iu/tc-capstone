// app/components/event/BackToOrigin.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BackToOrigin() {
  const router = useRouter();
  const sp = useSearchParams();

  const from = sp.get("from"); // "calendar" | "list" | null
  const tab = sp.get("tab") || "upcoming";

  // Decide target in /event based on origin
  const view = from === "calendar" ? "calendar" : "list";
  const href = `/event?view=${encodeURIComponent(
    view
  )}&tab=${encodeURIComponent(tab)}`;

  // Prefer going back in history if possible and referrer was /event
  const onBack = () => {
    router.push(href);
  };

  return (
    <div className="w-full flex justify-start">
      <button
        onClick={onBack}
        className="mt-6 ml-8 text-sm text-gray-600 hover:underline inline-block mb-4"
        aria-label={`Back to ${view}`}
      >
        &lt; Back to {view === "calendar" ? "Calendar" : "List"}
      </button>
    </div>
  );
}
