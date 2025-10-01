"use client";

import { useMemo, useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";

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

export default function MessagePage({ currentUserId }) {
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]); // inbox rows
  const [openChat, setOpenChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(""); // peer user id (string)

  // selection
  const [selected, setSelected] = useState(new Set());
  const allIdsInView = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize).map((r) => r.id);
  }, [rows, page]);

  // Fetch inbox (simple version: last N messages; you can group by peer later)
  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      const res = await fetch(
        `/api/messages/inbox?userId=${encodeURIComponent(currentUserId)}`
      );
      if (!res.ok) return;
      const rows = await res.json();
      const mapped = rows.map((m) => {
        const peer =
          m.sent_user_id === currentUserId ? m.receive_user_id : m.sent_user_id;
        const sentDate = new Date(m.sent_at);
        return {
          id: m.conversation_id,
          name: peer,
          message: m.content,
          date: sentDate.toLocaleDateString(),
          time: sentDate.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          raw: m,
        };
      });
      setRows(mapped);
    })();
  }, [currentUserId]);

  const handleRowClick = (row) => {
    setChatRecipient(row.name); // peer user id
    setOpenChat(true);
  };

  const toggleAll = () => {
    const next = new Set(selected);
    const allChecked = allIdsInView.every((id) => next.has(id));
    (allChecked ? allIdsInView : []).forEach((id) => next.delete(id));
    if (!allChecked) allIdsInView.forEach((id) => next.add(id));
    setSelected(next);
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const removeSelected = async () => {
    if (selected.size === 0) return;

    try {
      await Promise.all(
        Array.from(selected).map((conversationId) =>
          fetch(`/api/messages/conversation/${conversationId}`, {
            method: "DELETE",
          })
        )
      );

      setRows((prev) => prev.filter((r) => !selected.has(r.id)));
      setSelected(new Set());
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const refresh = async () => {
    if (!currentUserId) return;
    const res = await fetch(
      `/api/messages/inbox?userId=${encodeURIComponent(currentUserId)}`
    );
    if (res.ok) {
      const rows = await res.json();
      const mapped = rows.map((m) => {
        const peer =
          m.sent_user_id === currentUserId ? m.receive_user_id : m.sent_user_id;
        return {
          id: m.conversation_id,
          name: peer,
          message: m.content,
          date: new Date(m.sent_at).toLocaleString(),
          raw: m,
        };
      });
      setRows(mapped);
      setSelected(new Set());
      setPage(1);
    }
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <main>
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
                    } transition hover:bg-gray-100 cursor-pointer`}
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
                      <div>{row.date}</div>
                      <div className="text-gray-500 text-xs">{row.time}</div>
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

      {openChat && (
        <ChatWindow
          me={currentUserId}
          recipient={chatRecipient}
          onClose={() => setOpenChat(false)}
          onSent={() => refresh()} // refresh inbox after sending
        />
      )}
    </main>
  );
}
