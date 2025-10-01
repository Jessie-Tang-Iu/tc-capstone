"use client";

export default function UserDetailsCard({ user, roleLabel, onClose }) {
  if (!user) return null;

  // Proper display name
  const displayName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.name ?? "N/A";

  // Map roles → titles
  const roleTitles = {
    Admin: "Admin Details",
    Employer: "Employer Details",
    Advisor: "Advisor Details",
    Member: "Member Details",
  };

  const title = roleTitles[roleLabel] ?? "User Details";

  return (
    <section className="flex-1 rounded-xl bg-white shadow p-6 text-black">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="space-y-3 text-sm text-black">
        <div>
          <strong>Name:</strong> {displayName}
        </div>
        <div>
          <strong>ID:</strong> {user.id}
        </div>
        <div>
          <strong>Role:</strong> {roleLabel}
        </div>
        <div>
          <strong>Email:</strong> {user.email ?? "N/A"}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone ?? "N/A"}
        </div>

        {/* Employer-only fields */}
        {roleLabel === "Employer" && (
          <>
            <div>
              <strong>Company Name:</strong> {user.company_name ?? "N/A"}
            </div>
            <div>
              <strong>Company Role:</strong> {user.company_role ?? "N/A"}
            </div>
          </>
        )}

        {/* Advisor-only fields */}
        {roleLabel === "Advisor" && (
          <>
            <div>
              <strong>Advisor Title:</strong> {user.advisor_title ?? "N/A"}
            </div>
            <div>
              <strong>Company Name:</strong> {user.company_name ?? "N/A"}
            </div>
          </>
        )}

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
