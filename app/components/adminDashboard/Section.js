"use client";

export default function Section({ title, children }) {
  return (
    <section className="mt-6 rounded-xl bg-white shadow">
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}
