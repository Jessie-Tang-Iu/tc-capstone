"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NaNvbar from "../../components/NavBar";
import EmployerSidebar from "../../components/employerDashboard/EmployerSideBar";
import ApplicationItem from "../../components/employerDashboard/EmployerApplicationItem";
import applications from "../../data/applications.json";

const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path
      fill="currentColor"
      d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
    />
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path
      fill="currentColor"
      d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"
    />
  </svg>
);

export default function ApplicationsPage() {
  const router = useRouter();

  const pageSize = 5;
  const total = applications.length;

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  const rows = useMemo(() => applications.slice(start, end), [page]);

  const goManage = (id) => router.push(`/employerDashboard/application/${id}`);

  return (
    <div className="min-h-screen bg-white">
      <NaNvbar />

      <main className="mx-auto w-full px-6 py-8 bg-white rounded-xl">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Employer DashBoard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-sm font-semibold text-black">
                Total Application: {total}
              </div>
              <div className="flex items-center gap-3 text-sm text-black">
                <span>
                  {start + 1} - {end}
                </span>
                <button
                  className="rounded-md p-1 hover:bg-gray-100"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <IconChevronLeft />
                </button>
                <button
                  className="rounded-md p-1 hover:bg-gray-100"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <IconChevronRight />
                </button>
              </div>
            </div>

            {/* List */}
            <ul className="divide-y">
              {rows.map((row) => (
                <li key={row.id} className="px-4 py-3">
                  <ApplicationItem
                    jobTitle={row.jobTitle}
                    applicationNo={row.applicationNo}
                    applicant={row.applicant}
                    headline={row.headline}
                    location={row.location}
                    appliedAgo={row.appliedAgo}
                    onManage={() =>
                      router.push(`/employerDashboard/application/${row.id}`)
                    }
                  />
                </li>
              ))}
            </ul>

            <div className="border-t" />
          </section>
        </div>
      </main>
    </div>
  );
}
