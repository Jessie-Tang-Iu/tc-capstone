"use client";

import { useState } from "react";
import PopupMessage from "@/app/components/ui/PopupMessage";
import EventFooterBar from "@/app/components/event/eventFooter";
import { supabase } from "@/lib/supabaseClient";

export default function EventDetailClient({ event }) {
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

    // Check if the user already registered
    const { data: existing, error: fetchError } = await supabase
      .from("workshop_booking")
      .select("*")
      .eq("userID", 1) // Replace 1 with actual user ID if you have auth
      .eq("workshopID", event.id);

    if (fetchError) {
      console.error("Check error:", fetchError.message);
      setErrorMessage("Something went wrong. Please try again.");
      return;
    }

    if (existing.length > 0) {
      setErrorMessage("You already registered for this event.");
      return;
    }

    // Proceed to insert new booking
    const { error } = await supabase.from("workshop_booking").insert([
      {
        workshopID: event.id,
        userID: 1, // dummy user
        status: "active",
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        setErrorMessage("You already registered for this event.");
      } else {
        console.error("Registration error:", error.message);
        setErrorMessage("Registration failed. Please try again.");
      }
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
