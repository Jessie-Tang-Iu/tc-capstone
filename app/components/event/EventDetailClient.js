"use client";

import { useState } from "react";
import PopupMessage from "@/app/components/ui/PopupMessage";
import EventFooterBar from "@/app/components/event/eventFooter";
import { supabase } from "@/lib/supabaseClient"; // Adjust if needed

export default function EventDetailClient({ event }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegisterClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);

    const { error } = await supabase.from("workshop_booking").insert([
      {
        workshopID: event.id,
        userID: 1, // default dummy user
        status: "active", // optional status
      },
    ]);

    if (error) {
      console.error("Registration error:", error.message);
      setErrorMessage("Registration failed. Please try again.");
      return;
    }

    setShowSuccess(true);
  };

  return (
    <>
      <EventFooterBar
        dateTime={event.date}
        title={event.title}
        onRegister={handleRegisterClick}
      />

      {showConfirm && (
        <PopupMessage
          type="confirm"
          title="Register?"
          description="Are you sure that you want to register to this event?"
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}

      {showSuccess && (
        <PopupMessage
          type="success"
          title="You have successfully registered for this event!"
          description={[
            "Please remember to attend the event 15 minutes earlier!",
            "See you there!",
          ]}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {errorMessage && (
        <PopupMessage
          type="success"
          title="Registration Failed"
          description={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </>
  );
}
