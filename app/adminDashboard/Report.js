"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/app/components/ui/SearchBar";
import ReportRow from "@/app/components/adminDashboard/ReportRow";
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

function PrettyPlaceholder({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-xl bg-white py-20 shadow-inner border border-gray-100 mt-6">
      <div className="mb-4 text-[#E55B3C] text-6xl">📄</div>
      <div className="text-xl font-semibold text-gray-800 mb-2">{title}</div>
      <div className="text-gray-500 text-sm max-w-sm">{description}</div>
    </div>
  );
}

export default function ReportsPanel({
  data = reportsDataDefault,
  onShowDetails,
}) {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [fetchedReports, setFetchedReports] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch from API
  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const reports = Array.isArray(json) ? json : json?.reports;
      setFetchedReports(reports ?? []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setLoadError(err.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const reportsArray = (fetchedReports ?? data.reports) || [];

  // Filter
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return reportsArray;
    return reportsArray.filter((r) =>
      [String(r.id), r.category, r.issue, r.reporter, r.reportId].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  }, [reportsArray, query]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const idA = Number(a.reportId ?? a.id ?? 0);
      const idB = Number(b.reportId ?? b.id ?? 0);
      return sortOrder === "newest" ? idB - idA : idA - idB;
    });
    return arr;
  }, [filtered, sortOrder]);

  // Pagination
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, sorted.length);
  const pageRows = sorted.slice(start, end);

  // When a report is deleted
  const handleDelete = (id) => {
    setFetchedReports((prev) =>
      prev.filter((r) => r.reportId !== id && r.id !== id)
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <div className="mb-4 text-3xl font-semibold text-[#E55B3C] text-center">
          Report Management
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative">
          <div className="w-[120px]" />
          <div className="flex justify-center flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={() => {}}
              placeholder="Search by ID | Category | Reporter"
            />
          </div>
          <div className="flex justify-end w-[120px]">
            <button
              onClick={() =>
                setSortOrder((prev) =>
                  prev === "newest" ? "oldest" : "newest"
                )
              }
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-[#E55B3C] focus:outline-none focus:ring-2 focus:ring-[#E55B3C] transition"
            >
              Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>
        </div>

        {fetchedReports === null && !loadError && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Loading reports…
          </div>
        )}
        {loadError && (
          <div className="mt-2 text-xs text-red-500 text-center">
            Failed to load from API, showing local data.
          </div>
        )}
      </div>

      {/* Pager */}
      <div className="mb-2 flex items-center justify-between text-sm text-gray-700">
        <div className="font-medium">Showing {sorted.length} results</div>
        <div className="flex items-center gap-2">
          <span>
            {sorted.length === 0 ? "0" : `${start + 1}-${end}`} /{" "}
            {sorted.length}
          </span>
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
        <PrettyPlaceholder
          title="No Reports Found"
          description="Try adjusting your search or sorting options to view available reports."
        />
      ) : (
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          {pageRows.map((r, idx) => (
            <ReportRow
              key={
                r.reportId ??
                r.public_code ??
                `${r.id}-${r.category}-${r.issue}-${start + idx}`
              }
              category={r.category}
              reportId={r.reportId}
              reporter={r.reporter}
              issue={r.issue}
              timeAgo={r.timeAgo}
              isRemoved={r.isRemoved}
              isBanned={r.isBanned}
              onDetails={() =>
                onShowDetails?.({
                  ...r,
                  id: r.id || r.reportId || r.report_id,
                  report_id: r.reportId || r.id,
                })
              }
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
