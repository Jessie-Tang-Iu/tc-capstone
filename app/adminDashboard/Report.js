"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/app/components/ui/SearchBar";
import ReportRow from "@/app/components/adminDashboard/ReportRow";
import PlaceholderCard from "@/app/components/adminDashboard/PlaceholderCard";
import reportsDataDefault from "@/app/data/reportsForAdminPage.json";

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

export default function ReportsPanel({ data = reportsDataDefault }) {
  const [query, setQuery] = useState("");
  const reports = data.reports || [];

  // filter by id/category/issue/reporter/reportId
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return reports;
    return reports.filter((r) =>
      [String(r.id), r.category, r.issue, r.reporter, r.reportId].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  }, [reports, query]);

  // pagination
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, filtered.length);
  const pageRows = filtered.slice(start, end);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 rounded-xl bg-white p-6 text-center shadow">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
          Report Management
        </div>
        <div className="flex justify-center">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={() => {}}
            placeholder="Report ID | Issue Type"
          />
        </div>
      </div>

      {/* Pager */}
      <div className="mb-2 flex items-center justify-between text-sm text-black">
        <div>Total Report: {filtered.length}</div>
        <div className="flex items-center gap-2">
          <span>{filtered.length === 0 ? "0" : `${start + 1}-${end}`}</span>
          <span>/ {filtered.length}</span>
          <button
            className="rounded-md p-1 hover:bg-gray-100 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <IconChevronLeft />
          </button>
          <button
            className="rounded-md p-1 hover:bg-gray-100 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* List */}
      {pageRows.length === 0 ? (
        <PlaceholderCard
          title="No reports found"
          description="Try a different search."
        />
      ) : (
        <div className="rounded-xl bg-white p-3">
          {pageRows.map((r) => (
            <ReportRow
              key={r.id}
              category={r.category}
              reportId={r.reportId}
              reporter={r.reporter}
              issue={r.issue}
              timeAgo={r.timeAgo}
              onDetails={() => console.log("details", r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
