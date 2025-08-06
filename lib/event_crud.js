import { supabase } from "./supabaseClient";

export async function getAllEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  console.log("Fetched events:", data); // 👈 LOG THIS
  return data;
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createEvent(eventData) {
  const { data, error } = await supabase
    .from("events")
    .insert([eventData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEvent(id, updateData) {
  const { data, error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
