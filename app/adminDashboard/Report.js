"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function ReportsPanel({
  data = reportsDataDefault,
  onShowDetails,
}) {
  const [query, setQuery] = useState("");

  // 1) Fetch from API on mount; fall back to provided data on error
  const [fetchedReports, setFetchedReports] = useState(null);
  const [loadError, setLoadError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/reports", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // Expect either { reports: [...] } or an array; adapt gently
        const reports = Array.isArray(json) ? json : json?.reports;
        if (!cancelled) setFetchedReports(reports ?? []);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message);
          // leave fetchedReports as null so we fall back to prop data below
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Source of truth for the list (API if available, else prop JSON)
  const reportsArray = (fetchedReports ?? data.reports) || [];

  // Existing logic unchanged
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return reportsArray;
    return reportsArray.filter((r) =>
      [String(r.id), r.category, r.issue, r.reporter, r.reportId].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  }, [reportsArray, query]);

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
        {/* Optional: tiny inline load state */}
        {fetchedReports === null && !loadError && (
          <div className="mt-2 text-xs text-gray-500">Loading reports…</div>
        )}
        {loadError && (
          <div className="mt-2 text-xs text-red-500">
            Failed to load from API, showing local data.
          </div>
        )}
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
          {pageRows.map((r, idx) => (
            <ReportRow
              // Prefer the most unique, stable key available:
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
              onDetails={() =>
                onShowDetails?.({
                  type: "report",
                  data: r, // revert to the original shape the parent expects
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
