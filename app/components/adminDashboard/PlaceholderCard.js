"use client";

export default function PlaceholderCard({
  title = "Nothing here yet",
  description = "Content will appear once available.",
}) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
      <div className="text-base font-semibold text-black">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{description}</div>
    </div>
  );
}
