"use client";

export default function RequestDetailsCard({ request, onClose }) {
  if (!request) return null;

  const displayName =
    request.first_name && request.last_name
      ? `${request.first_name} ${request.last_name}`
      : request.name ?? "N/A";

  const roleTitles = {
    Employer: "Employer Request Details",
    Advisor: "Advisor Request Details",
  };

  const title = roleTitles[request.role] ?? "Request Details";

  // Map status to readable text
  const statusText =
    request.status === "underreview"
      ? "Under Review"
      : request.status === "active"
      ? "Active"
      : request.status === "banned"
      ? "Banned"
      : request.status ?? "N/A";

  return (
    <section className="flex-1 rounded-xl bg-white shadow p-6 text-black">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="space-y-3 text-sm text-black">
        <div>
          <strong>Name:</strong> {displayName}
        </div>
        <div>
          <strong>ID:</strong> {request.id}
        </div>
        <div>
          <strong>Role:</strong> {request.role ?? "N/A"}
        </div>
        <div>
          <strong>Email:</strong> {request.email ?? "N/A"}
        </div>
        <div>
          <strong>Phone:</strong> {request.phone ?? "N/A"}
        </div>

        {/* Employer-only fields */}
        {request.role === "employer" && (
          <>
            <div>
              <strong>Company Name:</strong> {request.company_name ?? "N/A"}
            </div>
            <div>
              <strong>Company Role:</strong> {request.company_role ?? "N/A"}
            </div>
          </>
        )}

        {/* Advisor-only fields */}
        {request.role === "advisor" && (
          <>
            <div>
              <strong>Advisor Title:</strong> {request.advisor_title ?? "N/A"}
            </div>
            <div>
              <strong>Company Name:</strong> {request.company_name ?? "N/A"}
            </div>
          </>
        )}

        <div>
          <strong>Status:</strong> {statusText}
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
