"use client";

export default function Section({ title, children }) {
  return (
    <section className="mt-6 rounded-xl bg-white shadow">
      <div className="border-b px-4 py-3 text-lg font-semibold text-black">
        {title}
      </div>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}
