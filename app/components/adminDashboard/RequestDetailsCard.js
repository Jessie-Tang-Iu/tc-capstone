// app/components/adminDashboard/RequestDetailsCard.js
"use client";

export default function RequestDetailsCard({ request, onClose }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow text-black">
      <h2 className="text-2xl font-bold mb-4 ">Request Details</h2>

      <p>
        <strong>ID:</strong> {request.id}
      </p>
      <p>
        <strong>Name:</strong> {request.name}
      </p>
      <p>
        <strong>Subtitle:</strong> {request.subtitle}
      </p>

      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-[#E55B3C] text-white rounded-md hover:bg-[#c4452e]"
      >
        Close
      </button>
    </div>
  );
}
