// app/messages/ChatWindow.jsx (client)
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ChatWindow({
  me, // current user id (string)
  recipient, // peer user id (string)
  onClose,
  onSent, // callback after a successful send
  className = "",
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const panelRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [recipientName, setRecipientName] = useState("");

  // Load user names
  useEffect(() => {
    if (!recipient) return;
    (async () => {
      try {
        const res = await fetch(`/api/users/${recipient}`);
        if (!res.ok) throw new Error("Failed to fetch recipient");
        const recipientData = await res.json();
        setRecipientName(`${recipientData.first_name} ${recipientData.last_name}`);
      } catch (err) {
        console.error("Error loading user names:", err);
      }
    })();
  }, [recipient]);

  // Load conversation
  useEffect(() => {
    const loadConversation = async () => {
      // after fetch of GET conversation
      const res = await fetch(
        `/api/messages/conversation?userA=${encodeURIComponent(
          me
        )}&userB=${encodeURIComponent(recipient)}`
      );
      if (!res.ok) {
        console.error("Failed to load conversation:", await res.text());
        return;
      }
      const rows = await res.json();
      const mapped = rows.map((m) => ({
        id: m.id,
        from: m.sent_user_id === me ? "me" : "them",
        text: m.content,
        ts: m.sent_at,
      }));
      setMessages(mapped);
      // Optionally mark read
      fetch(`/api/messages/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUser: recipient, toUser: me }),
      }).catch(() => {});
    };

    if (me && recipient) loadConversation();

    const intervalId = setInterval(loadConversation, 5000);

    // 3. Cleanup function: This runs when the component unmounts or dependencies change.
    return () => {
      console.log("Stopping message polling interval.");
      clearInterval(intervalId);
    };

  }, [me, recipient]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current &&
      (scrollRef.current.scrollTop = scrollRef.current.scrollHeight);
  }, [messages]);

  const send = async () => {
    const value = text.trim();
    if (!value || !me || !recipient) {
      setErrorMsg(
        "Cannot send message. Missing sender or recipient information."
      );
      return;
    }

    // optimistic add
    const temp = {
      id: `temp-${Date.now()}`,
      from: "me",
      text: value,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, temp]);
    setText("");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sent_user_id: me,
          receive_user_id: recipient,
          content: value,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 404) {
          setErrorMsg("Recipient not found. Message could not be sent.");
        } else {
          setErrorMsg("Server error. Please try again later.");
        }
        console.error("Message send failed:", res.status, errText);
        setMessages((prev) => prev.filter((m) => m.id !== temp.id));
        return;
      }

      const saved = await res.json();
      setMessages((m) =>
        m.map((x) =>
          x.id === temp.id
            ? {
                id: saved.id,
                from: "me",
                text: saved.content,
                ts: saved.sent_at,
              }
            : x
        )
      );
      onSent?.();
    } catch (err) {
      console.error("Network or server error:", err);
      setErrorMsg("Network connection failed. Message not sent.");
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
    }
  };

  const keyHandler = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Group by date for headers
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

  const handleBackdropClick = (e) => {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target)) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-end p-6"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className={`rounded-xl border border-gray-300 bg-white shadow-lg text-black w-[360px] h-[460px] flex flex-col overflow-hidden ${className}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="text-sm font-semibold">To: {recipientName}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 text-xs px-3 py-2 border-t border-red-300">
            {errorMsg}
          </div>
        )}

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
