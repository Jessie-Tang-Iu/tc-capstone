// lib/workshop_booking_crud.js
import { supabase } from "@/lib/supabaseClient";

// Create a new workshop booking
export async function createWorkshopBooking({
  userID,
  workshopID,
  status = "active",
}) {
  const { data, error } = await supabase
    .from("workshop_booking")
    .insert([{ userID, workshopID, status }]);
  if (error) throw error;
  return data;
}

// Get bookings for the current user (RLS will scope rows to the caller)
export async function getMyBookings() {
  const { data, error } = await supabase.from("workshop_booking").select(`
      id,
      userID,
      workshopID,
      status,
      user:userID ( id, email, firstName, lastName ),
      workshop:workshopID ( id, title, date, start_time )
    `);
  if (error) throw error;
  return data ?? [];
}

// If you really need by userID (server-side or service role only)
export async function getBookingsByUser(userID) {
  const { data, error } = await supabase
    .from("workshop_booking")
    .select(
      `
      id,
      userID,
      workshopID,
      status,
      user:userID ( id, email, firstName, lastName ),
      workshop:workshopID ( id, title, date, start_time )
    `
    )
    .eq("userID", userID);
  if (error) throw error;
  return data ?? [];
}

// Update booking status
export async function updateBookingStatus(bookingId, newStatus) {
  const { data, error } = await supabase
    .from("workshop_booking")
    .update({ status: newStatus })
    .eq("id", bookingId);
  if (error) throw error;
  return data;
}

// Delete by workshop for the current user (RLS will ensure it's *your* row)
export async function deleteBookingByWorkshopId(workshopId) {
  const { error } = await supabase
    .from("workshop_booking")
    .delete()
    .eq("workshopID", workshopId);
  if (error) throw error;
}
