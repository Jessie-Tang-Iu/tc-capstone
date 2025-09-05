"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NaNvbar from "../../components/NavBarBeforeSignIn";
import EmployerSidebar from "../../components/employerDashboard/EmployerSideBar";
import EmployerJobPostItem from "../../components/employerDashboard/EmployerJobPostItem";
import jobs from "../../data/jobs.json";

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

export default function JobPostsPage() {
  const router = useRouter();

  const pageSize = 5;
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(3);

  const total = jobs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const rows = useMemo(() => jobs.slice(start, end), [page]);

  return (
    <div className="min-h-screen bg-white">
      <NaNvbar />
      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Employer DashBoard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            <div className="border-t" />
            <div className="flex items-center justify-end gap-3 border-b px-4 py-3 text-sm text-black">
              <span>
                {start + 1} - {end}
              </span>
              <button
                className="rounded-md p-1 hover:bg-gray-100"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous"
              >
                <IconChevronLeft />
              </button>
              <button
                className="rounded-md p-1 hover:bg-gray-100"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next"
              >
                <IconChevronRight />
              </button>
            </div>

            <ul>
              {rows.map((job) => (
                <li key={job.id}>
                  <EmployerJobPostItem
                    {...job}
                    selected={selectedId === job.id}
                    onClick={() => setSelectedId(job.id)}
                    onManage={() =>
                      router.push(`/employerDashboard/jobPost/${job.id}`)
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
