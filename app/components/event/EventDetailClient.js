"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import PopupMessage from "@/app/components/ui/PopupMessage";
import EventFooterBar from "@/app/components/event/eventFooter";

export default function EventDetailClient({ event }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegisterClick = () => {
    if (event.status !== "active") {
      if (event.status === "completed") {
        setErrorMessage(
          `Registration failed. This event ended on ${event.date}.`
        );
      } else if (event.status === "cancelled") {
        setErrorMessage("Registration failed. This event has been cancelled.");
      } else {
        setErrorMessage("You cannot register for this event.");
      }
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    try {
      if (!isLoaded || !isSignedIn) {
        throw new Error("Please sign in to register.");
      }

      const res = await fetch("/api/event_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          userId: user.id, // Clerk ID
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error("You already registered for this event.");
        }
        throw new Error(errData.error || "Registration failed.");
      }

      setShowSuccess(true);
    } catch (e) {
      setErrorMessage(e.message || "Registration failed.");
    }
  };

  const dateTime =
    event.date && event.date.includes("T")
      ? event.date // already ISO
      : `${event.date}T${event.start_time}`;

  return (
    <>
      <EventFooterBar
        eventId={event.id}
        title={event.title}
        dateTime={dateTime}
        onRegister={handleRegisterClick}
      />

      {showConfirm && (
        <PopupMessage
          type="confirm"
          title="Register?"
          description="Are you sure that you want to register for this event?"
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}

      {showSuccess && (
        <PopupMessage
          type="success"
          title="You have successfully registered for this event!"
          description={["Please arrive 15 minutes early.", "See you there!"]}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {errorMessage && (
        <PopupMessage
          type="error"
          title={
            errorMessage.includes("already registered")
              ? "Already Registered"
              : "Registration Failed"
          }
          description={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </>
  );
}
