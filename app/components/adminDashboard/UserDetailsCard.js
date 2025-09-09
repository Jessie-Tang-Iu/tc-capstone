"use client";

export default function UserDetailsCard({ user, roleLabel, onClose }) {
  if (!user) return null;

  return (
    <section className="flex-1 rounded-xl bg-white shadow p-6 text-black">
      <h2 className="text-xl font-semibold mb-4">User Details</h2>

      <div className="space-y-3 text-sm text-black">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>ID:</strong> {user.id}
        </div>
        <div>
          <strong>Role:</strong> {roleLabel}
        </div>
        <div>
          <strong>Subtitle:</strong> {user.subtitle ?? "—"}
        </div>
        <div>
          <strong>Email:</strong> {user.email ?? "—"}
        </div>
        <div>
          <strong>Location:</strong> {user.location ?? "—"}
        </div>
        <div>
          <strong>Status:</strong> {user.banned ? "Banned" : "Active"}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onClose}
          className="rounded-md bg-[#E2B596] px-4 py-2 text-sm font-medium hover:bg-[#D1A482]"
        >
          Close
        </button>
      </div>
    </section>
  );
}
