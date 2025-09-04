"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ChatWindow({
  recipient = "John Doe",
  initialMessages,
  onClose,
  onSend,
  className = "",
}) {
  const FAKE_MESSAGES = useMemo(
    () => [
      {
        id: 1,
        from: "me",
        text: "Thank you for your advice! I will try it in the future",
        ts: "2025-06-25T12:20:00",
      },
      {
        id: 2,
        from: "them",
        text: "You are welcome! Hope that would help you",
        ts: "2025-06-25T12:24:00",
      },
      {
        id: 3,
        from: "me",
        text: "I would like to book for another advisory session.",
        ts: "2025-06-25T13:30:00",
      },
      {
        id: 4,
        from: "them",
        text: "Sure! You can see my available time on the booking management",
        ts: "2025-06-25T14:00:00",
      },
    ],
    []
  );

  const [messages, setMessages] = useState(initialMessages || FAKE_MESSAGES);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const panelRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Auto-scroll to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Send message
  const send = () => {
    const value = text.trim();
    if (!value) return;
    const msg = {
      id: Date.now(),
      from: "me",
      text: value,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, msg]);
    setText("");
    onSend?.(value);
  };

  const keyHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Group by date for separators like "Jun 25, 2025"
  const groups = useMemo(() => {
    const fmt = (d) =>
      new Date(d).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return messages.reduce((acc, m) => {
      const k = fmt(m.ts);
      (acc[k] ||= []).push(m);
      return acc;
    }, {});
  }, [messages]);

  // Close when clicking the backdrop (outside the panel)
  const handleBackdropClick = (e) => {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target)) onClose?.();
  };

  return (
    // Backdrop layer
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-end p-6"
      onMouseDown={handleBackdropClick}
    >
      {/* Chat panel */}
      <div
        ref={panelRef}
        className={
          `rounded-xl border border-gray-300 bg-white shadow-lg text-black ` +
          `w-[360px] h-[460px] flex flex-col overflow-hidden ${className}`
        }
        onMouseDown={(e) => e.stopPropagation()} // prevent bubbling to backdrop
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="text-sm font-semibold">To: {recipient}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 py-2 space-y-4"
        >
          {Object.entries(groups).map(([date, msgs]) => (
            <div key={date}>
              <div className="my-2 text-center text-xs text-gray-500 mt-2">
                {date}
              </div>
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.from === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-snug mt-3 ${
                      m.from === "me"
                        ? "bg-[#F3E1D5] text-black rounded-br-sm"
                        : "bg-gray-100 text-black rounded-bl-sm"
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className="mt-1 text-[10px] text-gray-500 text-right">
                      {new Date(m.ts).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="border-t p-2">
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={keyHandler}
              placeholder="Write a message..."
              className="flex-1 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              onClick={send}
              className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
              disabled={!text.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
