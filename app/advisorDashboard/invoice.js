"use client";

import { useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import invoicesData from "@/app/data/invoices.json";
import InvoiceRow from "./invoiceRow";
import PlaceholderCard from "../components/adminDashboard/PlaceholderCard";

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



export default function Invoice() {

    const [query, setQuery] = useState("");
    const [invoices, setInvoices] = useState(invoicesData.invoices || []);

    const filtered = invoices.filter((i) => {
        const queryLC = query.toLowerCase();
        return (
            String(i.id).toLowerCase().includes(queryLC) ||
            (i.client && i.client.toLowerCase().includes(queryLC)) ||
            (i.invoiceId && String(i.invoiceId).toLowerCase().includes(queryLC)) ||
            (i.location && i.location.toLowerCase().includes(queryLC))
        )
    });

    // pagination (5 per page)
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, filtered.length);
    const pageRows = filtered.slice(start, end);

    return(
        <main>
            {/* Header: centered title, search on its own row */}
            <div className="mb-4 rounded-xl bg-white p-6 shadow text-center">
                <div className="mb-4 text-3xl font-semibold text-[#E55B3C]">
                    Invoice Management
                </div>
                <div className="flex justify-center">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onSearch={() => {}}
                        placeholder="Invoice No | Client Name | Location"
                    />
                </div>
            </div>

            {/* Page Indicator */}
            <div className="mb-2 flex items-center justify-between text-sm text-black">
                <div>Total Invoice: {filtered.length}</div>
                <div className="flex items-center gap-2">
                    <span>
                        {filtered.length === 0 ? "0" : `${start + 1}-${end}`}
                    </span>
                    <span>/ {filtered.length}</span>
                    <button
                    className="rounded-md p-1 hover:bg-gray-100 disabled:opacity-40"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    ><IconChevronLeft />
                    </button>
                    <button
                    className="rounded-md p-1 hover:bg-gray-100 disabled:opacity-40"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    ><IconChevronRight />
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
                    {pageRows.map((i) => (
                        <InvoiceRow
                            key={i.id}
                            invoiceId={i.invoiceId}
                            client={i.client}
                            location={i.location}
                            timeAgo={i.timeAgo}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}