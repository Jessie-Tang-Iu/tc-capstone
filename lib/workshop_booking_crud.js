import { supabase } from "@/lib/supabaseClient";

export async function createWorkshopBooking({
  userID,
  workshop_id,
  status = "active",
}) {
  const { data, error } = await supabase.from("workshop_booking").insert([
    {
      userID,
      workshop_id,
      status,
    },
  ]);

  if (error) {
    console.error("Create Error:", error.message);
    throw error;
  }
  return data;
}

export async function getBookingsByUser(userID) {
  const { data, error } = await supabase
    .from("workshop_booking")
    .select("*")
    .eq("userID", userID);

  if (error) {
    console.error("Read Error:", error.message);
    throw error;
  }
  return data;
}

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

export async function deleteBooking(bookingId) {
  const { data, error } = await supabase
    .from("workshop_booking")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error("Delete Error:", error.message);
    throw error;
  }
  return data;
}
