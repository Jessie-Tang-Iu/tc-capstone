"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../../components/NavBarBeforeSignIn";
import AdminSideBar from "../../components/adminDashboard/AdminSideBar";
import ChatWindow from "@/app/components/ChatWindow";

const MOCK_MESSAGES = [
  {
    id: 1,
    name: "John Doe",
    message: "Sure! You can see my available time on the booking management",
    date: "Jun 15, 2025",
  },
  // dummy data → total 50 messages
  ...Array.from({ length: 49 }, (_, i) => ({
    id: i + 2,
    name: `Joy Wong ${i + 1}`,
    message: "Yes, you are right about the job application, i will have a …",
    date: "Jun 15, 2025",
  })),
];

// sidebar
const Sidebar = () => {
  const pathname = usePathname();
  const menu = [
    { name: "Message", href: "/employerDashboard/message" },
    { name: "Application", href: "/employerDashboard/application" },
    { name: "Job Post", href: "/employerDashboard/jobPost" },
  ];

  return (
    <aside className="ml-0 w-52 shrink-0 rounded-lg bg-[#F7F3F0] p-1 shadow">
      {menu.map((m) => {
        const active = pathname?.startsWith(m.href);
        return (
          <Link key={m.name} href={m.href} className="block">
            <div
              className={`rounded-md px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#E2B596] text-black"
                  : "text-black hover:bg-[#F0E0D5]"
              }`}
            >
              {m.name} <span className="ml-1">{">"}</span>
            </div>
          </Link>
        );
      })}
    </aside>
  );
};

// icons
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
    <path
      fill="currentColor"
      d="M17.65 6.35A7.95 7.95 0 0012 4a8 8 0 108 8h-2a6 6 0 11-1.76-4.24L13 11h7V4l-2.35 2.35z"
    />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
    <path
      fill="currentColor"
      d="M6 7h12l-1 13a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7zm9-4l1 2h4v2H4V5h4l1-2h6z"
    />
  </svg>
);
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path
      fill="currentColor"
      d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
    />
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path
      fill="currentColor"
      d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"
    />
  </svg>
);

// main page
const MessagePage = () => {
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(MOCK_MESSAGES);
  const [openChat, setOpenChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState("");

  const handleRowClick = (row) => {
    setChatRecipient(row.name);
    setOpenChat(true);
  };

  // selection
  const [selected, setSelected] = useState(new Set());
  const allIdsInView = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize).map((r) => r.id);
  }, [rows, page]);

  const toggleAll = () => {
    const next = new Set(selected);
    const allChecked = allIdsInView.every((id) => next.has(id));
    if (allChecked) {
      allIdsInView.forEach((id) => next.delete(id));
    } else {
      allIdsInView.forEach((id) => next.add(id));
    }
    setSelected(next);
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const removeSelected = () => {
    if (selected.size === 0) return;
    setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
  };

  const refresh = () => {
    setRows([...MOCK_MESSAGES]);
    setSelected(new Set());
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full px-6 py-8 bg-white rounded-xl">
        <h1 className="mb-6 text-2xl font-bold text-[#DD5B45]">
          Admin DashBoard
        </h1>

        <div className="flex gap-6">
          <AdminSideBar />

          <section className="flex-1 rounded-xl bg-white shadow">
            {/* Header row above table */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-black">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#DD5B45]"
                    checked={
                      allIdsInView.every((id) => selected.has(id)) &&
                      allIdsInView.length > 0
                    }
                    onChange={toggleAll}
                  />
                  <span className="hidden sm:block">Select all</span>
                </label>
                <button
                  onClick={refresh}
                  className="rounded-md p-2 text-black hover:bg-gray-100"
                  title="Refresh"
                >
                  <IconRefresh />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-black">
                <span>
                  {rows.length === 0
                    ? "0"
                    : `${start + 1}-${Math.min(start + pageSize, rows.length)}`}
                </span>
                <span>/ {rows.length}</span>
                <button
                  className="rounded-md p-2 hover:bg-gray-100"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <IconChevronLeft />
                </button>
                <button
                  className="rounded-md p-2 hover:bg-gray-100"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <IconChevronRight />
                </button>
                <button
                  onClick={removeSelected}
                  className={`ml-2 flex items-center gap-1 rounded-md border px-2 py-1 text-black transition ${
                    selected.size
                      ? "border-gray-300 hover:bg-red-50 hover:text-red-600"
                      : "cursor-not-allowed opacity-40"
                  }`}
                  disabled={selected.size === 0}
                  title="Delete selected"
                >
                  <IconTrash />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#F3E1D5] text-left text-gray-800">
                  <tr>
                    <th className="w-12 px-4 py-3"></th>
                    <th className="w-64 px-4 py-3">Name</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="w-40 px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row, idx) => {
                    const checked = selected.has(row.id);
                    const zebra = idx % 2 === 0 ? "bg-white" : "bg-white";
                    return (
                      <tr
                        key={row.id}
                        className={`${
                          checked ? "bg-[#F0D6C2]" : zebra
                        } transition hover:bg-gray-100 ursor-pointer`}
                        onClick={() => handleRowClick(row)}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#DD5B45]"
                            checked={checked}
                            onChange={() => toggleOne(row.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-black">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-black">
                          <span className="line-clamp-1">{row.message}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-black">
                          {row.date}
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        No messages yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {openChat && (
          <ChatWindow
            recipient={chatRecipient}
            onClose={() => setOpenChat(false)}
            onSend={(text) => console.log("send:", { to: chatRecipient, text })}
          />
        )}
      </main>
    </div>
  );
};

export default MessagePage;
