"use client";

import { useState } from "react";
import PopupMessage from "@/app/components/ui/PopupMessage";
import EventFooterBar from "@/app/components/event/eventFooter";
import { supabase } from "@/lib/supabaseClient";

// Helper to fetch (or provision) the row in public."user"
async function getOrCreateAppUserRow() {
  const {
    data: { user: authUser },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !authUser) {
    throw new Error("Please sign in to register.");
  }

  const email = authUser.email;
  if (!email) throw new Error("Your account has no email.");

  // Try to find existing row in public."user"
  let { data: userRow, error: fetchErr } = await supabase
    .from("user") // <- public."user"
    .select("id, email, firstname, lastname, username, status")
    .eq("email", email)
    .single();

  // If not found, create a minimal one (optional — remove if you don’t want auto-provision)
  if (fetchErr && fetchErr.code === "PGRST116") {
    const { data, error: insertErr } = await supabase
      .from("user")
      .insert({
        email,
        username: email, // or derive something else
        status: "active",
      })
      .select("id, email")
      .single();

    if (insertErr) throw new Error("Could not create user profile.");
    userRow = data;
  } else if (fetchErr) {
    throw new Error("Could not load your user profile.");
  }

  return userRow; // contains .id
}

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

    try {
      // 1) Resolve the app user row in public."user"
      const appUser = await getOrCreateAppUserRow();
      const userId = appUser.id;

      // 2) Already registered?
      const { data: existing, error: fetchError } = await supabase
        .from("workshop_booking")
        .select("id")
        .eq("userID", userId)
        .eq("workshopID", event.id);

      if (fetchError)
        throw new Error("Something went wrong. Please try again.");
      if (existing && existing.length > 0) {
        setErrorMessage("You already registered for this event.");
        return;
      }

      // 3) Insert booking
      const { error: insertErr } = await supabase
        .from("workshop_booking")
        .insert({
          workshopID: event.id,
          userID: userId, // <-- FK to public."user"(id)
          status: "active",
        });

      if (insertErr) {
        if (insertErr.code === "23505") {
          setErrorMessage("You already registered for this event.");
        } else if (insertErr.code === "42501") {
          setErrorMessage("You are not allowed to register. (RLS/policy)");
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
        return;
      }

      setShowSuccess(true);
    } catch (e) {
      setErrorMessage(e.message || "Registration failed.");
    }
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
