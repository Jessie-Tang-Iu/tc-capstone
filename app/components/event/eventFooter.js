"use client";

import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { formatDateToFullDisplay } from "../ui/formatDate";
import { useUser } from "@clerk/nextjs";

export default function EventFooterBar({ dateTime, title, eventId }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [formattedDate, setFormattedDate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!dateTime) {
      setFormattedDate("Date not available");
      return;
    }

    const parsed = new Date(dateTime);
    if (isNaN(parsed.getTime())) {
      setFormattedDate("Invalid date");
      return;
    }

    setFormattedDate(formatDateToFullDisplay(dateTime));
  }, [dateTime]);

  const handleRegister = async () => {
    try {
      if (!isLoaded || !isSignedIn) {
        setMessage("Please sign in first");
        return;
      }

      setIsRegistering(true);
      const res = await fetch("/api/event_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          userId: user.id, // Clerk user id
        }),
      });

      const text = await res.text();
      console.log("register response:", res.status, text);
      console.log("sending:", { eventId, userId: user.id });

      if (!res.ok) throw new Error("Failed to register");
      setMessage("Successfully registered!");
    } catch (err) {
      setMessage(err.message || "Error during registration");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white px-6 py-4 border-t border-gray-200 z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <div className="flex flex-col">
        <div className="text-black text-sm sm:text-base">
          {formattedDate || "—"}
        </div>
        <div className="text-black font-bold text-base sm:text-lg">{title}</div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {message && (
          <p className="text-sm text-gray-600 text-center sm:text-left">
            {message}
          </p>
        )}
        <Button
          text={isRegistering ? "Registering..." : "Register Me"}
          onClick={handleRegister}
          disabled={isRegistering}
        />
      </div>
    </div>
  );
}
