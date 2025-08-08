import { supabase } from "./supabaseClient";

export async function getAllEvents() {
  const { data, error } = await supabase
    .from("workshop")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  console.log("Fetched workshop:", data); // 👈 LOG THIS
  return data;
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from("workshop")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createEvent(eventData) {
  const { data, error } = await supabase
    .from("workshop")
    .insert([eventData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEvent(id, updateData) {
  const { data, error } = await supabase
    .from("workshop")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase.from("workshop").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function updateEventStatus(id, status) {
  const { error } = await supabase
    .from("workshop")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error(`Error updating event ${id}:`, error.message);
  }
}
