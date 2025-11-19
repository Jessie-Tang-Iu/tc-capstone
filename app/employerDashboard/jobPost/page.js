"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/EmployerNavBar";
import EmployerSidebar from "../../components/employerDashboard/EmployerSideBar";
import EmployerJobPostItem from "../../components/employerDashboard/EmployerJobPostItem";

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
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageSize = 5;

  // fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/job/public", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const total = jobs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const rows = useMemo(() => jobs.slice(start, end), [jobs, page]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8eae2] to-white">
      <Navbar />
      <main className="mx-auto w-full px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Employer DashBoard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-lg font-semibold text-black">Job Posts</div>
              <button
                onClick={() =>
                  router.push("/employerDashboard/jobPost/editform")
                }
                className="bg-[#EE7D5E] text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Add Job Post
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-3 border-b px-4 py-3 text-sm text-black">
              <span>
                {start + 1} - {end}
              </span>
              <button
                className="rounded-md p-1 hover:bg-gray-100"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <IconChevronLeft />
              </button>
              <button
                className="rounded-md p-1 hover:bg-gray-100"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <IconChevronRight />
              </button>
            </div>

            {loading ? (
              <p className="text-center py-6 text-gray-500">Loading...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center py-6 text-gray-500">
                No job posts found.
              </p>
            ) : (
              <ul>
                {rows.map((job) => (
                  <li key={job.id}>
                    <EmployerJobPostItem
                      {...job}
                      selected={selectedId === job.id}
                      onClick={() => setSelectedId(job.id)}
                      onManage={() =>
                        router.push(
                          `/employerDashboard/jobPost/editform?id=${job.id}`
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t" />
          </section>
        </div>
      </main>
    </div>
  );
}
