import { supabase } from "@/lib/supabaseClient";

// Create a new workshop booking
export async function createWorkshopBooking({
  userID,
  workshopID,
  status = "active",
}) {
  const { data, error } = await supabase.from("workshop_booking").insert([
    {
      userID,
      workshopID,
      status,
    },
  ]);

  if (error) {
    console.error("Create Error:", error.message);
    throw error;
  }

  return data;
}

// Get bookings by userID
export async function getBookingsByUser(userID) {
  const { data, error } = await supabase
    .from("workshop_booking")
    .select(
      `
        *,
        users (*),
        workshop (*)
      `
    )
    .eq("userID", userID); // case-sensitive match
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }

  console.log("Supabase result:", data);
  return data;
}

// Update booking status
export async function updateBookingStatus(bookingId, newStatus) {
  const { data, error } = await supabase
    .from("workshop_booking")
    .update({ status: newStatus })
    .eq("id", bookingId);

  if (error) {
    console.error("Update Error:", error.message);
    throw error;
  }

  return data;
}

export async function deleteBookingByWorkshopId(workshopId, userId) {
  const { error } = await supabase
    .from("workshop_booking")
    .delete()
    .eq("workshopID", workshopId)
    .eq("userID", userId);

  if (error) {
    console.error("Delete Error:", error.message);
    throw new Error("Failed to delete booking: " + error.message);
  }
}
