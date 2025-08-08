import { supabase } from "./supabaseClient";

export async function createUser(firstname, lastname, status = "active") {
  const { data, error } = await supabase
    .from("user")
    .insert([{ firstname, lastname, status }]);
  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase.from("user").select("*").order("id");
  if (error) throw error;
  return data;
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from("user")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from("user").delete().eq("id", id);
  if (error) throw error;
  return true;
}
