"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/EmployerNavBar";
import EmployerSidebar from "../../components/employerDashboard/EmployerSideBar";
import ApplicationItem from "../../components/employerDashboard/EmployerApplicationItem";
import { useUser } from "@clerk/nextjs";

const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
    />
  </svg>
);

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"
    />
  </svg>
);

export default function ApplicationsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 5;
  const total = applications.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);

        const employerId = user.id;

        // fetch applications
        const resApp = await fetch(
          `/api/application?employer_id=${employerId}`
        );
        if (!resApp.ok) throw new Error("Failed to fetch applications");
        const apps = await resApp.json();

        // fetch jobs
        // const resJob = await fetch(`/api/job?employer_id=${employerId}`);
        // if (!resJob.ok) throw new Error("Failed to fetch jobs");
        // const jobs = await resJob.json();

        // // merge
        // const merged = apps.map((a) => {
        //   const job = jobs.find((j) => Number(j.id) === Number(a.job_id));
        //   return {
        //     ...a,
        //     job_title: job?.title || "Unknown Job",
        //   };
        // });
        // console.log("Applications: ", apps);
        setApplications(apps);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchApps();

    // Re-fetch when returning to tab
    const handleFocus = () => fetchApps();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const rows = useMemo(
    () => applications.slice(start, end),
    [applications, page]
  );

  if (!isLoaded) {
      // router.push("/");
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      );
    }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#f8eae2] to-white">
      <Navbar />

      <main className="mx-auto w-full px-6 py-8 rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-[#DD5B45]">
          Employer Dashboard
        </h1>

        <div className="flex gap-6">
          <EmployerSidebar />

          <section className="flex-1 rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-base font-semibold text-black">
                Total Applications: {total}
              </div>

              <div className="flex items-center gap-3 text-base text-black">
                <span>
                  {start + 1} - {end}
                </span>

                <button
                  className="rounded-md p-1 hover:bg-gray-100"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <IconChevronLeft />
                </button>

                <button
                  className="rounded-md p-1 hover:bg-gray-100"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <IconChevronRight />
                </button>
              </div>
            </div>

            {total === 0 ? (
              <div className="p-6 text-gray-500 text-center">
                No applications found.
              </div>
            ) : (
              <ul className="divide-y">
                {rows.map((row) => (
                  <li key={row.id} className="px-4 py-3">
                    <ApplicationItem
                      jobTitle={row.job_title}
                      applicationNo={row.id}
                      applicant={`${row.first_name ?? ""} ${
                        row.last_name ?? ""
                      }`}
                      status={row.status}
                      location={row.location}
                      appliedAgo={
                        row.appliedAt
                          ? new Date(row.appliedAt).toLocaleDateString()
                          : "N/A"
                      }
                      onManage={() =>
                        router.push(`/employerDashboard/application/${row.id}`)
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
